/** The build-time plugin writes this VuePress virtual module before bundling. */
declare module "@temp/knowledge-graph/data.js" {
  const data: import("../../knowledge-graph/schema").KnowledgeGraphData;
  export default data;
}
