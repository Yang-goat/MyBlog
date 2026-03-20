# myBlog

一个基于 VuePress 2 和 `vuepress-theme-hope` 的个人博客项目，主要用于整理 AI/ML、开发、数学笔记和软件教程。

## 技术栈

- VuePress 2
- Vue 3
- Vite
- vuepress-theme-hope
- pnpm

## 本地开发

```bash
git clone https://github.com/Yang-goat/MyBlog
cd myBlog
pnpm install
pnpm docs:dev
```

默认访问地址：`http://localhost:8080`

## 常用命令

```bash
pnpm docs:dev
pnpm docs:clean-dev
pnpm docs:build
pnpm docs:update-package
```

## 目录结构

```text
myBlog/
├── .github/workflows/      # GitHub Pages 部署工作流
├── scripts/                # 辅助脚本
├── src/                    # 博客内容
│   ├── .vuepress/          # 站点配置、主题、组件与静态资源
│   ├── ai-ml/              # AI / ML 笔记
│   ├── dev/                # 开发相关内容
│   ├── guides/             # 软件教程
│   ├── links/              # 收藏站点
│   └── notes/              # 数学与竞赛笔记
├── package.json
└── README.md
```

## 部署

仓库通过 GitHub Actions 自动构建，并发布到 GitHub Pages。

## License

MIT

## Acknowledgements

Built on [vuepress-theme-hope](https://github.com/vuepress-theme-hope/vuepress-theme-hope).
