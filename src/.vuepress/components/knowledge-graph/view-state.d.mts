import type { GraphNode, KnowledgeGraphData, GraphEdge } from "../../knowledge-graph/schema.js";

export interface ViewOptions {
  groups: string[];
  citations: boolean;
  tags: boolean;
  sharedOnly: boolean;
  focus: string | null;
}
export interface SessionViewport {
  x: number;
  y: number;
  k: number;
  width: number;
  height: number;
}
export interface SavedSession extends ViewOptions {
  selected: string | null;
  view: "graph" | "list";
  viewport: SessionViewport | null;
}
export function normalizeSearch(value: unknown): string;
export function searchNodes(nodes: GraphNode[], query: string, limit?: number): GraphNode[];
export function visibleGraph(data: KnowledgeGraphData, options: ViewOptions): { nodes: GraphNode[]; edges: GraphEdge[]; topicCounts: Map<string, number> };
export function restoreSession(raw: string | null, data: KnowledgeGraphData): SavedSession | null;
