import type { App, Plugin } from "vuepress/core";
import { logger } from "vuepress/utils";
import { buildKnowledgeGraph, serializeGraphModule } from "./data.mjs";
import { installGraphMarkdownCollector } from "./markdown.mjs";

export interface KnowledgeGraphOptions {
  hostname?: string;
  encryptedPaths?: string[];
  globallyEncrypted?: boolean;
}

export default function knowledgeGraphPlugin(options: KnowledgeGraphOptions = {}): Plugin {
  let writes = Promise.resolve();
  const prepare = (app: App): Promise<void> => {
    // Watch events can arrive close together. Serialize generation and writes so
    // a slower old event cannot replace a newer graph with stale data.
    writes = writes.catch(() => undefined).then(async () => {
      const { data, diagnostics } = buildKnowledgeGraph(app.pages, { ...options, base: app.options.base });
      await app.writeTemp("knowledge-graph/data.js", serializeGraphModule(data));
      await app.writeTemp("knowledge-graph/diagnostics.json", JSON.stringify({ fingerprint: data.fingerprint, stats: data.stats, ...diagnostics }, null, 2));
      logger.info(`[knowledge-graph] ${data.stats.articles} articles, ${data.stats.topics} topics, ${data.stats.citations} citations, ${data.stats.memberships} memberships`);
      if (diagnostics.unresolved.length) logger.warn(`[knowledge-graph] ${diagnostics.unresolved.length} unresolved/ambiguous article links; see .temp/knowledge-graph/diagnostics.json`);
    });
    return writes;
  };
  return {
    name: "vuepress-plugin-site-knowledge-graph",
    extendsMarkdown: installGraphMarkdownCollector,
    onPrepared: prepare,
    onPageUpdated(app, ..._event) {
      return prepare(app);
    },
  };
}
