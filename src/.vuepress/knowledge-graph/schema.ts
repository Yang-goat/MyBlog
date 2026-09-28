/** Shared contract between the build-time graph and its page-only explorer. */
export interface GraphGroup {
  id: string;
  label: string;
  color: string;
}

interface GraphNodeBase {
  id: string;
  label: string;
  degree: number;
  x: number;
  y: number;
}

export interface ArticleNode extends GraphNodeBase {
  type: "article";
  path: string;
  group: string;
  tags: string[];
  excerpt: string;
}

export interface TopicNode extends GraphNodeBase {
  type: "topic";
  count: number;
}

export type GraphNode = ArticleNode | TopicNode;

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: "citation" | "tag";
}

export interface KnowledgeGraphData {
  version: 1;
  fingerprint: string;
  groups: GraphGroup[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    articles: number;
    topics: number;
    citations: number;
    memberships: number;
  };
}
