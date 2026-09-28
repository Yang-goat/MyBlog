import assert from "node:assert/strict";
import test from "node:test";
import { restoreSession, searchNodes, visibleGraph } from "./view-state.mjs";

const data = {
  fingerprint: "current",
  groups: [{ id: "a" }, { id: "b" }],
  nodes: [
    { id: "1", label: "JADE 算法", degree: 3, type: "article", group: "a" },
    { id: "2", label: "SHADE", degree: 2, type: "article", group: "a" },
    { id: "3", label: "独立文章", degree: 0, type: "article", group: "b" },
    { id: "t", label: "优化", degree: 2, type: "topic" },
    { id: "s", label: "单篇主题", degree: 1, type: "topic" },
  ],
  edges: [
    { source: "1", target: "2", type: "citation" },
    { source: "1", target: "t", type: "tag" },
    { source: "2", target: "t", type: "tag" },
    { source: "1", target: "s", type: "tag" },
  ],
};
const defaults = { groups: ["a", "b"], citations: true, tags: true, sharedOnly: true, focus: null };

test("shared themes avoid single-article clutter without losing isolated articles", () => {
  assert.deepEqual(visibleGraph(data, defaults).nodes.map((node) => node.id), ["1", "2", "3", "t"]);
  assert.equal(visibleGraph(data, defaults).edges.length, 3);
  assert.equal(visibleGraph(data, { ...defaults, sharedOnly: false }).nodes.length, 5);
});
test("group, edge and focus controls act on visible real connections", () => {
  assert.deepEqual(visibleGraph(data, { ...defaults, groups: ["b"] }).nodes.map((node) => node.id), ["3"]);
  assert.equal(visibleGraph(data, { ...defaults, groups: [] }).nodes.length, 0);
  assert.deepEqual(visibleGraph(data, { ...defaults, focus: "1", tags: false }).nodes.map((node) => node.id), ["1", "2"]);
  assert.deepEqual(visibleGraph(data, { ...defaults, focus: "3" }).nodes.map((node) => node.id), ["3"]);
  assert.equal(visibleGraph(data, { ...defaults, tags: false, citations: false }).edges.length, 0);
});
test("search normalizes case/fullwidth input and matches Chinese topics", () => {
  assert.equal(searchNodes(data.nodes, "ｊａｄｅ")[0].id, "1");
  assert.equal(searchNodes(data.nodes, "优化")[0].id, "t");
  assert.deepEqual(searchNodes(data.nodes, "no match"), []);
});
test("session restoration drops stale graphs and invalid state", () => {
  assert.equal(restoreSession("bad json", data), null);
  assert.equal(restoreSession('{"fingerprint":"old"}', data), null);
  const result = restoreSession(JSON.stringify({ fingerprint: "current", groups: ["a", "a", "unknown"], selected: "missing", focus: "t", view: "anything", viewport: { x: 0, y: 0, k: 999, width: 400, height: 500 } }), data);
  assert.deepEqual(result.groups, ["a"]);
  assert.equal(result.selected, null);
  assert.equal(result.focus, "t");
  assert.equal(result.viewport, null);
  assert.equal(result.view, "graph");
});
