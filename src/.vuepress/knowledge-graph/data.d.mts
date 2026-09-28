import type { Page } from "vuepress/core";
import type { KnowledgeGraphData } from "./schema.js";

export interface GraphBuildOptions {
  base?: string;
  hostname?: string;
  encryptedPaths?: string[];
  globallyEncrypted?: boolean;
}

export interface GraphDiagnostics {
  unresolved: { source: string; href: string; reason: "unresolved" | "ambiguous" }[];
  ambiguousAliases: string[];
  excludedPages: number;
}

export function buildKnowledgeGraph(pages: Page[], options?: GraphBuildOptions): {
  data: KnowledgeGraphData;
  diagnostics: GraphDiagnostics;
};

export function serializeGraphModule(data: KnowledgeGraphData): string;
