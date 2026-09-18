import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = "src";
const dist = "src/.vuepress/dist";
const report = { markdown: 0, assets: 0, mappedFiles: 0, redirects: 0, redirectAliases: 0, sections: 0, sidebarArticles: 0, renderedNavigationPages: 0, localReferences: 0 };
const errors = [];
function check(condition, message) { if (!condition) errors.push(message); }
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.name === ".vuepress" ? [] : entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
function route(file) { return "/" + file.replace(/README\.md$/, "").replace(/\.md$/, ".html"); }
function outputFile(url) {
  let name = decodeURIComponent(url.split(/[?#]/)[0]).slice(1);
  if (!name || name.endsWith("/")) name += "index.html";
  return path.join(dist, name);
}
const files = walk(source).map(file => path.relative(source, file).split(path.sep).join("/"));
for (const file of files) {
  for (const component of file.split("/")) check(component === "README.md" || /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+)?$/.test(component), `Naming: ${file}`);
  if (file.endsWith(".md")) {
    report.markdown++;
    check(fs.existsSync(outputFile(route(file))), `Missing page: ${file}`);
    const markdown = fs.readFileSync(path.join(source, file), "utf8");
    const redirects = markdown.match(/^redirectFrom:([^\r\n]*)(?:\r?\n[ \t]+[^\r\n]*)*/m);
    if (redirects) {
      const direct = redirects[1].trim();
      const aliases = direct ? [direct] : [...redirects[0].matchAll(/^\s+-\s+(.+)$/gm)].map(match => match[1].trim());
      for (const value of aliases) {
        const old = value.replace(/^["']|["']$/g, "");
        const output = outputFile(old);
        check(fs.existsSync(output), `Missing alias redirect: ${old}`);
        if (fs.existsSync(output)) check(fs.readFileSync(output, "utf8").includes(route(file)), `Alias does not point directly to current route: ${old}`);
        report.redirectAliases++;
      }
    }
  }
  else report.assets++;
}
const mapping = JSON.parse(fs.readFileSync("docs/content-path-map.json", "utf8")).files;
for (const [old, next] of Object.entries(mapping)) {
  check(fs.existsSync(path.join(source, next)), `Missing migrated file: ${next}`);
  report.mappedFiles++;
  if (!old.endsWith(".md") || old === next) continue;
  const target = route(next);
  const redirect = outputFile(route(old));
  check(fs.existsSync(redirect), `Missing redirect: ${route(old)}`);
  if (fs.existsSync(redirect)) check(fs.readFileSync(redirect, "utf8").includes(target), `Wrong redirect: ${route(old)} -> ${target}`);
  report.redirects++;
}

const data = fs.readFileSync("src/.vuepress/.temp/internal/themeData.js", "utf8");
const theme = JSON.parse(JSON.parse(data.match(/JSON\.parse\((".*")\)/)[1])).locales["/"];
const navigation = [];
const groups = {
  "AI 与算法": "/ai-algorithms/", "基础与方法": "/ai-algorithms/foundations/",
  "机器学习与研究": "/ai-algorithms/learning/", "智能优化": "/ai-algorithms/optimization/",
  "AI 应用": "/ai-applications/", "知识与检索": "/ai-applications/knowledge-retrieval/",
  "智能体系统": "/ai-applications/agent-systems/", "工具与实践": "/ai-applications/tools-practice/",
  "随笔": "/notes/", "软件工具": "/software-tools/",
  "版本控制": "/software-tools/version-control/", "系统与容器": "/software-tools/systems-containers/",
  "开发与远程工具": "/software-tools/development-remote/", "文档与知识管理": "/software-tools/documentation-knowledge/",
};
function inspectNav(items, parent = "/") {
  for (const item of items) {
    if (item.children) {
      const prefix = groups[item.text];
      check(Boolean(prefix), `Unmapped navigation group: ${item.text}`);
      if (prefix) {
        check(path.posix.dirname(prefix.slice(0, -1)) + "/" === parent || parent === "/", `Navigation folder nesting: ${item.text}`);
        check(fs.existsSync(path.join(source, prefix.slice(1), "README.md")), `Group landing: ${prefix}`);
        inspectNav(item.children, prefix);
      }
    } else {
      navigation.push(item.link);
      check(fs.existsSync(outputFile(item.link)), `Navigation target: ${item.link}`);
      if (parent !== "/") check(path.posix.dirname(item.link.slice(0, -1)) + "/" === parent, `Navigation leaf not directly in group: ${item.link}`);
    }
  }
}
inspectNav(theme.navbar);
const sections = navigation.filter(link => link !== "/");
for (const a of sections) for (const b of sections) if (a !== b) check(!b.startsWith(a), `Nested independent boards: ${a} / ${b}`);
const articleLinks = new Set();
function resolveLink(link, prefix) { return link.startsWith("/") ? link : prefix + link; }
function inspectSidebar(items, prefix, board) {
  for (const item of items) {
    if (typeof item === "string") {
      const link = resolveLink(item, prefix);
      check(link.startsWith(board), `Cross-board sidebar link: ${link}`);
      check(path.posix.dirname(link) + "/" === prefix, `Article not directly in sidebar folder: ${link} vs ${prefix}`);
      check(fs.existsSync(outputFile(link)), `Sidebar article missing: ${link}`);
      articleLinks.add(link);
    } else if (item.children) {
      const next = item.prefix ? resolveLink(item.prefix, prefix) : prefix;
      check(next !== prefix && path.posix.dirname(next.slice(0, -1)) + "/" === prefix, `Sidebar group needs a direct child folder: ${item.text}`);
      check(item.link === next, `Group landing and prefix differ: ${item.text}`);
      check(item.children.length > 0, `Empty collapsible group: ${item.text}`);
      check(fs.existsSync(path.join(source, next.slice(1), "README.md")), `Missing group README: ${next}`);
      inspectSidebar(item.children, next, board);
    } else if (item.link) {
      check(item.link.startsWith(board), `Cross-board plain link: ${item.link}`);
      check(fs.existsSync(outputFile(item.link)), `Missing plain link: ${item.link}`);
      if (!item.link.endsWith("/")) articleLinks.add(item.link);
    }
  }
}
for (const [board, items] of Object.entries(theme.sidebar)) {
  if (board !== "/") { report.sections++; check(sections.includes(board), `Sidebar without navigation board: ${board}`); }
  inspectSidebar(items, board, board);
}
report.sidebarArticles = articleLinks.size;
for (const file of files.filter(file => file.endsWith(".md") && !file.endsWith("README.md"))) {
  const url = route(file);
  if (sections.some(board => url.startsWith(board))) check(articleLinks.has(url), `Article omitted from sidebar: ${file}`);
}

function inspectHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { inspectHtml(file); continue; }
    if (!entry.name.endsWith(".html")) continue;
    const html = fs.readFileSync(file, "utf8");
    const nav = html.match(/<nav class="vp-nav-links">([\s\S]*?)<\/nav>/)?.[1];
    if (!nav) continue;
    const url = "/" + path.relative(dist, file).split(path.sep).join("/").replace(/index\.html$/, "");
    const active = [...nav.matchAll(/<a\b([^>]+)>/g)].filter(match => /class="[^"]*\broute-link-active\b/.test(match[1])).map(match => match[1].match(/href="([^"]+)"/)?.[1]).filter(link => navigation.includes(link));
    const expected = navigation.filter(link => link === "/" ? url === "/" : url.startsWith(link)).sort((a, b) => b.length - a.length)[0];
    check(JSON.stringify(active) === JSON.stringify(expected ? [expected] : []), `Navigation highlight: ${url}: ${active}`);
    for (const match of html.matchAll(/<(?:a|img)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
      let target = match[1].replace(/^https:\/\/goatyang\.com(?=\/)/, "");
      if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) continue;
      target = target.split(/[?#]/)[0];
      if (!target) continue;
      target = decodeURIComponent(target);
      const local = target.startsWith("/") ? target : path.posix.join(path.posix.dirname(url), target);
      // This separately built application is emitted by site:build, not docs:build.
      if (local === "/hex-mahjong/" || local.startsWith("/hex-mahjong/assets/")) continue;
      const disk = outputFile(local);
      check(fs.existsSync(disk) || fs.existsSync(disk + ".html"), `Broken local reference: ${url} -> ${local}`);
      report.localReferences++;
    }
    report.renderedNavigationPages++;
  }
}
inspectHtml(dist);
console.log(JSON.stringify({ ...report, errors }, null, 2));
assert.equal(errors.length, 0, "Content structure validation failed");
