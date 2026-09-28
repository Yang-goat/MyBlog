# 知识图谱文章标签与链接整理记录

整理日期：2026-09-28。此记录对应知识图谱首版内容整理批次，保存于当前工作区；不代表线上已发布。

## 范围与结果

审计覆盖 AI 与算法、AI 应用、随笔、软件工具和论文随笔中的 264 篇既有文章。排除所有 `README.md`、资源目录，以及新建的《本站知识图谱》。完整逐篇清单、原始文件校验值、前后标签和每条新增链接见[机器可读变更记录](knowledge-graph-content-changes.json)。

| 项目 | 本批次结果 |
| --- | ---: |
| 审计文章 | 264 |
| 修改文章（去重） | 63 |
| 修改标签的文章 | 57 |
| 补充链接的文章 | 23 |
| 新增正文链接 | 35 |
| 不同标签数 | 150 → 177 |

标签数增加主要来自补齐缺失的具体领域与工具名称。数量不作为连接质量或完成度指标；最终文章节点、主题节点及引用关系数以 VuePress 图谱数据生成结果为准。

## 审计取舍

- 强化学习系列补齐“强化学习”，值迭代、蒙特卡罗、时序差分等章节按实际内容增加相应方法标签；仅含导图的总结保留正文原样。
- Python、Java、Git、Docker、LaTeX 和 VS Code 文章补齐正文所讨论的语言或工具，保留原有“库”“教程”“模板”等体裁信息。
- 数学随记补充数值分析、统计推断、不动点理论等具体主题；“排序聚合”与“排序距离”分开，使用正文链接表达两篇文章的关联。
- ripgrep 与 LibreOffice 文章中的“智能体”均指 AI Agent，统一为本站已有的“AI Agent”；GitHub CLI 文章明确给出简称 gh，合并同篇重复标签，标题与正文中的 gh 保留。
- 已有家族标签明确的算法文章保留原有标签，不批量添加“智能优化”或互相补链；已有 DE 系列互链保留，仅在学习驱动 DE 的策略梯度段落补充前置知识链接。
- 论文周记与专题已有引用继续保留；纯代码速查、导图或无自然引用位置的文章不强行补链。

保留而未强行合并的标签：`文献管理` 与 `论文管理`（范围不完全相同）、`命令行` 与 `命令行工具`（使用环境与工具分类不同）、`知识库` 与 `知识管理`（对象与活动不同）、`参数自适应` 与 `种群规模控制`（机制不同）。没有发现需要全站机械替换的大小写或空格重复标签。

图谱中的主题排除规则由生成器集中维护。正文和元数据中的体裁标签可以继续用于站点原有标签功能；不因图谱展示需要删除它们。

## 标签变更

下表为全部标签变更。具体主题依据文章主标题、导语、讲解对象或代码所用工具；所有非 `tag` 元数据保持原始字节。

