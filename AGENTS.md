# 项目协作说明

涉及到网站设计时，可以参考使用的VuePress Theme Hope框架的[官方文档](https://theme-hope.vuejs.press/zh/)

## 修改要求

- 如果单次修改太长，请分批次修改，否则 Windows 可能拒绝修改。
- 修改前先执行 `git status --short`。不要覆盖或回退与当前任务无关的用户修改。
- 本项目使用 PowerShell。涉及正则表达式时优先使用单引号，避免 `|`、引号等字符被 PowerShell 错误解析。

## 测试时遇到过的问题

1. 直接执行 `pnpm` 会调用 `pnpm.ps1`，可能被 PowerShell 执行策略阻止。统一使用 `pnpm.cmd`。
2. 使用 `Start-Process` 启动开发服务器时，当前环境可能因同时存在 `Path` 和 `PATH` 而报“字典关键字重复”；即使通过其他后台方式启动，子进程也可能在命令结束后退出。
3. 指定端口被占用时，VuePress/Vite 会自动尝试后续端口。浏览器如果仍访问原端口，会得到连接失败或访问到其他服务。本版本 VuePress CLI 不支持 `--strictPort`。
4. Codex Browser/`node_repl` 若报 `windows sandbox failed: spawn setup refresh`，先检查最新的 `~/.codex/.sandbox/sandbox*.log`。若包含 `failed to spawn ... codex-windows-sandbox-setup.exe`、`os error 740` 或“请求的操作需要提升”，这是 Codex elevated Windows sandbox 的已知问题，不是网站或 Browser 插件故障。将 `~/.codex/config.toml` 中的 `[windows] sandbox` 改为 `"unelevated"`，完全退出并重新打开 Codex Desktop，再用最小 `node_repl` 调用和 Browser 初始化验证。不要改成无沙箱，不要删除插件缓存、重装 Browser、修改 WindowsApps ACL，也不要反复重置；这些操作无法解决该错误。若日志不是 740，则保留原配置并根据日志中的实际 Win32 错误继续排查。
5. 独立 Playwright MCP 与 shell 启动的 localhost 可能不在同一网络环境中，因此 Playwright 可能无法访问一个已经正常启动的本地服务。不要把这种连接失败误判为站点构建失败。
6. 空目录配置为 `"structure"` 时没有子项可生成，主题会隐藏侧边栏。需要空目录也显示侧边栏时，应配置显式的单项侧边栏，并在生成 HTML 中验证。
7. 构建时会出现 `@vueuse/core` 的 `INVALID_ANNOTATION` 警告，以及 category/tag 页面缺少 sidebar 配置的提示。这些是当前依赖和项目已有警告；只要构建最终显示成功，不应当作本次修改失败。
8. 搜索旧 `/dev/` 路径时会命中 Linux 设备路径（如 `/dev/sda`）和外部 URL（如 `https://.../dev/...`），不能批量替换这些内容。
9. `git ls-tree` 默认会转义中文路径，直接把输出作为 PowerShell 路径会失败。`core.autocrlf=true` 也会让工作区文件哈希与 Git blob 哈希不同，不要用简单哈希比较判断迁移内容被修改。

## 标准测试流程

### 1. 测试前检查

```powershell
git status --short
Get-Content -Raw -Encoding utf8 package.json
```

- 记录测试前已有的修改，测试结束后确认没有误改这些文件。
- 确认使用仓库现有的 `docs:build` 和 `docs:dev` 脚本，不要临时安装依赖。

### 2. 必须执行完整构建

```powershell
pnpm.cmd docs:build
```

成功标准：

- 命令退出码为 `0`。
- 输出包含 `VuePress build completed`。
- 页面渲染、SEO、sitemap 和 redirect 阶段完成。
- 允许出现上文列出的已知依赖和 sidebar 警告。

构建产物位于 `src/.vuepress/dist/`，该目录已被 `.gitignore` 忽略。

### 3. 验证路由和页面文案

对于本次修改涉及的每个路由，检查对应 HTML 文件存在，并包含预期标题：

```powershell
$checks = @(
  @("src\.vuepress\dist\ai-practice\index.html", "AI应用实践"),
  @("src\.vuepress\dist\notes\music\index.html", "音乐"),
  @("src\.vuepress\dist\notes\language\index.html", "程序设计语言随笔"),
  @("src\.vuepress\dist\notes\frontend\index.html", "前端随笔"),
  @("src\.vuepress\dist\links\index.html", "网站导航")
)

foreach ($check in $checks) {
  $content = Get-Content -Raw -Encoding utf8 $check[0]
  if (-not $content.Contains($check[1])) {
    throw "Missing expected text '$($check[1])' in $($check[0])"
  }
}
```

测试其他功能时，应按实际变更替换 `$checks` 中的路径和文本。

### 4. 验证导航结构

构建后检查：

```powershell
Get-Content -Raw -Encoding utf8 src\.vuepress\.temp\internal\themeData.js
```

对于纯下拉一级栏目，确认：

- 配置对象包含 `children`。
- 一级对象本身不包含 `link`。
- 生成 HTML 使用 `vp-dropdown-title` 按钮，而不是一级 `<a>` 链接。
- 所有二级入口的文字和目标路由都存在。

可以在任意已生成页面中搜索：

```powershell
rg -n 'vp-dropdown-title|人工智能·算法|程序设计语言随笔|前端随笔|网站导航' src\.vuepress\dist\index.html
```

### 5. 验证空目录和侧边栏

空目录页面既要显示“暂无目录”，也要显示侧边栏：

```powershell
$pages = @(
  "src\.vuepress\dist\ai-practice\index.html",
  "src\.vuepress\dist\notes\music\index.html"
)

foreach ($page in $pages) {
  $content = Get-Content -Raw -Encoding utf8 $page
  if ($content.Contains("no-sidebar")) {
    throw "Sidebar is hidden in $page"
  }
  if (-not $content.Contains('class="vp-sidebar"')) {
    throw "Sidebar is missing in $page"
  }
  if (-not $content.Contains("vp-empty-catalog")) {
    throw "Empty catalog state is missing in $page"
  }
}
```

### 6. 检查旧链接和名称残留

搜索时排除依赖、Git 和 VuePress 生成目录：

```powershell
rg -n --hidden `
  --glob '!node_modules/**' `
  --glob '!.git/**' `
  --glob '!src/.vuepress/.temp/**' `
  --glob '!src/.vuepress/.cache/**' `
  --glob '!src/.vuepress/dist/**' `
  '编程开发|宝藏站点|/dev/' src README.md
```

逐条判断命中结果。Linux 设备路径和外部 URL 应保留。

### 7. 浏览器交互测试

只有需要验证点击、下拉菜单、响应式布局或视觉效果时才启动开发服务器。

1. 先用 `netstat -ano` 检查计划使用的端口。
2. 在可持续运行的独立终端中执行：

```powershell
pnpm.cmd docs:dev --host 127.0.0.1 --port 4173
```

3. 以终端实际输出的 URL 为准。端口被占用时 VuePress 会自动更换端口。
4. 优先使用 Codex Browser 插件检查：
   - 页面标题和 URL 正确；
   - 页面不是空白页；
   - 没有 Vite/Vue 错误遮罩；
   - 控制台没有本次修改引入的错误；
   - 一级下拉按钮可打开；
   - 二级链接可进入正确页面；
   - 桌面端和窄屏各检查一次。
5. Browser 插件若出现 `windows sandbox failed: spawn setup refresh`：
   - 先执行最小 `node_repl` 调用，确认错误发生在 Browser 初始化之前。
   - 检查最新沙箱日志：

```powershell
$sandboxLog = Get-ChildItem "$env:USERPROFILE\.codex\.sandbox\sandbox*.log" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

Select-String -Path $sandboxLog.FullName `
  -Pattern 'failed to spawn|os error 740|请求的操作需要提升' `
  -Context 2,4
```

   - 若命中 `os error 740`，确认 `~/.codex/config.toml` 包含：

```toml
[windows]
sandbox = "unelevated"
```

   - 修改配置后必须完全退出并重新打开 Codex Desktop；只重置 `node_repl` 不会重新加载 MCP 启动环境。
   - 重启后先验证最小 `node_repl` 调用，再初始化 Browser 并打开目标页面。
   - 若日志不是 740，或切换为 `unelevated` 并重启后仍失败，记录日志中的具体 Win32 错误，完成构建产物静态检查，并明确说明浏览器交互测试受哪个工具错误阻断。不要把工具错误描述成项目失败。
6. 不要使用 `Start-Process` 临时后台启动服务器，也不要默认使用独立 Playwright MCP 连接 shell 的 localhost。

### 8. 测试结束检查

```powershell
git diff --check
git status --short
```

- `git diff --check` 不应报告空白错误。
- `git status` 中只应包含任务预期修改和测试前已存在的用户修改。
- 如果启动了开发服务器，结束测试后停止该服务器，并确认测试端口不再监听。

## 最终汇报要求

- 明确列出执行过的测试命令。
- 说明构建是否成功，以及生成了多少页面。
- 区分项目错误、已知警告和测试工具/沙箱错误。
- 如果未完成浏览器交互测试，必须说明具体阻断原因，不得仅写“未测试”。
