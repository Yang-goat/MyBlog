import assert from "node:assert/strict";
import { test } from "node:test";
import { createMarkdown } from "vuepress/markdown";
import { buildKnowledgeGraph, createPageResolver, isEligibleArticle, normalizeTags, serializeGraphModule } from "../src/.vuepress/knowledge-graph/data.mjs";
import { MARKDOWN_GRAPH_KEY } from "../src/.vuepress/knowledge-graph/config.mjs";
import { collectMarkdownGraph, descriptionText, installGraphMarkdownCollector } from "../src/.vuepress/knowledge-graph/markdown.mjs";

function page(file, content = "", frontmatter = {}, path) {
  const markdown = createMarkdown();
  installGraphMarkdownCollector(markdown);
  const env = { base: "/", filePathRelative: file, filePath: `/workspace/src/${file}`, frontmatter };
  markdown.render(content, env);
  return {
    filePath: env.filePath, filePathRelative: file,
    path: path ?? `/${file.replace(/\.md$/, ".html")}`,
    frontmatter, title: frontmatter.title ?? file,
    markdownEnv: { [MARKDOWN_GRAPH_KEY]: env[MARKDOWN_GRAPH_KEY] },
  };
}
const citations = (data) => data.edges.filter((edge) => edge.type === "citation");

test("collector uses Markdown link tokens, including reference style, before VuePress rendering", () => {
  const source = page("notes/a.md", [
    "这是一个足够长的正文段落，包含[普通链接](./b.md)与[引用链接][ref]。",
    "", "[ref]: ../ai-algorithms/c.md#chapter", "",
    "```markmap", "[不应计入](./d.md)", "```", "",
    "![图片](./e.md)", "", "[![链接图片](./f.png)](./g.md)", "",
    "<Catalog />", "", '<a href="./h.md">原始 HTML</a>',
  ].join("\n"));
  assert.deepEqual(source.markdownEnv[MARKDOWN_GRAPH_KEY].links, ["./b.md", "../ai-algorithms/c.md#chapter"]);
  assert.match(source.markdownEnv[MARKDOWN_GRAPH_KEY].excerpt, /包含普通链接与引用链接/);
  assert.doesNotMatch(source.markdownEnv[MARKDOWN_GRAPH_KEY].excerpt, /RouteLink|href|\.md/);
});

test("excerpt omits headings, code and math tokens and descriptions remain plain text", () => {
  const result = collectMarkdownGraph([
    { type: "heading_open" }, { type: "inline", children: [{ type: "text", content: "Heading" }] },
    { type: "paragraph_open" }, { type: "inline", children: [
      { type: "text", content: "这是具有足够长度的文章介绍；" },
      { type: "code_inline", content: "secretCode()" },
      { type: "math_inline", content: "\\frac{a}{b}" },
      { type: "text", content: "正文中的数学公式和代码应从预览移除。" },
    ] },
  ]);
  assert.doesNotMatch(result.excerpt, /Heading|secretCode|frac/);
  assert.match(result.excerpt, /文章介绍/);
  assert.equal(descriptionText(createMarkdown(), '<b>说明</b> **粗体** `code` [链接](./target.md)'), "说明 粗体 链接");
  assert.equal(descriptionText(createMarkdown(), '文字 $\\alpha$ 更多文字 $$x^2$$'), "文字 更多文字");
  assert.equal(descriptionText(createMarkdown(), '固定的 $F$ 与 $CR$ 不容易兼顾不同问题。'), "固定的 F 与 CR 不容易兼顾不同问题。");
});