| 文章 | 整理前 | 整理后 |
| --- | --- | --- |
| [逆变换采样](../src/ai-algorithms/foundations/general/inverse-transform-sampling.md) | 算法 | 算法、采样方法、概率论 |
| [学习类算法导论](../src/ai-algorithms/foundations/general/learning-algorithms-introduction.md) | 导论 | 导论、机器学习 |
| [算法性能指标](../src/ai-algorithms/foundations/problem-cases/multi-objective-optimization/evaluation-metrics.md) | 评价指标 | 评价指标、多目标优化 |
| [残差连接和归一化层 Add & Norm](../src/ai-algorithms/learning/deep-learning/addnorm.md) | 网络结构 | 网络结构、深度学习 |
| [必备代码](../src/ai-algorithms/learning/deep-learning/essential-code.md) | 模板、Python | 模板、Python、深度学习、PyTorch |
| [门控循环神经网络 GRU](../src/ai-algorithms/learning/deep-learning/gru.md) | 网络结构 | 网络结构、深度学习、循环神经网络 |
| [长短时记忆网络 LSTM](../src/ai-algorithms/learning/deep-learning/lstm.md) | 网络结构 | 网络结构、深度学习、循环神经网络 |
| [K近邻算法（KNN）](../src/ai-algorithms/learning/machine-learning/knn.md) | 监督学习、无参数学习、算法 | 监督学习、无参数学习、算法、机器学习 |
| [强化学习概述](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/01-reinforcement-learning-overview.md) | 导论 | 导论、强化学习、机器学习 |
| [贝尔曼公式](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/02-bellman-equations.md) | 贝尔曼方程、理论 | 贝尔曼方程、理论、强化学习 |
| [贝尔曼最优公式](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/03-bellman-optimality-equations.md) | 贝尔曼方程、最优控制 | 贝尔曼方程、最优控制、强化学习 |
| [值迭代与策略迭代](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/04-value-and-policy-iteration.md) | 算法 | 算法、强化学习、动态规划 |
| [蒙特卡罗方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/05-monte-carlo-methods.md) | 算法 | 算法、强化学习、蒙特卡罗方法 |
| [随机近似算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/06-stochastic-approximation.md) | 算法 | 算法、强化学习、随机近似 |
| [时序差分方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/07-temporal-difference-methods.md) | 算法 | 算法、强化学习、时序差分 |
| [值函数方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/08-value-function-methods.md) | 算法 | 算法、强化学习、值函数逼近 |
| [策略梯度算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/09-policy-gradient-methods.md) | 算法 | 算法、强化学习、策略梯度 |
| [演员-评论家方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/10-actor-critic-methods.md) | 算法 | 算法、强化学习、策略梯度、Actor-Critic |
| [总结](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/11-summary.md) | 总结 | 总结、强化学习 |
| [迁移学习基础：从预训练到微调](../src/ai-algorithms/learning/transfer-learning/transfer-learning-basics.md) | 预训练、特征提取、微调、领域适应 | 预训练、特征提取、微调、领域适应、迁移学习 |
| [优化研究方向思维导图](../src/ai-algorithms/optimization/frontier-algorithms/research-directions.md) | （无） | 智能优化 |
| [分类思维导图](../src/ai-algorithms/optimization/fundamentals/algorithm-family-map.md) | 导论、分类 | 导论、分类、智能优化 |
| [基于模型方法 VS 非基于模型方法](../src/ai-algorithms/optimization/fundamentals/theory/model-based-and-model-free.md) | 导论 | 导论、智能优化 |
| [智能优化算法的分类](../src/ai-algorithms/optimization/fundamentals/theory/optimization-categories.md) | 导论 | 导论、智能优化 |
| [优化问题的分类](../src/ai-algorithms/optimization/fundamentals/theory/optimization-problem.md) | 导论、问题 | 导论、问题、智能优化 |
| [优化理论](../src/ai-algorithms/optimization/fundamentals/theory/optimization-theory.md) | 导论 | 导论、优化理论 |
| [GitHub CLI（gh）：AI Agent 使用 GitHub 的命令行入口](../src/ai-applications/tools-practice/agent-clients/tools/gh.md) | GitHub、GitHub CLI、gh、AI Agent、命令行工具 | GitHub、GitHub CLI、AI Agent、命令行工具 |
| [LibreOffice 下载与安装教程](../src/ai-applications/tools-practice/agent-clients/tools/libreoffice.md) | 智能体、LibreOffice、文档处理 | AI Agent、LibreOffice、文档处理 |
| [ripgrep（rg）下载与安装教程](../src/ai-applications/tools-practice/agent-clients/tools/ripgrep.md) | 智能体、ripgrep、命令行工具 | AI Agent、ripgrep、命令行工具 |
| [封闭形式表达式 VS 非封闭形式表达式](../src/notes/mathematics/closed-form-expression.md) | 随笔 | 随笔、数值分析 |
| [共识排列](../src/notes/mathematics/consensus-ranking.md) | 随笔 | 随笔、排序聚合 |
| [一致估计量](../src/notes/mathematics/consistent-estimator.md) | 随笔 | 随笔、统计推断、概率论 |
| [压缩映射定理](../src/notes/mathematics/contraction-mapping.md) | 随笔 | 随笔、不动点理论 |
| [Kendall Tau 距离](../src/notes/mathematics/kendall-tau.md) | 随笔 | 随笔、排序距离 |
| [计算方法随记 1](../src/notes/mathematics/numerical-methods-notes-1.md) | 随笔 | 随笔、数值分析 |
| [计算方法随记 2](../src/notes/mathematics/numerical-methods-notes-2.md) | 随笔 | 随笔、数值分析 |
| [GUI框架 JavaFX](../src/notes/programming-languages/java/javafx.md) | 框架 | 框架、Java、JavaFX |
| [maven安装教程](../src/notes/programming-languages/java/maven.md) | 包管理、教程 | 包管理、教程、Java、Maven |
| [conda 指令速查表](../src/notes/programming-languages/python/conda.md) | 包管理、指令速查 | 包管理、指令速查、Python、Conda |
| [dataclass 用法](../src/notes/programming-languages/python/dataclass.md) | 库 | 库、Python、dataclass |
| [Jupyter notebook](../src/notes/programming-languages/python/jupyter-notebook.md) | 库 | 库、Python、Jupyter Notebook |
| [Pandas](../src/notes/programming-languages/python/pandas.md) | 库 | 库、Python、pandas |
| [类型提示](../src/notes/programming-languages/python/type-hints.md) | 库 | 库、Python、类型提示 |
| [概述](../src/notes/web-development/modules/overview.md) | 导论 | 导论、JavaScript、ES Modules |
| [前端工具链概述](../src/notes/web-development/toolchains/overview.md) | 导论 | 导论、Node.js、构建与打包 |
| [VSCode 中 Latex 环境配置](../src/software-tools/development-remote/vscode/latex-setup.md) | 教程 | 教程、VS Code、LaTeX |
| [VSCode多语言环境配置](../src/software-tools/development-remote/vscode/multi-language-setup.md) | 教程 | 教程、VS Code |
| [创建文件模板](../src/software-tools/development-remote/vscode/snippet.md) | 教程 | 教程、VS Code |
| [数学建模论文模板](../src/software-tools/documentation-knowledge/latex/mathematical-modeling-paper-template.md) | 模板 | 模板、LaTeX、数学建模 |
| [USTS本科生毕业论文模板](../src/software-tools/documentation-knowledge/latex/usts-undergraduate-thesis-template.md) | 模板 | 模板、LaTeX |
| [Docker 常用指令](../src/software-tools/systems-containers/docker/command.md) | 指令速查 | 指令速查、Docker |
| [Docker 的国内下载安装教程](../src/software-tools/systems-containers/docker/install.md) | 教程 | 教程、Docker |
| [Ubuntu / Debian 软件管理](../src/software-tools/systems-containers/linux/apt.md) | 包管理、指令速查 | 包管理、指令速查、Linux、APT |
| [Ubuntu 常用指令](../src/software-tools/systems-containers/linux/command.md) | 指令速查 | 指令速查、Linux、Ubuntu |
| [Git 常用指令](../src/software-tools/version-control/git/git-command-reference.md) | 指令速查 | 指令速查、Git |
| [Git 常见场景应用](../src/software-tools/version-control/git/git-common-workflows.md) | 教程 | 教程、Git |
| [Git 安装与 github ssh配置](../src/software-tools/version-control/git/git-installation-and-github-ssh.md) | 教程 | 教程、Git、GitHub、SSH |

