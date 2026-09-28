import { createHash } from "node:crypto";
import { posix } from "node:path";
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force";
import { EXCLUDED_TOPIC_TAGS, GRAPH_GROUPS, GRAPH_PAGE, MARKDOWN_GRAPH_KEY } from "./config.mjs";

const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const strings = (value) => typeof value === "string" ? [value] : Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];
const decode = (value) => { try { return decodeURIComponent(value); } catch { return value; } };
const slash = (value) => value.replace(/\\/g, "/");
const normalizePath = (value) => posix.normalize(`/${decode(slash(value)).replace(/^\/+/, "")}`);
const normalizeBase = (base) => `${normalizePath(base).replace(/\/$/, "")}/`;
const withoutBase = (value, base) => {
  const normalized = normalizePath(value);
  return base !== "/" && normalized.startsWith(base) ? `/${normalized.slice(base.length)}` : normalized;
};
const routeForFile = (file) => normalizePath(file).replace(/(?:README|index)\.md$/i, "").replace(/\.md$/i, ".html");

export function normalizeTags(value) {
  return [...new Set(strings(value).map((tag) => tag.normalize("NFC").trim().replace(/\s+/gu, " ")).filter(Boolean))].sort(compare);
}

/** The check happens before titles, tags, excerpts or edges enter public data. */
export function isEligibleArticle(page, options = {}) {
  const file = slash(page.filePathRelative ?? "").replace(/^\/+/, "");
  const frontmatter = page.frontmatter ?? {};
  if (!page.filePath || !file.endsWith(".md") || !GRAPH_GROUPS.some(({ id }) => file.startsWith(`${id}/`))) return false;
  if (/(?:^|\/)(?:README|index)\.md$/i.test(file) || file === GRAPH_PAGE || /(?:^|\/)(?:assets|tests?|__tests__|drafts?)(?:\/|$)/i.test(file)) return false;
  if (frontmatter.home || frontmatter.article === false || frontmatter.draft || frontmatter.private || frontmatter.published === false) return false;
  if (frontmatter.password || frontmatter.encrypt || frontmatter.encrypted || frontmatter.auth || frontmatter.access || frontmatter.requiresAuth) return false;
  if (page.data?.encrypted || page.routeMeta?.encrypted || options.globallyEncrypted) return false;
  const path = normalizePath(page.path);
  const inferred = routeForFile(file);
  return !(options.encryptedPaths ?? []).some((prefix) => {
    const normalized = normalizePath(prefix);
    return path.startsWith(normalized) || inferred.startsWith(normalized);
  });
}