test("only authored descriptions override the first prose paragraph", () => {
  const prose = "[经典 DE](./de.md) 的算子简单，但固定的 $F$ 与 $CR$ 不容易兼顾不同问题和搜索阶段。";
  const generatedDescription = "JADE 标题与自动摘要缺失的链接文字";
  const generated = page("notes/jade.md", `# JADE 标题\n\n${prose}`);
  generated.frontmatter.description = generatedDescription;
  const generatedExcerpt = buildKnowledgeGraph([generated]).data.nodes[0].excerpt;
  assert.equal(generatedExcerpt, "经典 DE 的算子简单，但固定的 F 与 CR 不容易兼顾不同问题和搜索阶段。");
  assert.doesNotMatch(generatedExcerpt, /JADE 标题|自动摘要/);

  const authored = page("notes/explicit.md", `---\ndescription: 作者明确写下的摘要\n---\n\n${prose}`);
  // Simulate a downstream theme/SEO hook replacing frontmatter after parsing.
  authored.frontmatter.description = generatedDescription;
  assert.equal(buildKnowledgeGraph([authored]).data.nodes[0].excerpt, "作者明确写下的摘要");
});

test("nested rendering with a shared env does not overwrite the outer article", () => {
  const markdown = createMarkdown();
  installGraphMarkdownCollector(markdown);
  const env = { filePathRelative: "notes/a.md" };
  markdown.render("[真实正文](./b.md)", env);
  markdown.render("[嵌入组件生成的内容](./c.md)", env);
  assert.deepEqual(env[MARKDOWN_GRAPH_KEY].links, ["./b.md"]);
});

test("resolved citations cover relative, reference, same-host, encoded Unicode and redirect aliases", () => {
  const source = page("notes/folder/a.md", [
    "[B](./b.md)", "[C][ref]", "[中文](/notes/%E4%B8%AD%E6%96%87.md)",
    "[同域](https://goatyang.com/notes/folder/b.html?view=1#part)",
    "[协议相对](//goatyang.com/notes/folder/b.html)", "[历史路径](/old/article.html)",
    "", "[ref]: ../../ai-algorithms/c.md",
  ].join("\n\n"));
  const b = page("notes/folder/b.md");
  const c = page("ai-algorithms/c.md", "", { redirectFrom: ["/old/article.html"] }, "/permanent/c/");
  const unicode = page("notes/中文.md", "", {}, "/notes/%E4%B8%AD%E6%96%87.html");
  const { data, diagnostics } = buildKnowledgeGraph([source, b, c, unicode]);
  assert.equal(citations(data).length, 3);
  assert.ok(data.nodes.some((node) => node.id === "article:/permanent/c/" && node.path === "/permanent/c/"));
  assert.ok(data.nodes.some((node) => node.id === "article:/notes/中文.html"));
  assert.equal(diagnostics.unresolved.length, 0);
});

test("custom deployment base resolves links while public routes remain base-free", () => {
  const source = page("notes/a.md", "[B](/blog/notes/b.html) [B2](https://goatyang.com/blog/notes/b.md)");
  const target = page("notes/b.md");
  const { data, diagnostics } = buildKnowledgeGraph([source, target], { base: "/blog/", hostname: "https://goatyang.com" });
  assert.equal(citations(data).length, 1);
  assert.equal(data.nodes.find((node) => node.id === "article:/notes/b.html").path, "/notes/b.html");
  assert.equal(diagnostics.unresolved.length, 0);
});

test("relative final-route links resolve below trailing-slash permalinks", () => {
  const source = page("notes/a.md", "[child](child.html)", {}, "/permanent/a/");
  const target = page("notes/b.md", "", {}, "/permanent/a/child.html");
  assert.equal(buildKnowledgeGraph([source, target]).data.stats.citations, 1);
});

test("self, duplicate, external and attachment links do not create extra graph edges", () => {
  const source = page("notes/a.md", [
    "[B](./b.md) [重复](./b.html#two) [自己](./a.md) [锚点](#part)",
    "[外站](https://example.com/notes/b.html) [邮箱](mailto:me@example.com) [附件](./x.pdf)",
    "[不存在](./missing.md) [目录](./README.md)",
  ].join("\n\n"));
  const target = page("notes/b.md");
  const catalog = page("notes/README.md", "", { article: false }, "/notes/");
  const { data, diagnostics } = buildKnowledgeGraph([source, target, catalog]);
  assert.equal(citations(data).length, 1);
  assert.deepEqual(diagnostics.unresolved, [{ source: "/notes/a.html", href: "./missing.md", reason: "unresolved" }]);
  assert.equal(data.stats.articles, 2);
});

