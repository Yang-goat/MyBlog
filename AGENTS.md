# 项目协作说明

## 项目概况

这是 Goat_Yang 的中文个人知识博客，基于 VuePress 2、Vue 3、Vite 和 VuePress Theme Hope，使用 pnpm 管理依赖并通过 GitHub Actions 发布。

```text
src/
├── .vuepress/       # 站点、主题、导航、侧边栏、组件和样式
├── ai-ml/           # AI、机器学习、强化学习和优化算法
├── ai-practice/     # 智能体、提示词和 AI 工具实践
├── guides/          # 软件安装、配置和使用教程
├── notes/           # 数学、建模、计算机、语言、前端和音乐随笔
├── links/           # 网站导航
└── README.md        # 首页
```

重要配置：

- `src/.vuepress/config.ts`：VuePress 与 Vite。
- `src/.vuepress/theme.ts`：Theme Hope、Markdown 增强和插件。
- `src/.vuepress/navbar.ts`：顶部导航。
- `src/.vuepress/sidebar.ts`：侧边栏。

## 项目技能

创建、重写、校对或整理博客文章时，必须使用仓库技能 `$write-blog-article`：

```text
.agents/skills/write-blog-article/
```

该技能负责文章文风、结构、Frontmatter、引用、代码、图片以及 Theme Hope 样式。仅修改站点配置或非文章代码时不需要加载。

## 修改约束

- 修改前执行 `git status --short`，记录已有修改。
- 不覆盖、移动或回退与当前任务无关的用户修改。
- 单次补丁过长时分批修改，避免 Windows 拒绝操作。
- 本项目使用 PowerShell。正则表达式优先使用单引号，避免 `|` 和引号被错误解析。
- 不临时安装依赖，优先使用仓库已有脚本和工具。
- 不直接修改 `node_modules` 或 VuePress 生成目录。
- 搜索旧 `/dev/` 路径时逐条判断；Linux 设备路径和外部 URL 不能批量替换。
- 移动文章时同步检查导航、侧边栏、站内链接、图片路径和重定向需求。
- `git ls-tree` 默认转义中文路径；不要直接把其输出当作 PowerShell 路径。
- `core.autocrlf=true` 时工作区哈希可能不同于 Git blob，不用简单哈希判断内容迁移是否一致。

## 常用命令

PowerShell 执行策略可能阻止 `pnpm.ps1`，统一使用 `pnpm.cmd`。

```powershell
pnpm.cmd docs:dev
pnpm.cmd docs:clean-dev
pnpm.cmd docs:build
```

完整构建成功标准：

- 命令退出码为 `0`。
- 输出包含 `VuePress build completed`。
- 页面渲染、SEO、sitemap 和 redirect 阶段完成。
- 当前正常构建不应出现 sidebar、`INVALID_ANNOTATION` 或 `PLUGIN_TIMINGS` 警告。

构建产物位于 `src/.vuepress/dist/`，已被 Git 忽略。

## 验证要求

所有内容或配置修改都必须执行：

```powershell
pnpm.cmd docs:build
git diff --check
git status --short
```

按变更范围补充验证：

- 文章或路由：确认对应 HTML 存在并包含预期标题。
- 导航：检查 `.temp/internal/themeData.js` 和生成 HTML 中的链接、文字与下拉结构。
- 侧边栏：确认结构化栏目仍显示侧边栏，聚合页按配置保持无侧边栏。
- 空目录：同时验证 `vp-empty-catalog` 和预期侧边栏；空目录使用 `"structure"` 时主题可能隐藏侧边栏。
- Markdown 增强：验证公式、Mermaid、Markmap、tabs、图片和组件已正确渲染。
- 旧名称或路径：使用 `rg` 排除 `.git`、`node_modules`、`.temp`、`.cache` 和 `dist` 后逐条检查。

只有涉及点击、下拉菜单、响应式布局或视觉效果时才启动开发服务器并进行浏览器测试。

## 浏览器测试

1. 先用 `netstat -ano` 检查计划端口。
2. 在可持续运行的独立终端执行：

```powershell
pnpm.cmd docs:dev --host 127.0.0.1 --port 4173
```

3. 以终端实际 URL 为准；端口占用时 VuePress 会自动尝试后续端口。
4. 优先使用 Codex Browser 检查标题、URL、空白页、Vite 错误、控制台、导航交互和窄屏布局。
5. 测试结束后停止服务器并确认端口不再监听。

不要使用 `Start-Process` 临时后台启动服务器。独立 Playwright MCP 与 shell localhost 可能不在同一网络环境中，连接失败不能直接判定为项目失败。

## 已知工具问题

Codex Browser 或 `node_repl` 若报 `windows sandbox failed: spawn setup refresh`：

1. 检查最新的 `~/.codex/.sandbox/sandbox*.log`。
2. 若日志包含 `codex-windows-sandbox-setup.exe`、`os error 740` 或“请求的操作需要提升”，将 `~/.codex/config.toml` 设置为：

```toml
[windows]
sandbox = "unelevated"
```

3. 完全退出并重新打开 Codex Desktop，然后先验证最小 `node_repl` 调用。

不要改成无沙箱，不要删除插件缓存、重装 Browser 或修改 WindowsApps ACL。若不是错误 740，按日志中的实际 Win32 错误排查。

沙箱内执行构建若因 esbuild `spawn EPERM` 失败，可申请在沙箱外运行相同的 `pnpm.cmd docs:build`；这是工具限制，不是项目构建失败。

## 完成标准

- 修改范围符合任务要求，没有覆盖已有用户修改。
- 完整构建成功，并记录生成页面数量。
- 相关路由、文案、导航、侧边栏或 Markdown 功能已按范围验证。
- `git diff --check` 无空白错误。
- `git status --short` 只包含任务修改和任务开始前已有修改。
- 最终汇报列出测试命令，并区分项目错误、依赖警告和工具/沙箱错误。
- 未执行浏览器测试时，说明因为不涉及交互/视觉，或给出具体工具阻断原因。