## 新增链接

每条链接只包装原文已有文字。表中列出实际语境供复核；链接位置以机器记录中的原正文 UTF-8 字节偏移为准，不依赖随标签增补变化的行号。

| 来源文章 | 原有文字与上下文 | 目标文章 |
| --- | --- | --- |
| [门控循环神经网络 GRU](../src/ai-algorithms/learning/deep-learning/gru.md) | 保持比 LSTM 更简单的结构与更高的训练效率。 | [LSTM](../src/ai-algorithms/learning/deep-learning/lstm.md) |
| [强化学习概述](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/01-reinforcement-learning-overview.md) | 强化学习是机器学习的**第三范式** | [机器学习](../src/ai-algorithms/foundations/general/learning-algorithms-introduction.md) |
| [值迭代与策略迭代](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/04-value-and-policy-iteration.md) | 即对贝尔曼最优公式进行迭代求解 | [贝尔曼最优公式](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/03-bellman-optimality-equations.md) |
| [值迭代与策略迭代](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/04-value-and-policy-iteration.md) | 通过迭代法或矩阵计算法求贝尔曼公式 | [贝尔曼公式](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/02-bellman-equations.md) |
| [蒙特卡罗方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/05-monte-carlo-methods.md) | 通过修改前文的策略迭代算法得到 | [策略迭代算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/04-value-and-policy-iteration.md) |
| [蒙特卡罗方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/05-monte-carlo-methods.md) | 先求解贝尔曼方程得到状态值 | [贝尔曼方程](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/02-bellman-equations.md) |
| [时序差分方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/07-temporal-difference-methods.md) | TD算法与MC算法最大的不同在于它是增量式的。 | [MC算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/05-monte-carlo-methods.md) |
| [时序差分方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/07-temporal-difference-methods.md) | 相当于在没有模型的情况下求解贝尔曼公式 | [贝尔曼公式](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/02-bellman-equations.md) |
| [时序差分方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/07-temporal-difference-methods.md) | Sarsa 表示它是一个随机近似算法 | [随机近似算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/06-stochastic-approximation.md) |
| [值函数方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/08-value-function-methods.md) | 它对下一讲中的**策略梯度方法（policy gradient method）**也非常重要。 | [策略梯度方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/09-policy-gradient-methods.md) |
| [值函数方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/08-value-function-methods.md) | 使用值函数逼近的 **Sarsa 算法** | [Sarsa 算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/07-temporal-difference-methods.md) |
| [策略梯度算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/09-policy-gradient-methods.md) | 基于价值函数的方法转向策略函数方法 | [基于价值函数的方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/08-value-function-methods.md) |
| [策略梯度算法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/09-policy-gradient-methods.md) | 由**蒙特卡洛估计**获得，该算法有一个专属名字 | [**蒙特卡洛估计**](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/05-monte-carlo-methods.md) |
| [演员-评论家方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/10-actor-critic-methods.md) | Actor-critic 方法仍然属于策略梯度方法。 | [策略梯度方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/09-policy-gradient-methods.md) |
| [演员-评论家方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/10-actor-critic-methods.md) | 它们强调将策略梯度方法与价值函数方法相结合的结构。 | [价值函数方法](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/08-value-function-methods.md) |
| [学习驱动的 DE：从手写反馈到策略学习](../src/ai-algorithms/optimization/frontier-algorithms/de-series/learning-driven-de.md) | 通过策略梯度从一组优化问题的经验中训练控制器 | [策略梯度](../src/ai-algorithms/learning/reinforcement-learning/mathematical-principles/09-policy-gradient-methods.md) |
| [GitHub CLI（gh）：AI Agent 使用 GitHub 的命令行入口](../src/ai-applications/tools-practice/agent-clients/tools/gh.md) | 在使用 Codex、Claude Code、OpenHands 这类 AI Agent 工具时 | [Codex](../src/ai-applications/tools-practice/agent-clients/chatgpt-codex/codex-advanced-usage.md) |
| [MATLAB Agentic Toolkit：让 AI Agent 直接操作 MATLAB](../src/ai-applications/tools-practice/skills-mcp/matlab-agentic-toolkit.md) | 用于将 Codex、Claude Code、GitHub Copilot、Gemini CLI 等 AI 编程 Agent | [Codex](../src/ai-applications/tools-practice/agent-clients/chatgpt-codex/codex-advanced-usage.md) |
| [共识排列](../src/notes/mathematics/consensus-ranking.md) | 常用距离：Kendall tau 距离（交换次数）。 | [Kendall tau 距离](../src/notes/mathematics/kendall-tau.md) |
| [方差分析](../src/notes/mathematics/hypothesis-testing/anova.md) | p 值定义为在 $H_0$（均值相等）成立下： | [p 值](../src/notes/mathematics/hypothesis-testing/p-value.md) |
| [Friedman Test（弗里德曼检验）](../src/notes/mathematics/hypothesis-testing/friedman.md) | 适用于多算法比较（Wilcoxon 只能两两比较） | [Wilcoxon](../src/notes/mathematics/hypothesis-testing/wilcoxon-signed-rank.md) |
| [GUI框架 JavaFX](../src/notes/programming-languages/java/javafx.md) | 2. 使用maven | [maven](../src/notes/programming-languages/java/maven.md) |
| [conda 指令速查表](../src/notes/programming-languages/python/conda.md) | 主要用于 Python 和数据科学领域 | [Python](../src/notes/programming-languages/python/python.md) |
| [Jupyter notebook](../src/notes/programming-languages/python/jupyter-notebook.md) | 安装Jupyter Notebook的前提是需要安装了Python环境 | [Python](../src/notes/programming-languages/python/python.md) |
| [Pandas](../src/notes/programming-languages/python/pandas.md) | Pandas 是 Python 的第三方库 | [Python](../src/notes/programming-languages/python/python.md) |
| [概述](../src/notes/web-development/modules/overview.md) | 特点：同步加载，适用于 Node.js。 | [Node.js](../src/notes/web-development/nodejs.md) |
| [概述](../src/notes/web-development/modules/overview.md) | Babel：将 ES Modules 转换为兼容旧浏览器的代码。 | [ES Modules](../src/notes/web-development/modules/esm-specification.md) |
| [前端工具链概述](../src/notes/web-development/toolchains/overview.md) | 在 Node.js 开发中，工具链可提升代码质量 | [Node.js](../src/notes/web-development/nodejs.md) |
| [前端工具链概述](../src/notes/web-development/toolchains/overview.md) | - 包管理与依赖管理 | [包管理与依赖管理](../src/notes/web-development/package-managers/package-managers.md) |
| [前端工具链概述](../src/notes/web-development/toolchains/overview.md) | - 代码构建与打包 | [代码构建与打包](../src/notes/web-development/toolchains/build-and-bundling-tools.md) |
| [VSCode多语言环境配置](../src/software-tools/development-remote/vscode/multi-language-setup.md) | 写论文时需要 LaTeX 插件和编译环境 | [LaTeX](../src/software-tools/development-remote/vscode/latex-setup.md) |
| [Obsidian + Zotero + Codex：AI 辅助科研工作流](../src/software-tools/documentation-knowledge/paper-management/ai-research-workflow.md) | Zotero、Obsidian 和 Codex 分别解决三个不同问题 | [Zotero](../src/software-tools/documentation-knowledge/paper-management/zotero.md) |
| [Obsidian + Zotero + Codex：AI 辅助科研工作流](../src/software-tools/documentation-knowledge/paper-management/ai-research-workflow.md) | Zotero、Obsidian 和 Codex 分别解决三个不同问题 | [Obsidian](../src/software-tools/documentation-knowledge/paper-management/obsidian.md) |
| [Obsidian + Zotero + Codex：AI 辅助科研工作流](../src/software-tools/documentation-knowledge/paper-management/ai-research-workflow.md) | Zotero、Obsidian 和 Codex 分别解决三个不同问题 | [Codex](../src/ai-applications/tools-practice/agent-clients/chatgpt-codex/codex-advanced-usage.md) |
| [Zotero：论文管理与参考文献引用工具](../src/software-tools/documentation-knowledge/paper-management/zotero.md) | 它能与 Word、LaTeX 等深度集成 | [LaTeX](../src/software-tools/documentation-knowledge/latex/latex-basics.md) |