test("only real public article files under the five sections are eligible", () => {
  const invalid = [
    page("notes/README.md"), page("notes/index.md"), page("en/notes/a.md"),
    page("about.md"), page("external-links/a.md"), page("notes/assets/a.md"), page("notes/tests/a.md"),
    page("notes/a.md", "", { article: false }), page("notes/a.md", "", { home: true }),
    page("notes/a.md", "", { draft: true }), page("notes/a.md", "", { published: false }),
    page("ai-applications/knowledge-retrieval/knowledge-graphs/site-knowledge-graph.md"),
    { ...page("notes/a.md"), filePath: null },
  ];
  assert.ok(invalid.every((entry) => !isEligibleArticle(entry)));
  for (const root of ["notes", "ai-algorithms", "ai-applications", "software-tools", "paper-notes"]) {
    assert.ok(isEligibleArticle(page(`${root}/a.md`)));
  }
  assert.ok(isEligibleArticle(page("notes/a.md", "", { seo: false, feed: false })));
});

test("restricted content cannot leak metadata or relationships through graph data", () => {
  const publicPage = page("notes/public.md", "[private](./private.md)", { tag: ["Public"] });
  const privatePage = page("notes/private.md", "保密内容和引用 [public](./public.md)", { title: "SECRET TITLE", tag: ["SECRET TOPIC"], password: "SECRET PASSWORD" });
  const { data } = buildKnowledgeGraph([publicPage, privatePage]);
  assert.equal(data.stats.articles, 1);
  assert.equal(data.stats.citations, 0);
  assert.doesNotMatch(serializeGraphModule(data), /SECRET|保密/);
  for (const flag of ["password", "encrypt", "encrypted", "private", "auth", "access", "requiresAuth"]) {
    assert.equal(isEligibleArticle(page("notes/a.md", "", { [flag]: true })), false, flag);
  }
  assert.equal(buildKnowledgeGraph([publicPage], { globallyEncrypted: true }).data.nodes.length, 0);
  assert.equal(buildKnowledgeGraph([publicPage], { encryptedPaths: ["/notes/"] }).data.nodes.length, 0);
  assert.equal(isEligibleArticle(page("notes/private/a.md", "", {}, "/moved.html"), { encryptedPaths: ["/notes/private/"] }), false);
});

test("topic membership is distinct from citation; general tags are excluded without dropping article tags", () => {
  const a = page("notes/a.md", "", { tag: ["教程", "共同主题", " 单独主题 ", "共同主题"] });
  const b = page("notes/b.md", "", { tag: "共同主题" });
  const c = page("notes/c.md");
  const { data } = buildKnowledgeGraph([a, b, c]);
  assert.deepEqual(data.stats, { articles: 3, topics: 2, citations: 0, memberships: 3 });
  assert.equal(data.nodes.find((node) => node.id === "topic:共同主题").count, 2);
  assert.equal(data.nodes.find((node) => node.id === "topic:单独主题").count, 1);
  assert.ok(data.nodes.find((node) => node.id === "article:/notes/a.html").tags.includes("教程"));
  assert.equal(data.nodes.find((node) => node.id === "article:/notes/c.html").degree, 0);
  assert.deepEqual(normalizeTags(["  Python ", "Python", null, "A   B"]), ["A B", "Python"]);
});

test("deterministic layout, finite positions, graph degrees and payload are reproducible", () => {
  const pages = [page("notes/b.md", "[A](./a.md)", { tag: ["共同主题"] }), page("notes/a.md", "", { tag: ["共同主题", "另一个主题"] })];
  const first = buildKnowledgeGraph(pages).data;
  const second = buildKnowledgeGraph([...pages].reverse()).data;
  assert.deepEqual(first, second);
  const byId = new Map(first.nodes.map((node) => [node.id, node]));
  for (const edge of first.edges) assert.ok(byId.has(edge.source) && byId.has(edge.target));
  for (const node of first.nodes) {
    assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y));
    assert.equal(node.degree, first.edges.filter((edge) => edge.source === node.id || edge.target === node.id).length);
  }
  assert.equal(new Set(first.nodes.map((node) => node.id)).size, first.nodes.length);
});

