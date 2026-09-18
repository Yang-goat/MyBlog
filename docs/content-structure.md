# 内容目录与导航约定

文件树与网站层级一一对应：顶部栏目对应一级目录，下拉分组对应第二级目录，可点击板块对应其下的目录；板块中的侧边栏分组对应子目录，文章放在所属目录中。没有下拉分组的栏目直接放板块目录。

## 目录总览

```text
src/
├── ai-algorithms/                         # AI 与算法
│   ├── foundations/                       # 基础与方法
│   │   ├── general/                       # 通识基础
│   │   ├── parameter-analysis/            # 参数设置分析方法
│   │   ├── non-learning-methods/          # 非学习类算法
│   │   └── problem-cases/                 # 具体问题与案例
│   ├── learning/                          # 机器学习与研究
│   │   ├── machine-learning/              # 机器学习
│   │   ├── deep-learning/                 # 深度学习
│   │   ├── transfer-learning/             # 迁移学习
│   │   └── reinforcement-learning/        # 强化学习
│   │       ├── mathematical-principles/   # 强化学习的数学原理
│   │       └── frontier-methods/          # 前沿方法
│   └── optimization/                      # 智能优化
│       ├── fundamentals/                  # 优化基础与算法
│       │   ├── theory/                    # 优化基础理论知识
│       │   ├── differential-evolution/    # 差分进化算法
│       │   ├── genetic-operators/         # 遗传算法的算子
│       │   └── …                          # 其余算法家族
│       ├── frontier-algorithms/           # 前沿算法与框架
│       │   └── research-directions.md     # 研究方向导图，普通文章
│       └── benchmarks/                    # 基准测试与竞赛
├── ai-applications/                       # AI 应用
│   ├── knowledge-retrieval/               # 知识与检索
│   │   ├── knowledge-graphs/              # 知识图谱
│   │   └── rag/                           # 检索增强生成
│   ├── agent-systems/                     # 智能体系统
│   │   ├── agent-design/                  # Agent 设计
│   │   ├── memory/                        # 记忆系统
│   │   └── prompt-engineering/            # 提示词工程
│   └── tools-practice/                    # 工具与实践
│       ├── agent-clients/                 # Agent 客户端与工具
│       ├── skills-mcp/                    # Skills、MCP 与插件
│       └── topics/                        # AI 应用话题
├── paper-notes/                           # 论文随笔
│   └── weekly/                            # 每周阅读总结
├── notes/                                # 随笔
│   ├── mathematical-modeling/             # 数学建模专题
│   ├── mathematics/                       # 数学随记
│   ├── signal-processing/                 # 信号处理
│   ├── computing/                         # 计算机随记
│   ├── programming-languages/             # 程序设计语言随笔
│   ├── web-development/                   # 前端随笔
│   ├── hex-mahjong/                       # 海克斯麻将
│   └── music/                             # 音乐
├── software-tools/                        # 软件工具
│   ├── version-control/                   # 版本控制
│   │   └── git/
│   ├── systems-containers/                # 系统与容器
│   │   ├── linux/
│   │   └── docker/
│   ├── development-remote/                # 开发与远程工具
│   │   ├── vscode/
│   │   └── remote-access/
│   ├── documentation-knowledge/           # 文档与知识管理
│   │   ├── paper-management/
│   │   └── latex/
│   └── open-source-projects/              # 开源项目推荐
├── external-links/                       # 外站
├── about.md                              # 个人介绍，通过作者等入口访问
└── README.md                             # 首页
```

`.vuepress/` 是站点实现，`en/` 是语言入口，`tests/` 是演示页；它们不属于中文内容导航树。随文资源使用各文章目录下的 `assets/`，公共静态资源保留在 `.vuepress/public/`。

## 命名与新增内容

- 目录、文章和随文图片使用英文小写连字符命名，例如 `hypothesis-testing`、`bellman-equations.md`。缩写统一小写，例如 `rag`、`lstm.md`。
- 目录首页保留 `README.md`；文章标题和网站上显示的栏目名称使用中文。
- 有顺序的教程可使用两位数字前缀，例如 `01-reinforcement-learning-overview.md`，并保留 Frontmatter 的 `order`。
- 新增文章时，将文件放入对应目录，在 `src/.vuepress/sidebar.ts` 的对应板块列出相对文件名。直属文章是普通链接，有子文章的目录使用 `prefix`、`children` 与 `collapsible` 配置。
- 导航入口在 `src/.vuepress/navbar.ts` 显式配置。独立板块使用并列路径，不将一个板块放在另一个板块的目录内。
- 前沿算法与框架后续按研究方向增加子目录和同名侧边栏分组；只有实际内容准备好后再创建对应分组。
- 板块间的联系写在文章正文链接中，不将其他板块的文章挂入当前侧边栏。

## 栏目边界

- 论文随笔按周记录阅读过程，专题文章整理成熟的方法与知识，二者通过正文链接关联。分类与标签描述文章本身，不用于将同一文章挂入多个板块。
- 智能优化的基础算法按家族组织；文献中的新方法与计算框架放在前沿算法与框架，研究方向导图作为普通文章，后续有内容再按方向建立子栏目。
- CEC 年度题目、赛道与历年结果归入基准测试与竞赛。它是评测资料入口，不作为独立研究方向；冠军和趋势分析应引用原始结果。
- 强化学习的基础教程归入数学原理，论文中的新方法归入前沿方法；迁移学习作为独立板块。
- AI 应用区分知识与检索、智能体系统、工具与实践；提示词工程归入智能体系统。
- 目录页首句解释标题中的概念或领域，不使用“这里整理……”；正文目录由 `<Catalog />` 生成。

## 手动配置侧边栏

沿用所在板块的写法，直接列出文章；只有含子文章的目录才使用可展开分组。以下是新增子栏目时的示意，路径需要替换成实际存在的目录：

```ts
"/ai-algorithms/optimization/frontier-algorithms/": [
  "",
  "research-directions",
  {
    text: "代理辅助优化",
    prefix: "/ai-algorithms/optimization/frontier-algorithms/surrogate-assisted/",
    link: "/ai-algorithms/optimization/frontier-algorithms/surrogate-assisted/",
    collapsible: true,
    children: ["example-method"],
  },
],
```

对应文件为板块首页 `README.md`、直属文章 `research-directions.md`、子栏目首页 `surrogate-assisted/README.md` 和子文章 `surrogate-assisted/example-method.md`。空栏目先作为普通入口，不创建空的展开组。顶部可点击入口进入独立板块；下拉项使用含义对应、便于区分的图标。

## 路径变更与验证

[迁移对照表](content-path-map.json)记录本次迁移前后的全部内容与随文资源路径，路径相对于 `src/`。已迁移页面的 `redirectFrom` 保留此前地址；内部引用使用新地址，避免依赖重定向浏览。

这份对照表是持久校验依据，不是待清理的临时文件。后续再次移动已登记的文件时，更新相应目标路径，并保留历次公开地址的 `redirectFrom`，使旧地址直接指向现页。新增文章不必补入历史迁移清单。

后续重命名时，同步更新 Markdown 引用、导航、侧边栏、客户端固定路径与资源引用；修改链接时保留锚点和查询参数，不替换外部链接或示例代码。

```powershell
pnpm.cmd docs:build
node scripts/validate-content-structure.mjs
git diff --check
git status --short
```

验证脚本检查文件命名、内容迁移完整性、旧地址跳转、导航与侧边栏的目录边界，以及构建页面中的导航高亮。运行前提、覆盖范围与清理规则见[项目维护](maintenance.md)。
