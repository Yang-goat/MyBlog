# 项目维护

本文维护运行、验证和清理流程。栏目与命名规则见[内容结构](content-structure.md)，文章规范见[写作技能](../.agents/skills/write-blog-article/SKILL.md)。命令从仓库根目录运行。

## 配置入口

| 文件 | 职责 |
| --- | --- |
| `src/.vuepress/config.ts` | VuePress、Vite 与站点配置 |
| `src/.vuepress/theme.ts` | 主题、Markdown 增强和插件 |
| `src/.vuepress/navbar.ts` | 顶部入口、下拉分组与图标 |
| `src/.vuepress/sidebar.ts` | 各板块文章及可展开子栏目 |
| `src/.vuepress/client.ts` | 客户端行为，包括导图页面的固定路径 |
| `package.json` | 项目命令与依赖版本 |
| `.github/workflows/deploy.yml` | GitHub Pages 构建和发布 |

## 构建与校验

```powershell
pnpm.cmd docs:build
node scripts/validate-content-structure.mjs
git diff --check
git status --short
```

完整博客构建应退出为 0，输出 `VuePress build completed`，并完成页面渲染、SEO、sitemap 和 redirect。页面数量随内容变化，不作为固定验收值。正常构建不应出现 sidebar、`INVALID_ANNOTATION` 或 `PLUGIN_TIMINGS` 警告。

结构脚本读取本次构建的 `.temp/internal/themeData.js` 和 `dist/`，因此必须在构建后运行，且不要与开发服务同时改写这些目录。它检查命名、迁移映射、旧地址跳转、导航与侧边栏边界，以及生成 HTML 的本地链接、图片和导航高亮。新增顶部或下拉分组时，同步检查脚本中的 `groups` 映射。

脚本不覆盖实际点击、响应式效果、公式图形视觉、锚点存在性或独立应用内部行为；本地构建成功也不代表线上已更新。页面变化还应检查对应 HTML 的标题和组件。空目录需要核对 `vp-empty-catalog` 与侧边栏，不能只看构建成功。

独立应用和完整发布按需执行：

```powershell
pnpm.cmd hex:validate
pnpm.cmd hex:test
pnpm.cmd hex:typecheck
pnpm.cmd site:build
```

`site:build` 先构建博客，再将海克斯麻将输出到 `dist/hex-mahjong/`；之后再次单独构建博客可能清掉应用产物。完整发布以 `site:build` 的结果为准。

## 预览与浏览器验证

先检查端口，再在可持续运行的独立终端启动：

```powershell
netstat -ano | Select-String ':4173\s'
pnpm.cmd docs:dev --host 127.0.0.1 --port 4173
```

以终端实际 URL 为准，不重复启动占用同一目标端口的服务。只在涉及交互或视觉时进行浏览器验证；用户选择自行检查时尊重该安排。检查完成后停止自己启动的服务，若仍供用户预览则保留并告知地址。不要用 `Start-Process` 临时后台启动服务。

## 临时文件与清理

| 路径或类型 | 处理方式 |
| --- | --- |
| `src/.vuepress/.cache/`、`.temp/` | 可再生成缓存；停止开发与构建进程后才清理 |
| `src/.vuepress/dist/` | 可再生成构建产物；校验、预览或部署尚需使用时保留 |
| 一次性迁移脚本、任务日志、临时备份 | 核对用途并完成迁移验证后，按明确路径删除 |
| `docs/content-path-map.json` | 持久迁移记录，结构校验依赖它，不属于临时文件 |
| `node_modules/`、锁文件 | 依赖环境与可复现依据，不作为日常临时文件清理 |
| 交接包、原始素材、应用进度记录 | 用户资料，不因被 Git 忽略或名称类似备份而删除 |

递归删除前解析完整路径，确认位于仓库生成目录或本次明确创建的临时目录；不要使用 `git clean -fdx`。清理后重新构建会生成新的必要产物，这不代表旧缓存未清除。

## 工具环境问题

- PowerShell 中统一使用 `pnpm.cmd`，避免执行策略拦截 `pnpm.ps1`。
- 构建若报 esbuild `spawn EPERM`，先区分沙箱权限与项目错误；可申请在沙箱外运行同一构建命令。
- 浏览器工具若报 `windows sandbox failed: spawn setup refresh`，检查最新 sandbox 日志。旧的 `os error 740` 修复经验仅是线索，不自动修改全局沙箱配置；需要重启宿主时报告当前验证限制。
- Git 的 LF/CRLF 转换提示与 `git diff --check` 的空白错误分开判断，不为消除提示全量转换已有文件。

更新依赖是独立维护任务。`docs:update-package` 可能修改依赖与锁文件，不作为普通文章修改或验证步骤。
