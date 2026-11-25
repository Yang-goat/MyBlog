import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temporary = path.join(root, "src/.vuepress/.temp/knowledge-graph");
const dist = path.join(root, "src/.vuepress/dist");
const data = (await import(pathToFileURL(path.join(temporary, "data.js")))).default;
const diagnostics = JSON.parse(readFileSync(path.join(temporary, "diagnostics.json"), "utf8"));
assert.equal(diagnostics.fingerprint, data.fingerprint, "Graph and diagnostics are out of sync");
assert.equal(diagnostics.unresolved.length, 0, "Unresolved article links: inspect graph diagnostics");
assert.equal(diagnostics.ambiguousAliases.length, 0, "Ambiguous graph routes");

const guide = JSON.parse(readFileSync(path.join(root, "docs/academic-writing-guide-sources.json"), "utf8"));
const guidePrefix = "/research/academic-writing-guide/";
const researchArticles = data.nodes.filter((node) => node.type === "article" && node.group === "research");
const expectedGuideRoutes = guide.pages.filter((page) => page.file !== "README.md")
  .map((page) => guidePrefix + page.file.replace(/\.md$/, ".html"));
assert.deepEqual(researchArticles.map((node) => node.path).filter((route) => route.startsWith(guidePrefix)).sort(),
  expectedGuideRoutes.sort(), "Guide articles in the research group differ from the source manifest");
assert.ok(researchArticles.some((node) => node.path === "/research/paper-notes/reading-workflow.html"),
  "Migrated paper notes missing from research group");

const ids = new Set(data.nodes.map(({ id }) => id));
assert.equal(ids.size, data.nodes.length, "Duplicate node ids");
for (const node of data.nodes) {
  assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y), `Invalid position: ${node.id}`);
  if (node.type !== "article") continue;
  const route = decodeURIComponent(node.path);
  const output = path.resolve(dist, `.${route.endsWith("/") ? `${route}index.html` : route}`);
  assert.ok(output.startsWith(`${dist}${path.sep}`), `Invalid graph route: ${route}`);
  assert.ok(existsSync(output), `Graph target not built: ${route}`);
}
const edgeIds = new Set();
for (const edge of data.edges) {
  assert.ok(ids.has(edge.source) && ids.has(edge.target), `Dangling graph edge: ${edge.id}`);
  assert.notEqual(edge.source, edge.target, `Self edge: ${edge.id}`);
  assert.ok(!edgeIds.has(edge.id), `Duplicate edge: ${edge.id}`);
  edgeIds.add(edge.id);
}
const count = (type, items) => items.filter((item) => item.type === type).length;
assert.equal(count("article", data.nodes), data.stats.articles);
assert.equal(count("topic", data.nodes), data.stats.topics);
assert.equal(count("citation", data.edges), data.stats.citations);
assert.equal(count("tag", data.edges), data.stats.memberships);
const graphPage = path.join(dist, "ai-applications/knowledge-retrieval/knowledge-graphs/site-knowledge-graph.html");
const html = readFileSync(graphPage, "utf8");
assert.ok(html.includes("本站知识图谱"), "Graph page title missing");
assert.ok(html.includes("kg-placeholder"), "SSR graph placeholder missing");
assert.ok(!html.includes(data.fingerprint), "Graph data should be loaded only by the mounted explorer");
console.log(`Built graph verified: ${data.stats.articles} article routes, ${data.stats.topics} topics, ${data.edges.length} valid edges; no unresolved references.`);
