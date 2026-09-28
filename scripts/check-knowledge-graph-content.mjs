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

function verify(manifest) {
  let links = 0;
  const markdown = createMarkdown();
  const visibleText = (body) => markdown.parse(body, {}).map((token) => token.children
    ? token.children.filter((child) => !["link_open", "link_close"].includes(child.type))
      .map((child) => child.content).join("")
    : token.content).join("\n");
  const seen = new Set();
  for (const item of manifest.articles) {
    assert.ok(/^src\/(ai-algorithms|ai-applications|notes|paper-notes|software-tools)\/.+\.md$/.test(item.path));
    assert.ok(!item.path.endsWith("/README.md") && !item.path.endsWith("/site-knowledge-graph.md"));
    assert.ok(!seen.has(item.path), `Duplicate manifest path: ${item.path}`);
    seen.add(item.path);
    const bytes = readFileSync(path.join(root, item.path));
    const article = splitArticle(bytes);
    assert.equal(sha256(bytes), item.afterSha256, `${item.path}: file differs from reviewed batch`);
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
    assert.equal(sha256(body), item.originalBodySha256, `${item.path}: body bytes changed beyond recorded links`);
    if (item.links.length) {
      assert.equal(visibleText(article.body), visibleText(body.toString("utf8")),
        `${item.path}: adding links changed Markdown text rendering`);
    }
    const restoredFrontmatter = article.frontmatter.slice(0, tagBlock(article.frontmatter).start)
      + item.tags.beforeBlock
      + article.frontmatter.slice(tagBlock(article.frontmatter).start + tagBlock(article.frontmatter).text.length);
    const restored = Buffer.concat([Buffer.from(article.opening + restoredFrontmatter + article.closing), body]);
    assert.equal(sha256(restored), item.beforeSha256, `${item.path}: whole original file cannot be reconstructed`);
  }
  console.log(`Content protection passed: ${manifest.articles.length} articles, ${links} added links; original body bytes, Markdown text, non-tag metadata, BOM and line endings preserved.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    verify(JSON.parse(readFileSync(path.join(root, "docs/knowledge-graph-content-changes.json"), "utf8")));
  } catch (error) {
    console.error(`Content protection failed: ${error.message}`);
    process.exitCode = 1;
  }
}
