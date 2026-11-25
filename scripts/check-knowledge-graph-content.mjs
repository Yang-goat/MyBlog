import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMarkdown } from "vuepress/markdown";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

/** Split without normalizing BOM, line endings, or whitespace. */
export function splitArticle(bytes) {
  const text = bytes.toString("utf8");
  assert.equal(Buffer.from(text).compare(bytes), 0, "Invalid UTF-8 article");
  const match = /^(\uFEFF?---\r?\n)([\s\S]*?)(^---[ \t]*(?:\r?\n|$))/m.exec(text);
  assert.ok(match && match.index === 0, "Missing frontmatter");
  return {
    opening: match[1],
    frontmatter: match[2],
    closing: match[3],
    body: text.slice(match[0].length),
  };
}

/** Only the top-level tag block is permitted to differ. */
export function tagBlock(frontmatter) {
  const match = /^tag:[^\r\n]*(?:\r?\n[ \t]+[^\r\n]*)*(?:\r?\n|$)/m.exec(frontmatter);
  return match ? { start: match.index, text: match[0] } : { start: frontmatter.length, text: "" };
}

export function protectedFrontmatter(article) {
  const block = tagBlock(article.frontmatter);
  return article.opening + article.frontmatter.slice(0, block.start)
    + article.frontmatter.slice(block.start + block.text.length) + article.closing;
}

// A clean checkout can have uniform LF or CRLF even when the audited file was mixed.
// Recreate that layout before using the original byte offsets and hashes.
function restoreAuditLineEndings(bytes, ranges = []) {
  if (!bytes.includes(13) && ranges.length === 0) return bytes;
  const text = bytes.toString("utf8");
  assert.equal(Buffer.from(text).compare(bytes), 0, "Invalid UTF-8 article");
  if (text.includes("\r\n") && /(?<!\r)\n/.test(text)) return bytes;
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  for (const [first, last] of ranges) {
    assert.ok(first >= 1 && first <= last && last < lines.length, "Invalid audited CRLF range");
    for (let index = first - 1; index < last; index++) lines[index] += "\r";
  }
  return Buffer.from(lines.join("\n"));
}

function verify(manifest) {
  let links = 0;
  const markdown = createMarkdown();
  const visibleText = (body) => markdown.parse(body, {}).map((token) => token.children
    ? token.children.filter((child) => !["link_open", "link_close"].includes(child.type))
      .map((child) => child.content).join("")
    : token.content).join("\n");
  const seen = new Set();
  function verifyArticle(item) {
    assert.ok(/^src\/(ai-algorithms|ai-applications|notes|research|software-tools)\/.+\.md$/.test(item.path));
    assert.ok(!item.path.endsWith("/README.md") && !item.path.endsWith("/site-knowledge-graph.md"));
    assert.ok(!seen.has(item.path), `Duplicate manifest path: ${item.path}`);
    seen.add(item.path);
    const reviewed = item.reviewedRevision ?? item;
    let bytes = restoreAuditLineEndings(readFileSync(path.join(root, item.path)), item.auditedCrlfRanges);
    if (item.routeMigration) {
      const { before, after } = item.routeMigration;
      const offset = bytes.indexOf(after);
      assert.ok(offset >= 0 && offset === bytes.lastIndexOf(after), `${item.path}: expected exact migrated route`);
      bytes = Buffer.concat([bytes.subarray(0, offset), Buffer.from(before), bytes.subarray(offset + Buffer.byteLength(after))]);
    }
    const article = splitArticle(bytes);
    assert.equal(sha256(bytes), reviewed.afterSha256, `${item.path}: file differs from reviewed batch`);
    assert.equal(sha256(protectedFrontmatter(article)), item.protectedFrontmatterSha256,
      `${item.path}: non-tag frontmatter, delimiters or BOM changed`);
    assert.equal(tagBlock(article.frontmatter).text, item.tags.afterBlock, `${item.path}: unexpected tag edit`);

    let body = Buffer.from(article.body);
    let shift = 0;
    const insertions = item.links.map((link) => {
      const wrapper = Buffer.from(`[${link.text}](${link.target})`);
      const currentOffset = link.originalBodyByteOffset + shift;
      shift += wrapper.length - Buffer.byteLength(link.text);
      return { ...link, wrapper, currentOffset };
    });
    for (let i = insertions.length - 1; i >= 0; i--) {
      const link = insertions[i];
      assert.equal(body.subarray(link.currentOffset, link.currentOffset + link.wrapper.length).compare(link.wrapper),
        0, `${item.path}: recorded link differs at byte ${link.currentOffset}`);
      assert.ok(link.target.startsWith(".") && link.target.endsWith(".md"), `${item.path}: unexpected target`);
      assert.ok(existsSync(path.resolve(root, path.dirname(item.path), link.target)), `${item.path}: target missing`);
      body = Buffer.concat([body.subarray(0, link.currentOffset), Buffer.from(link.text),
        body.subarray(link.currentOffset + link.wrapper.length)]);
      links++;
    }
    assert.equal(sha256(body), reviewed.originalBodySha256, `${item.path}: body bytes changed beyond recorded links`);
    if (item.links.length) {
      assert.equal(visibleText(article.body), visibleText(body.toString("utf8")),
        `${item.path}: adding links changed Markdown text rendering`);
    }
    const restoredFrontmatter = article.frontmatter.slice(0, tagBlock(article.frontmatter).start)
      + item.tags.beforeBlock
      + article.frontmatter.slice(tagBlock(article.frontmatter).start + tagBlock(article.frontmatter).text.length);
    const restored = Buffer.concat([Buffer.from(article.opening + restoredFrontmatter + article.closing), body]);
    assert.equal(sha256(restored), reviewed.beforeSha256, `${item.path}: whole reviewed file cannot be reconstructed`);
  }
  const failures = [];
  for (const item of manifest.articles) {
    try {
      verifyArticle(item);
    } catch (error) {
      failures.push(error.message.includes(item.path) ? error.message : `${item.path}: ${error.message}`);
    }
  }
  if (failures.length) {
    throw new Error(`${manifest.articles.length - failures.length}/${manifest.articles.length} articles passed.\n${failures.join("\n")}`);
  }
  console.log(`Content protection passed: ${manifest.articles.length} articles, ${links} added links; reviewed body bytes, Markdown text, non-tag metadata, BOM and audited line endings verified.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    verify(JSON.parse(readFileSync(path.join(root, "docs/knowledge-graph-content-changes.json"), "utf8")));
  } catch (error) {
    console.error(`Content protection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
