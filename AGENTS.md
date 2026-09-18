# 项目协作说明

## 项目概况

这是 Goat_Yang 的中文个人知识博客，基于 VuePress 2、Vue 3、Vite 和 VuePress Theme Hope，使用 pnpm 管理依赖并通过 GitHub Actions 发布。

```text
src/
├── .vuepress/       # 站点、主题、导航、侧边栏、组件和样式
├── ai-algorithms/   # AI 与算法：基础与方法、学习、智能优化
├── ai-applications/ # AI 应用：知识检索、智能体系统、工具实践
├── software-tools/  # 软件工具：版本控制、系统、开发、文档与知识管理
├── notes/           # 数学、建模、计算机、语言、前端和音乐随笔
├── paper-notes/     # 论文随笔与每周阅读总结
├── external-links/  # 外站
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

## 内容目录与命名

- 文件树按顶部栏目、下拉分组、板块、侧边栏子栏目逐级组织，详见 `docs/content-structure.md`。
- 目录与文件使用英文小写连字符命名；目录首页使用 `README.md`，随文资源统一放 `assets/`。
- 导航和侧边栏保留显式配置；侧边栏分组使用对应目录的 `prefix`，文章使用相对文件名。
- 迁移需同步内部引用与 `redirectFrom`，禁止让同级独立板块互相嵌套。

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

## 验证与运行

具体命令、产物、预览和清理方法统一维护在 [项目维护文档](docs/maintenance.md)，不要在多处复制完整流程。

- 内容或配置修改后执行 `pnpm.cmd docs:build`、`node scripts/validate-content-structure.mjs`、`git diff --check` 和 `git status --short`。
- 记录构建退出码、生成页面数及警告。检查受影响页面的标题、侧边栏、链接和 Markdown 组件；脚本检查不能替代视觉或实际交互验证。
- 导航分组变化时同步结构校验脚本的 `groups` 映射；旧路径排查需区分兼容重定向、迁移记录和外部 URL。
- 文档或技能修改检查本地引用；技能修改额外执行可用的 `quick_validate.py`。
- 不同时运行改写 VuePress `.temp/` 的构建与开发进程。完整部署需 `site:build`，单独 `docs:build` 不含海克斯麻将应用。
- 只在涉及交互或视觉时启动浏览器测试。用户选择自行检查时不擅自操作浏览器；仍供用户使用的预览服务可以保留并报告地址。
- 清理只针对已确认的临时文件与生成目录，先核对绝对路径和进程。迁移映射、源素材和交接包不是临时文件。
- 工具报错按当前日志核实，不依据旧修复经验自动修改全局沙箱设置。

## 完成标准

- 修改范围符合任务要求，没有覆盖已有用户修改。
- 完整构建成功，并记录生成页面数量。
- 相关路由、文案、导航、侧边栏或 Markdown 功能已按范围验证。
- `git diff --check` 无空白错误。
- `git status --short` 只包含任务修改和任务开始前已有修改。
- 最终汇报列出测试命令，并区分项目错误、依赖警告和工具/沙箱错误。
- 未执行浏览器测试时，说明因为不涉及交互/视觉，或给出具体工具阻断原因。
