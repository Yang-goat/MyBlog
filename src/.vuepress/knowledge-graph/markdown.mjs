import { MARKDOWN_GRAPH_KEY } from "./config.mjs";

const plainText = (tokens = []) => tokens.map((token) => {
  if (token.type === "text" || token.type === "text_special") return token.content;
  // Plain identifiers remain readable without exposing TeX or inventing prose.
  if (token.type === "math_inline" && /^[A-Za-z][A-Za-z0-9]*$/.test(token.content.trim())) return token.content.trim();
  if (token.type === "softbreak" || token.type === "hardbreak") return " ";
  return "";
}).join("")
  // Also cover plain Markdown parsers or math syntax not enabled by the site.
  .replace(/\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, "")
  .replace(/\$((?:\\.|[^$\\])*)\$/g, (_match, expression) => /^[A-Za-z][A-Za-z0-9]*$/.test(expression.trim()) ? expression.trim() : "")
  .replace(/\s+/gu, " ").trim();

/** Collect original tokens before VuePress's renderer rewrites href to RouteLink. */
export function collectMarkdownGraph(tokens) {
  const links = new Set();
  let excerpt = "";
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.type !== "inline") continue;
    const children = token.children ?? [];
    for (let childIndex = 0; childIndex < children.length; childIndex += 1) {
      const child = children[childIndex];
      if (child.type !== "link_open") continue;
      const href = child.attrGet("href");
      // A linked image is an illustration, not an article citation.
      const closingIndex = children.findIndex((next, nextIndex) =>
        nextIndex > childIndex && next.type === "link_close");
      const label = children.slice(childIndex + 1, closingIndex);
      if (href && (plainText(label) || label.some((part) => part.type === "code_inline"))) {
        links.add(href);
      }
    }
    if (!excerpt && tokens[index - 1]?.type === "paragraph_open") {
      const text = plainText(children);
      // Short link-only/navigation paragraphs do not make helpful previews.
      if (text.length >= 20 && !/^https?:\/\//i.test(text)) excerpt = text.slice(0, 180);
    }
  }
  return { links: [...links], excerpt };
}

export function installGraphMarkdownCollector(markdown) {
  markdown.core.ruler.after("inline", "site_knowledge_graph", (state) => {
    // VuePress creates a fresh env for each page render. Nested renderer calls
    // can reuse that env; preserve the outer document's already collected data.
    if (state.inlineMode || !state.env.filePathRelative || state.env[MARKDOWN_GRAPH_KEY]) return;
    state.env[MARKDOWN_GRAPH_KEY] = {
      ...collectMarkdownGraph(state.tokens),
      // At this point frontmatter comes from the author. Theme/SEO extendsPage
      // hooks may later replace it with generated descriptions containing titles.
      description: descriptionText(markdown, state.env.frontmatter?.description),
    };
  });
}

/** Use the same Markdown tokenizer for a frontmatter description, without HTML. */
export function descriptionText(markdown, description) {
  if (typeof description !== "string") return "";
  return plainText(markdown.parseInline(description, {})[0]?.children).slice(0, 180);
}