/** Map real paths as well as source-file and explicit redirect aliases. */
export function createPageResolver(pages, { base = "/", hostname = "https://goatyang.com" } = {}) {
  const normalizedBase = normalizeBase(base);
  const host = new URL(hostname).host;
  const routes = new Map();
  const sources = new Map();
  const ambiguous = new Set();
  const add = (map, key, page) => {
    if (!key) return;
    const normalized = withoutBase(key, normalizedBase);
    const previous = map.get(normalized);
    // A source article wins over a generated redirect page at the same alias.
    if (previous && previous !== page && previous.filePath && page.filePath) {
      ambiguous.add(normalized);
      return;
    }
    if (!previous || page.filePath) map.set(normalized, page);
  };
  for (const page of pages) {
    add(routes, page.path, page);
    if (page.filePathRelative) {
      add(sources, page.filePathRelative, page);
      add(routes, routeForFile(page.filePathRelative), page);
    }
    if (page.pathInferred) add(routes, page.pathInferred, page);
    for (const alias of strings(page.frontmatter?.redirectFrom)) {
      add(routes, alias, page);
      if (/\.md$/i.test(alias)) add(routes, routeForFile(alias), page);
    }
  }
  const resolve = (href, sourcePage) => {
    if (typeof href !== "string" || !href.trim() || /^[#?]/.test(href)) return { kind: "self" };
    let value = href.trim();
    if (/^(?:https?:)?\/\//i.test(value)) {
      let url;
      try { url = new URL(value, hostname); } catch { return { kind: "ignored" }; }
      if (url.host !== host) return { kind: "external" };
      value = url.pathname;
    } else if (/^[a-z][a-z\d+.-]*:/i.test(value)) return { kind: "external" };
    value = value.split(/[?#]/, 1)[0];
    if (!value) return { kind: "self" };
    const extension = posix.extname(decode(value));
    if (extension && !/^(?:\.md|\.html?)$/i.test(extension)) return { kind: "asset" };
    const absolute = value.startsWith("/");
    const sourceFile = slash(sourcePage.filePathRelative ?? sourcePage.path);
    const fileCandidate = withoutBase(absolute ? value : posix.join(posix.dirname(`/${sourceFile}`), value), normalizedBase);
    const routeDirectory = sourcePage.path.endsWith("/") ? sourcePage.path : posix.dirname(sourcePage.path);
    const routeCandidate = withoutBase(absolute ? value : posix.join(routeDirectory, value), normalizedBase);
    const candidates = [fileCandidate, routeForFile(fileCandidate), routeCandidate];
    if (candidates.some((candidate) => ambiguous.has(candidate))) return { kind: "ambiguous", path: fileCandidate };
    const page = sources.get(fileCandidate) ?? candidates.map((candidate) => routes.get(candidate)).find(Boolean);
    return page ? { kind: "page", page } : { kind: "unresolved", path: fileCandidate };
  };
  return { resolve, ambiguous: [...ambiguous].sort(compare) };
}

/** Fixed seed, stable ordering and fixed ticks keep layouts reproducible. */
export function applyInitialLayout(nodes, edges) {
  if (!nodes.length) return;
  let seed = 0x6b677261;
  const random = () => ((seed = Math.imul(1664525, seed) + 1013904223 >>> 0) / 4294967296);
  const simulationNodes = nodes.map(({ id, type, degree }, index) => ({ id, type, degree, index }));
  const links = edges.map(({ source, target, type }) => ({ source, target, type }));
  const simulation = forceSimulation(simulationNodes).stop().randomSource(random)
    .force("link", forceLink(links).id((node) => node.id).distance((edge) => edge.type === "tag" ? 66 : 92).strength((edge) => edge.type === "tag" ? 0.24 : 0.15))
    .force("charge", forceManyBody().strength(-95).distanceMax(700))
    .force("collision", forceCollide().radius((node) => node.type === "topic" ? 28 : 20).iterations(2))
    .force("x", forceX(0).strength(0.018))
    .force("y", forceY(0).strength(0.027))
    .force("center", forceCenter(0, 0));
  simulation.tick(260);
  for (let index = 0; index < nodes.length; index += 1) {
    nodes[index].x = Math.round(simulationNodes[index].x * 100) / 100 || 0;
    nodes[index].y = Math.round(simulationNodes[index].y * 100) / 100 || 0;
  }
}

export function buildKnowledgeGraph(pages, options = {}) {
  const base = normalizeBase(options.base ?? "/");
  const { resolve, ambiguous } = createPageResolver(pages, options);
  const eligible = pages.filter((page) => isEligibleArticle(page, options)).sort((a, b) => compare(a.path, b.path));
  const nodeByPage = new Map();
  const nodes = [];
  const edges = [];
  const diagnostics = { unresolved: [], ambiguousAliases: ambiguous, excludedPages: pages.length - eligible.length };
  const routeIds = new Set();
  for (const page of eligible) {
    const route = withoutBase(page.path, base);
    const id = `article:${route}`;
    if (routeIds.has(id)) throw new Error(`Knowledge graph: duplicate article route ${route}`);
    routeIds.add(id);
    const node = {
      id, type: "article", label: String(page.title || page.frontmatter?.title || posix.basename(route)),
      // VuePress routes omit the deployment base. The client adds it once.
      path: page.path,
      group: slash(page.filePathRelative).split("/")[0],
      tags: normalizeTags(page.frontmatter?.tag ?? page.frontmatter?.tags),
      excerpt: page.markdownEnv?.[MARKDOWN_GRAPH_KEY]?.description || page.markdownEnv?.[MARKDOWN_GRAPH_KEY]?.excerpt || "",
      degree: 0, x: 0, y: 0,
    };
    nodeByPage.set(page, node);
    nodes.push(node);
  }
  const topicByLabel = new Map();
  const citationIds = new Set();
  for (const page of eligible) {
    const node = nodeByPage.get(page);
    for (const tag of node.tags) {
      if (EXCLUDED_TOPIC_TAGS.has(tag)) continue;
      if (!topicByLabel.has(tag)) topicByLabel.set(tag, { id: `topic:${tag}`, type: "topic", label: tag, count: 0, degree: 0, x: 0, y: 0 });
      const topic = topicByLabel.get(tag);
      topic.count += 1;
      edges.push({ id: `tag:${node.id}→${topic.id}`, source: node.id, target: topic.id, type: "tag" });
    }
    for (const href of page.markdownEnv?.[MARKDOWN_GRAPH_KEY]?.links ?? []) {
      const result = resolve(href, page);
      if (result.kind === "unresolved" || result.kind === "ambiguous") {
        diagnostics.unresolved.push({ source: node.path, href, reason: result.kind });
      }
      if (result.kind !== "page") continue;
      const target = nodeByPage.get(result.page);
      if (!target || target.id === node.id) continue;
      const id = `citation:${node.id}→${target.id}`;
      if (citationIds.has(id)) continue;
      citationIds.add(id);
      edges.push({ id, source: node.id, target: target.id, type: "citation" });
    }
  }
  nodes.push(...topicByLabel.values());
  nodes.sort((a, b) => compare(a.id, b.id));
  edges.sort((a, b) => compare(a.id, b.id));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  for (const edge of edges) {
    byId.get(edge.source).degree += 1;
    byId.get(edge.target).degree += 1;
  }
  applyInitialLayout(nodes, edges);
  const data = {
    version: 1,
    fingerprint: "",
    groups: GRAPH_GROUPS.map((group) => ({ ...group })), nodes, edges,
    stats: { articles: eligible.length, topics: topicByLabel.size, citations: citationIds.size, memberships: edges.length - citationIds.size },
  };
  data.fingerprint = createHash("sha256").update(JSON.stringify(data)).digest("hex").slice(0, 16);
  return { data, diagnostics };
}

export function serializeGraphModule(data) {
  // Escaping keeps the generated module safe even if imported into inline HTML.
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  return `// Generated by vuepress-plugin-site-knowledge-graph.\nexport default ${serialized};\n`;
}
