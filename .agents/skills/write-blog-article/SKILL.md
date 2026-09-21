---
name: write-blog-article
description: Write, revise, review, or reorganize Chinese articles for this VuePress Theme Hope blog, including paper sharing, close reading, weekly reading notes, tutorials, theory notes, quick references, and experience posts. Covers article structure, Frontmatter, sources, examples, and Markdown components. Do not use for site-configuration-only changes or unrelated source code.
---

# Write Blog Article

Create concise, sourced Chinese articles that match the surrounding section and render correctly with the repository's VuePress Theme Hope configuration.

## Gather Context

1. Read [content structure](../../../docs/content-structure.md), the target directory's `README.md`, nearby articles, and relevant entries in `src/.vuepress/sidebar.ts` and `navbar.ts`.
2. Read `src/.vuepress/theme.ts` before using Markdown enhancements or built-in components.
3. Preserve unrelated user edits. When revising an existing article, change only the requested content unless a factual correction requires coordinated updates.
4. Identify the reader, central question, and article type before drafting. Infer reasonable defaults from the request and neighboring content; ask only when missing sources or a key choice prevents accurate writing. Existing articles show local context, not an obligation to repeat their defects.

## Place Content in the Site

- Match the actual folder hierarchy to the navbar section, dropdown group, board, and sidebar subgroup. Use lowercase English kebab-case for folders, article files, and images; keep `README.md` for directory pages.
- Keep `sidebar.ts` explicit and hand-editable. List direct articles as links; create a collapsible group only for a real subdirectory with child articles. Do not replace this configuration with scanning or helper functions.
- Keep each article in one board. Reference other boards in article text, not by inserting their articles into the current sidebar or adding categories solely to create cross-links.
- Use `paper-notes/weekly/` for weekly reading records. Put developed explanations under the relevant topic; link the records and topic articles instead of duplicating content.
- Read [project maintenance](../../../docs/maintenance.md) for build, cleanup, and preview procedures. When moving content, preserve existing aliases, update local links and assets, and verify redirects. The migration map is persistent validation data, not a temporary file.

## Research Before Writing

- Prefer official documentation, standards, papers, project repositories, and official announcements.
- Use community posts or videos only as supplementary sources.
- Verify changing information such as versions, prices, dates, competition rules, platform UI, and system requirements.
- State the applicable version or verification date for time-sensitive facts.
- Never invent commands, output, parameters, citations, or sources.
- Mark an unchecked claim as needing verification instead of filling gaps from memory.

## Write Concisely

- Use simplified Chinese by default.
- Introduce a technical term as `中文名（English Name，缩写）` when useful.
- Use a direct, restrained, technical-note tone.
- Avoid filler, repeated conclusions, marketing language, title bait, and claims such as “非常简单”, “保姆级”, or “史上最全”.
- Start with the problem, audience, prerequisites, or outcome. A short reference article may enter the content directly.
- Keep paragraphs focused on one idea. Use prose for reasoning, lists for parallel items or steps, and tables for comparable fields.
- Explain the conditions under which a conclusion applies. Distinguish personal interpretation from reported evidence and actual experience; never invent the author's experiences.
- Use bold text only for key terms, risks, and final conclusions.
- Do not add a mechanical summary to a short article.

## Choose an Article Structure

先确定读者读完要理解的问题或完成的任务，再选择结构；不将模式当成固定标题或字数配额。

- **论文分享、精读、多篇阅读周记**：读取 [论文随笔写作](references/paper-notes.md)。默认把“分享这篇论文”写成单篇解读；只有用户要求周记时才按周组织。
- **教程、原理与算法、速查、排障、经验与工具介绍、系列文章**：读取 [其他文章的结构与阅读体验](references/article-patterns.md)，只应用相关模式。
- **目录页**：沿用下方目录页规范，不套正文模板。

## Shape the Reading Experience

- 开头用一两个短段落交代具体问题、读者能获得的理解或结果，以及必要的前置知识。不要从泛泛的行业背景铺起，也不要展示内部写作检查表。
- 正文围绕一条主线展开，小标题写清解释的机制或解决的问题，段落之间说明因果与承接关系。
- 先给直觉或最小例子，再引入必要的公式与实现细节。基础知识可链接站内文章，关键推理不能只用链接代替。
- 公式首次出现时解释符号、条件及其作用；行内使用 `$...$`，行间使用各自独占一行的 `$$`。示例数值与实测结果明确区分。
- 保留有内容的个人判断与疑问，不给每节强配提示框、表格或总结。长文结尾收束主张、边界或下一步。

