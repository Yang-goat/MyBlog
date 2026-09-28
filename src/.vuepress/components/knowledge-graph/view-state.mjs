/** Pure graph selection logic shared by the explorer and focused Node tests. */
export const normalizeSearch = (value) => String(value).normalize("NFKC").trim().toLocaleLowerCase();

export function searchNodes(nodes, query, limit = 30) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  return nodes.filter((node) => normalizeSearch(node.label).includes(normalized))
    .sort((a, b) => Number(normalizeSearch(b.label).startsWith(normalized)) - Number(normalizeSearch(a.label).startsWith(normalized)) || b.degree - a.degree || a.label.localeCompare(b.label, "zh-CN"))
    .slice(0, limit);
}

export function visibleGraph(data, options) {
  const groups = new Set(options.groups);
  const articles = new Set(data.nodes.filter((node) => node.type === "article" && groups.has(node.group)).map((node) => node.id));
  const counts = new Map();
  if (options.tags) for (const edge of data.edges) {
    if (edge.type === "tag" && articles.has(edge.source)) counts.set(edge.target, (counts.get(edge.target) || 0) + 1);
  }
  const ids = new Set(articles);
  for (const [id, count] of counts) if (!options.sharedOnly || count >= 2) ids.add(id);
  let edges = data.edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target) && (edge.type === "tag" ? options.tags : options.citations));
  if (options.focus && ids.has(options.focus)) {
    const neighbors = new Set([options.focus]);
    for (const edge of edges) {
      if (edge.source === options.focus) neighbors.add(edge.target);
      if (edge.target === options.focus) neighbors.add(edge.source);
    }
    for (const id of ids) if (!neighbors.has(id)) ids.delete(id);
    edges = edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target));
  }
  return { nodes: data.nodes.filter((node) => ids.has(node.id)), edges, topicCounts: counts };
}

export function restoreSession(raw, data) {
  try {
    const saved = JSON.parse(raw);
    if (!saved || saved.fingerprint !== data.fingerprint) return null;
    const nodeIds = new Set(data.nodes.map((node) => node.id));
    const groupIds = new Set(data.groups.map((group) => group.id));
    const viewport = saved.viewport;
    return {
      groups: Array.isArray(saved.groups) ? [...new Set(saved.groups.filter((id) => groupIds.has(id)))] : [...groupIds],
      citations: typeof saved.citations === "boolean" ? saved.citations : true,
      tags: typeof saved.tags === "boolean" ? saved.tags : true,
      sharedOnly: typeof saved.sharedOnly === "boolean" ? saved.sharedOnly : true,
      selected: nodeIds.has(saved.selected) ? saved.selected : null,
      focus: nodeIds.has(saved.focus) ? saved.focus : null,
      view: saved.view === "list" ? "list" : "graph",
      viewport: viewport && [viewport.x, viewport.y, viewport.k, viewport.width, viewport.height].every(Number.isFinite) && viewport.k >= 0.08 && viewport.k <= 8 && viewport.width > 0 && viewport.height > 0 ? viewport : null,
    };
  } catch { return null; }
}
