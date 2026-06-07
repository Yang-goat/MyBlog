---
name: write-blog-article
description: Write, revise, review, or reorganize Markdown articles for this VuePress Theme Hope personal blog. Use when creating or editing article content under src/, including tutorials, theory notes, quick references, experience posts, Frontmatter, citations, code examples, images, and Theme Hope Markdown components. Do not use for site-configuration-only changes or unrelated source code.
---

# Write Blog Article

Create concise, sourced Chinese articles that match the surrounding section and render correctly with the repository's VuePress Theme Hope configuration.

## Gather Context

1. Read the target directory's `README.md`, nearby articles, and relevant entries in `src/.vuepress/sidebar.ts` and `navbar.ts`.
2. Read `src/.vuepress/theme.ts` before using Markdown enhancements or built-in components.
3. Preserve unrelated user edits. When revising an existing article, change only the requested content unless a factual correction requires coordinated updates.
4. Identify the article type before drafting: tutorial, theory note, quick reference, or experience post.

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
- Keep paragraphs focused on one idea. Prefer short sections, ordered steps, comparison tables, and focused examples.
- Explain the conditions under which a conclusion applies. Label personal judgment as personal experience.
- Use bold text only for key terms, risks, and final conclusions.
- Do not add a mechanical summary to a short article.

## Choose an Article Structure

### Tutorial

Use this order when applicable:

1. Purpose and suitable scenarios.
2. Environment, version, and prerequisites.
3. Ordered operations.
4. Verification.
5. Common failures and risk warnings.
6. References.

For each important step, explain what to run, why it is needed, and how success is recognized. Installation tutorials must include a version or functional verification.

### Theory Note

Use this order when applicable:

1. Motivation or problem background.
2. Definitions, notation, and prerequisites.
3. Core principle or derivation.
4. Intuition, example, or diagram.
5. Applications, limitations, and common misconceptions.
6. Summary and references.

Define symbols on first use and keep them consistent. Do not skip a decisive derivation step without stating what was omitted and citing a source.

### Quick Reference

- State the scope and default environment.
- Group related commands by task.
- Prefer a table for repeated fields such as command, purpose, and caution.
- Separate destructive commands from ordinary examples with a warning.

### Experience Post

Allow a personal voice while separating facts from opinions. Apply the same verification and citation rules to technical claims.

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

一句话说明本目录收录什么内容。

<Catalog />
```

Do not manually duplicate the list produced by `<Catalog />`.

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

- Store images in the local `img/` or `assets/` convention and use relative paths.
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
- Prefer 2 to 8 strong sources for a substantial article; a short article may use fewer.
- Paraphrase in original wording. Keep unavoidable quotations short and clearly attributed.

## Verify the Article

1. Check Frontmatter, heading hierarchy, code languages, image paths, internal links, and references.
2. Run `pnpm.cmd docs:build`.
3. Confirm generated HTML for each changed route exists and contains the expected title.
4. Inspect formulas, diagrams, tabs, images, and components; use browser testing when visual or responsive behavior matters.
5. Run `git diff --check` and `git status --short`.
6. Report the build result, generated page count, project warnings, and any tool-level blocker separately.
