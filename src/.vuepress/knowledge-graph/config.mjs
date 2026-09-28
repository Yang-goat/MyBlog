/** The graph describes public articles in these five sections only. */
export const GRAPH_GROUPS = [
  { id: "ai-algorithms", label: "AI 与算法", color: "#5b8ff9" },
  { id: "ai-applications", label: "AI 应用", color: "#26a69a" },
  { id: "software-tools", label: "软件工具", color: "#d59a35" },
  { id: "notes", label: "随笔", color: "#a780d5" },
  { id: "paper-notes", label: "论文随笔", color: "#e2798a" },
];

// These labels remain valid article tags, but do not express a useful topic.
export const EXCLUDED_TOPIC_TAGS = new Set([
  "教程", "随笔", "理论", "导论", "总结", "综述", "入门", "进阶",
  "模板", "分类", "领域梳理", "指令速查", "算法",
]);

export const GRAPH_PAGE = "ai-applications/knowledge-retrieval/knowledge-graphs/site-knowledge-graph.md";

export const MARKDOWN_GRAPH_KEY = "siteKnowledgeGraph";
