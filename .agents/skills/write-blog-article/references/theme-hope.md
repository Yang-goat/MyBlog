# Theme Hope Article Styles

Read this reference only when an article needs enhanced Markdown or built-in components. The source of truth remains `src/.vuepress/theme.ts`.

## Enabled Features

The repository currently enables:

- Hint containers.
- Tabs and code tabs.
- GFM, task lists, mark, subscript, superscript, spoiler, and attributes.
- KaTeX math.
- Mermaid, PlantUML, and Markmap.
- Image lazy loading, dimensions, and figures.
- Include, preview, demo, and component syntax.
- `Badge` and `VPCard` built-in components.

Do not directly use Chart.js, ECharts, Flowchart, Reveal.js, Vue Playground, or Sandpack unless dependencies and theme configuration are added and verified.

Official references:

- [Markdown enhancements](https://theme-hope.vuejs.press/zh/guide/markdown/)
- [Tabs](https://theme-hope.vuejs.press/zh/guide/markdown/content/tabs.html)
- [Code tabs](https://theme-hope.vuejs.press/zh/guide/markdown/code/code-tabs.html)
- [Built-in components](https://theme-hope.vuejs.press/zh/guide/component/built-in.html)
- [Frontmatter information](https://theme-hope.vuejs.press/zh/config/frontmatter/info.html)

## Hint Containers

Choose by meaning:

- `tip`: recommended approach or shortcut.
- `info`: background or terminology.
- `note`: optional supplementary detail.
- `important`: prerequisite or critical conclusion.
- `warning`: likely failure, compatibility concern, or side effect.
- `danger`: data loss, credential exposure, or irreversible action.
- `details`: long optional output, derivation, or low-frequency troubleshooting.

```markdown
::: warning 修改前先备份
下面的命令会覆盖现有配置文件。请先复制原文件，并确认恢复方法。
:::

::: details 查看完整输出
这里放不影响主流程的长输出。
:::
```

Use a specific title such as “API Key 安全”, not a generic “注意”. Do not decorate ordinary notes with warnings.

## Platform Tabs

Use tabs for mutually exclusive platforms or approaches:

````markdown
::: tabs#os

@tab Windows

```powershell
winget install <软件包>
```

@tab macOS

```bash
brew install <软件包>
```

:::
````

Reuse the same tab id only when selections should stay synchronized. Do not hide sequential content inside tabs.

Use `code-tabs` when each tab contains only one alternative code block. Keep explanatory prose outside code tabs.

## Diagrams and Structured Content

- Use Mermaid for flows, states, sequences, dependencies, and architecture.
- Use Markmap for short knowledge hierarchies.
- Use `$...$` for inline KaTeX and `$$...$$` for display formulas.
- Use a table for repeated comparable fields.
- Use numbered lists only when order matters.
- Use task lists for real checks or work items.
- Put long logs and secondary derivations inside `details`.

Do not draw a diagram for a simple two- or three-step process that a list explains more clearly.

## Components and Emphasis

- Use `<Badge />` for a short status or property such as “推荐”, “实验性”, or “Windows”.
- Use `<VPCard />` only for a resource that benefits from a title, description, icon, and link.
- Keep ordinary reference lists as Markdown links.
- Use `==mark==`, spoiler, subscript, superscript, alignment, and attributes sparingly.
- Do not combine several emphasis styles in one paragraph.
- Confirm every copied official example against the installed Theme Hope version and the full build.
