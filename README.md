# myBlog

Goat_Yang 的中文知识博客，记录 AI 与算法、AI 应用、论文阅读、软件工具和学习随笔。基于 VuePress 2、Vue 3、Vite 与 VuePress Theme Hope，通过 GitHub Actions 发布到 GitHub Pages。

## 本地运行

使用 Node.js 22（与部署工作流一致），pnpm 版本以 `package.json` 的 `packageManager` 为准。Windows PowerShell 中使用 `pnpm.cmd`。

```powershell
git clone https://github.com/Yang-goat/MyBlog
cd MyBlog
pnpm.cmd install --frozen-lockfile
pnpm.cmd docs:dev --host 127.0.0.1 --port 4173
```

访问终端输出的实际 URL；端口占用时可能自动顺延。

## 维护入口

| 要做的事 | 阅读位置 |
| --- | --- |
| 找到栏目、增加文章或调整分类 | [内容结构与命名](docs/content-structure.md) |
| 构建、验证、清理与发布 | [项目维护](docs/maintenance.md) |
| 使用 AI 编写或整理文章 | [仓库写作技能](.agents/skills/write-blog-article/SKILL.md) |
| 修改项目时遵守的协作约束 | [AGENTS.md](AGENTS.md) |
| 核对本次目录迁移前后的路径 | [路径对照表](docs/content-path-map.json) |

## 项目结构

```text
myBlog/
├── .agents/skills/         # 仓库维护的写作技能
├── .github/workflows/     # 构建与部署
├── apps/hex-mahjong/      # 独立海克斯麻将应用
├── docs/                  # 项目维护文档，不发布为博客文章
├── scripts/               # 内容结构校验
├── src/
│   ├── .vuepress/         # 配置、组件、样式与公共资源
│   ├── ai-algorithms/     # AI 与算法
│   ├── ai-applications/   # AI 应用
│   ├── paper-notes/       # 论文随笔
│   ├── notes/             # 学习与日常随笔
│   ├── software-tools/    # 软件工具
│   ├── external-links/    # 外站
│   ├── about.md           # 作者介绍
│   └── README.md          # 网站首页
└── package.json           # 命令和依赖版本
```

栏目、文件夹和侧边栏逐级对应；导航与侧边栏使用显式手动配置。文章保留一个主路径，跨板块关联放在正文链接中。

## 常用命令

```powershell
pnpm.cmd docs:build                        # 构建博客
node scripts/validate-content-structure.mjs # 构建后校验目录、引用和导航
pnpm.cmd docs:clean-dev                    # 清缓存启动开发服务
pnpm.cmd site:build                        # 博客 + 海克斯麻将，完整部署产物
```

`docs:build` 不包含独立应用。部署工作流在 `main` 推送或手动触发时执行校验并构建完整站点，产物位于 `src/.vuepress/dist/`。

## 许可与致谢

项目许可证见 [LICENSE](LICENSE)。博客主题使用 [VuePress Theme Hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope)。