## 全站标签清单

覆盖本批次 264 篇文章的所有原始与现有标签；计数按文章出现次数计算。0 表示本批次规范化后不再使用的别名或此前不存在的新主题。

| 标签 | 整理前文章数 | 整理后文章数 |
| --- | ---: | ---: |
| 包管理 | 6 | 6 |
| 贝尔曼方程 | 2 | 2 |
| 笔记管理 | 1 | 1 |
| 编程工具 | 1 | 1 |
| 编辑器 | 1 | 1 |
| 并发编程 | 1 | 1 |
| 并行计算 | 1 | 1 |
| 不动点理论 | 0 | 1 |
| 采样方法 | 1 | 2 |
| 参数检验 | 2 | 2 |
| 参数设置 | 2 | 2 |
| 参数自适应 | 4 | 4 |
| 策略梯度 | 0 | 2 |
| 差分进化 | 21 | 21 |
| 代理 | 1 | 1 |
| 导论 | 11 | 11 |
| 电子音乐 | 1 | 1 |
| 动态规划 | 0 | 1 |
| 多目标优化 | 7 | 8 |
| 泛型 | 1 | 1 |
| 非参数检验 | 2 | 2 |
| 分布 | 1 | 1 |
| 分布估计算法 | 11 | 11 |
| 分布式车间调度 | 1 | 1 |
| 分类 | 1 | 1 |
| 概率论 | 1 | 3 |
| 构建与打包 | 1 | 2 |
| 归纳偏置 | 1 | 1 |
| 海克斯麻将 | 4 | 4 |
| 混合优化 | 2 | 2 |
| 混音 | 1 | 1 |
| 机器学习 | 2 | 5 |
| 基础语法 | 1 | 1 |
| 基准测试 | 1 | 1 |
| 假设检验 | 5 | 5 |
| 监督学习 | 1 | 1 |
| 教程 | 8 | 8 |
| 进化策略 | 9 | 9 |
| 进化算法 | 4 | 4 |
| 进阶 | 1 | 1 |
| 卡牌资料 | 2 | 2 |
| 开源工具 | 1 | 1 |
| 科普 | 1 | 1 |
| 科研工具 | 3 | 3 |
| 科研工作流 | 1 | 1 |
| 库 | 4 | 4 |
| 框架 | 1 | 1 |
| 类型提示 | 0 | 1 |
| 理论 | 1 | 1 |
| 粒子群优化 | 11 | 11 |
| 领域适应 | 1 | 1 |
| 领域梳理 | 1 | 1 |
| 论文复现 | 1 | 1 |
| 论文管理 | 1 | 1 |
| 蒙特卡罗方法 | 0 | 1 |
| 命令行 | 1 | 1 |
| 命令行工具 | 2 | 2 |
| 模板 | 3 | 3 |
| 模型供应商 | 1 | 1 |
| 排版 | 1 | 1 |
| 排序距离 | 0 | 1 |
| 排序聚合 | 0 | 1 |
| 排序算法 | 1 | 1 |
| 配置 | 1 | 1 |
| 评价指标 | 1 | 1 |
| 启动 U 盘 | 2 | 2 |
| 迁移学习 | 0 | 1 |
| 强化学习 | 1 | 12 |
| 群智能 | 9 | 9 |
| 人工免疫系统 | 6 | 6 |
| 入门 | 1 | 1 |
| 软件卸载 | 1 | 1 |
| 深度学习 | 0 | 4 |
| 时频分析 | 1 | 1 |
| 时序差分 | 0 | 1 |
| 数学建模 | 4 | 5 |
| 数值分析 | 0 | 3 |
| 算法 | 16 | 16 |
| 算法比较 | 1 | 1 |
| 算子 | 3 | 3 |
| 随笔 | 12 | 12 |
| 随机变量 | 1 | 1 |
| 随机近似 | 0 | 1 |
| 随机优化 | 11 | 11 |
| 特征提取 | 1 | 1 |
| 田口方法 | 1 | 1 |
| 统计推断 | 0 | 1 |
| 网络编程 | 1 | 1 |
| 网络结构 | 3 | 3 |
| 微调 | 1 | 1 |
| 文档处理 | 1 | 1 |
| 文档转换 | 1 | 1 |
| 文献管理 | 1 | 1 |
| 文献阅读 | 2 | 2 |
| 问题 | 1 | 1 |
| 无参数学习 | 1 | 1 |
| 物理启发优化 | 5 | 5 |
| 系统安装 | 2 | 2 |
| 响应面法 | 1 | 1 |
| 消融实验 | 1 | 1 |
| 小波分析 | 1 | 1 |
| 小生境遗传算法 | 11 | 11 |
| 新颖性搜索 | 6 | 6 |
| 信号处理 | 1 | 1 |
| 选择压力 | 1 | 1 |
| 学习增强优化 | 1 | 1 |
| 循环神经网络 | 0 | 2 |
| 遗传规划 | 12 | 12 |
| 遗传算法 | 13 | 13 |
| 蚁群优化 | 8 | 8 |
| 优化理论 | 0 | 1 |
| 预训练 | 1 | 1 |
| 远程桌面 | 1 | 1 |
| 知识管理 | 1 | 1 |
| 知识库 | 1 | 1 |
| 值函数逼近 | 0 | 1 |
| 指令速查 | 6 | 6 |
| 智能体 | 2 | 0 |
| 智能优化 | 0 | 5 |
| 种群规模控制 | 2 | 2 |
| 桌游规则 | 2 | 2 |
| 综述 | 1 | 1 |
| 总结 | 1 | 1 |
| 最优控制 | 1 | 1 |
| Actor-Critic | 0 | 1 |
| Agent Skills | 2 | 2 |
| AGENTS.md | 1 | 1 |
| AI 辅助科研 | 1 | 1 |
| AI Agent | 5 | 7 |
| APT | 0 | 1 |
| CC Switch | 1 | 1 |
| CEC | 2 | 2 |
| CMD | 1 | 1 |
| Codex | 5 | 5 |
| Conda | 0 | 1 |
| CSS | 1 | 1 |
| CWT | 1 | 1 |
| dataclass | 0 | 1 |
| DeepSeek | 1 | 1 |
| Docker | 0 | 2 |
| DWT | 1 | 1 |
| ES Modules | 1 | 2 |
| gh | 1 | 0 |
| Git | 0 | 3 |
| GitHub | 3 | 4 |
| GitHub CLI | 1 | 1 |
| HTML | 1 | 1 |
| IO | 1 | 1 |
| Java | 5 | 7 |
| JavaFX | 0 | 1 |
| JavaScript | 2 | 3 |
| Jupyter Notebook | 0 | 1 |
| LaTeX | 1 | 4 |
| LibreOffice | 1 | 1 |
| Linux | 3 | 5 |
| LLM | 1 | 1 |
| Markdown | 1 | 1 |
| MATLAB | 2 | 2 |
| Maven | 0 | 1 |
| MCP | 2 | 2 |
| Nano | 1 | 1 |
| Node.js | 1 | 2 |
| Obsidian | 2 | 2 |
| pandas | 0 | 1 |
| PowerShell | 1 | 1 |
| Python | 2 | 7 |
| PyTorch | 0 | 1 |
| RDP | 1 | 1 |
| ripgrep | 1 | 1 |
| SSH | 1 | 2 |
| Tailscale | 1 | 1 |
| TypeScript | 1 | 1 |
| Ubuntu | 1 | 2 |
| Vim | 1 | 1 |
| VS Code | 0 | 3 |
| Vue | 1 | 1 |
| WebSocket | 1 | 1 |
| Windows | 3 | 3 |
| Zotero | 2 | 2 |

## 正文保护验证

从仓库根目录执行：

```powershell
node scripts/check-knowledge-graph-content.mjs
```

验证器按记录逐个撤销新增链接包装，还原原始 `tag` 块，检查重建后的整文件 SHA-256 与任务开始时基线完全一致；同时独立检查正文及非标签 Frontmatter 校验值。264 篇文章均通过，35 条新增链接的本地目标全部存在。由此覆盖原有文字、段落、公式、代码、图片、旧链接、空白、BOM 和混合换行格式的保护。

验证器还使用 VuePress 的 Markdown 解析器比较撤销链接前后的文本结果，检查新增方括号是否改变粗体等相邻标记的解析。23 篇补链文章全部通过。中文粗体标签整体置于链接标签内，使原有强调效果保留。

这是一次整理批次的冻结审计，不是禁止日后正常修改文章的规则。以后若有正文编辑，校验器会如实报告其与本批次不同；应单独保存新编辑的验证依据，不将新正文改动误判成本批次补链造成的变化。完整构建、路由及浏览器交互检查由本次功能集成验收负责。
