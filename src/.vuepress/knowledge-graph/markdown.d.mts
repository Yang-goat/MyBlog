import type { Markdown } from "vuepress/markdown";

export function installGraphMarkdownCollector(markdown: Markdown): void;
export function descriptionText(markdown: Markdown, description: unknown): string;
export function collectMarkdownGraph(tokens: ReturnType<Markdown["parse"]>): {
  links: string[];
  excerpt: string;
};