## Apply Frontmatter

Use the surrounding directory's established categories and tags. A normal article should usually include:

```yaml
---
title: 文章标题
icon: 图标名
date: YYYY-MM-DD
order: 1
category:
  - 一级分类
tag:
  - 标签一
  - 标签二
---
```

- Use the actual creation date or date of a substantial rewrite.
- Add `order` only for structured sidebar ordering; inspect neighboring values first.
- Use stable, limited categories and specific tags. Do not create capitalization, spacing, or translation duplicates.
- Set `star` or `sticky` only when the article genuinely deserves recommendation or pinning.
- Do not add `sidebar: false`, `article: false`, or `index: false` to a normal article.
- Set `isOriginal: true` only for confirmed original work.
- Keep one body-level `#` heading matching `title` unless neighboring articles intentionally omit it.

For a directory landing page, follow the established catalog pattern:

```yaml
---
title: 目录名称
icon: 图标名
index: false
article: false
dir:
  link: true
  expanded: true
  order: 1
---

一句话解释栏目标题中的概念、研究对象或领域含义。

<Catalog />
```

Do not start with “这里整理……” or manually duplicate the list produced by `<Catalog />`. Preserve the directory's existing `dir` ordering and expansion choices; do not add an empty collapsible sidebar group merely because a directory exists.

## Write Commands and Code

- Add an accurate language identifier to every fenced block.
- Use PowerShell for Windows-only commands and Bash for Unix-like commands.
- Do not include shell prompts such as `$` or `>` in copyable commands.
- Use explicit placeholders such as `<用户名>` and explain what to replace.
- Keep examples minimal but runnable or fully understandable. Include required imports and context.
- Show only output needed to recognize success, using a `text` block.
- Explain how to verify a command. If it was not tested, state the unverified scope and reason.
- Place backup and recovery guidance before destructive, overwrite, reset, permission, registry, or force-push operations.
- Never include real secrets, tokens, passwords, cookies, private endpoints, or personal filesystem paths.

## Handle Images and Diagrams

- Store article images in the local `assets/` directory with lowercase kebab-case filenames and use relative paths. Keep shared site assets in `.vuepress/public/`.
- Write meaningful alt text.
- Crop irrelevant UI and redact accounts, paths, keys, and private data.
- Use screenshots for visual location or results, not as a substitute for copyable text.
- Prefer Mermaid for flows, Markmap for knowledge hierarchies, and KaTeX for formulas.
- Explain the conclusion a reader should take from each diagram.
- Attribute and verify licensing for external media.

## Use Theme Hope Semantically

Read [references/theme-hope.md](references/theme-hope.md) when adding or revising Theme Hope containers, tabs, code tabs, diagrams, components, image attributes, or other enhanced Markdown.

Use enhancements to improve information hierarchy, not decoration. Do not use a feature that is not enabled in `src/.vuepress/theme.ts`.

## Cite Sources

- Usually end factual tutorials and theory articles with `## 参考资料`.
- Include only sources actually read and used.
- Use descriptive link text, not “参考链接 1”.
- Link a source near the relevant claim when that improves traceability.
- Let the claims determine the sources; one fully read primary paper can support a single-paper note. Add background or comparison sources only when used, not to meet a quota.
- Paraphrase in original wording. Keep unavoidable quotations short and clearly attributed.

## Verify the Article

1. Check Frontmatter, heading hierarchy, code languages, image paths, internal links, and references.
2. Run `pnpm.cmd docs:build`.
3. Run `node scripts/validate-content-structure.mjs` after the build. Confirm generated HTML for each changed route exists and contains the expected title; the structure checker does not verify link fragments or visual rendering.
4. Inspect formulas, diagrams, tabs, images, and components; use browser testing when visual or responsive behavior matters.
5. Run `git diff --check` and `git status --short`.
6. Report the build result, generated page count, project warnings, and any tool-level blocker separately.