test("updates, creates and deletes produce current data and content fingerprints", () => {
  const a = page("notes/a.md", "[B](./b.md)", { tag: ["A"] });
  const b = page("notes/b.md", "", { tag: ["A"] });
  const first = buildKnowledgeGraph([a, b]).data;
  const changed = buildKnowledgeGraph([a, { ...b, title: "Changed title" }]).data;
  assert.notEqual(first.fingerprint, changed.fingerprint);
  const removed = buildKnowledgeGraph([a]);
  assert.equal(removed.data.stats.articles, 1);
  assert.equal(removed.data.stats.citations, 0);
  assert.equal(removed.diagnostics.unresolved.length, 1);
  assert.equal(buildKnowledgeGraph([a, b, page("notes/c.md")]).data.stats.articles, 3);
});

test("alias collisions never fabricate a target and duplicate public routes fail clearly", () => {
  const a = page("notes/a.md", "[ambiguous](/legacy.html)");
  const b = page("notes/b.md", "", { redirectFrom: "/legacy.html" });
  const c = page("notes/c.md", "", { redirectFrom: "/legacy.html" });
  const result = buildKnowledgeGraph([a, b, c]);
  assert.equal(result.data.stats.citations, 0);
  assert.deepEqual(result.diagnostics.ambiguousAliases, ["/legacy.html"]);
  assert.equal(result.diagnostics.unresolved[0].reason, "ambiguous");
  assert.throws(() => buildKnowledgeGraph([b, { ...c, path: b.path }]), /duplicate article route/);
});

test("generated redirect pages do not override the source article alias", () => {
  const source = page("notes/a.md");
  const target = page("notes/b.md", "", { redirectFrom: ["/legacy.html"] });
  const generated = { path: "/legacy.html", filePath: null, filePathRelative: null, frontmatter: {} };
  for (const pages of [[generated, target], [target, generated]]) {
    assert.equal(createPageResolver(pages).resolve("/legacy.html", source).page, target);
  }
});

test("module serialization round-trips arbitrary labels safely and excludes parser internals", async () => {
  const source = page("notes/a.md", "", { title: '</script><script>alert("x")</script>\u2028标题' });
  const data = buildKnowledgeGraph([source]).data;
  const output = serializeGraphModule(data);
  assert.doesNotMatch(output, /<\/script>|filePath|markdownEnv/);
  const module = await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
  assert.deepEqual(module.default, data);
});

test("VuePress lifecycle regenerates only its temp module for create, update and delete", async () => {
  const { default: knowledgeGraphPlugin } = await import("../src/.vuepress/knowledge-graph/plugin.ts");
  const plugin = knowledgeGraphPlugin({ hostname: "https://goatyang.com" });
  const writes = new Map();
  const a = page("notes/a.md");
  const app = {
    pages: [a], options: { base: "/" },
    async writeTemp(file, contents) { writes.set(file, contents); },
  };
  await plugin.onPrepared(app);
  assert.equal(JSON.parse(writes.get("knowledge-graph/diagnostics.json")).stats.articles, 1);
  const b = page("notes/b.md", "[A](./a.md)");
  app.pages.push(b);
  await plugin.onPageUpdated(app, "create", b, null);
  assert.equal(JSON.parse(writes.get("knowledge-graph/diagnostics.json")).stats.citations, 1);
  const changed = { ...b, title: "新的标题" };
  app.pages[1] = changed;
  await plugin.onPageUpdated(app, "update", changed, b);
  assert.match(writes.get("knowledge-graph/data.js"), /新的标题/);
  app.pages.splice(0, 1);
  await plugin.onPageUpdated(app, "delete", null, a);
  const final = JSON.parse(writes.get("knowledge-graph/diagnostics.json"));
  assert.equal(final.stats.articles, 1);
  assert.equal(final.stats.citations, 0);
  assert.equal(final.unresolved.length, 1);
  assert.deepEqual([...writes.keys()].sort(), ["knowledge-graph/data.js", "knowledge-graph/diagnostics.json"]);
  assert.equal(a.data, undefined);
});
