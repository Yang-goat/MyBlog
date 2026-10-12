---
redirectFrom:
  - "/software-tools/open-source-projects/scientific-agent-skills.html"
title: Scientific Agent Skills：覆盖科研全流程的 AI 技能库
icon: flask
date: 2026-10-11
category:
  - AI 实践
tag:
  - GitHub
  - Agent Skills
  - 科研工具
  - 学术写作
---

# Scientific Agent Skills：覆盖科研全流程的 AI 技能库

让 AI 帮忙做科研，任务往往从“找几篇论文”开始，随后变成整理研究问题、设计实验、分析数据、画图和写稿。每换一个环节，都要重新说明工作方法与输出要求；如果前面的依据没有传下去，后面的文字很容易脱离实际材料。

[Scientific Agent Skills](https://github.com/K-Dense-AI/scientific-agent-skills) 是 K-Dense-AI 维护的科研技能库。它把这些环节整理成可供 AI 智能体读取的 Skills，**从文献检索到论文审阅和学术汇报，都能找到对应的工作流程**。对经常使用 AI 辅助科研的读者，它值得作为一套按需选用的方法库收藏。

本文于 2026 年 10 月 11 日核对官方 README 与下文涉及的技能文件。当前 README 标注版本为 **2.72.0，包含 177 个技能**。这里介绍的是仓库提供的流程与用法；本文未安装整套技能，也未运行示例实验。

## “科研全流程”具体包括什么

一个技能通常以 `skills/<技能名>/SKILL.md` 为入口，写清适用任务、操作顺序和依赖条件，部分还带有参考文档、脚本与模板。AI 使用技能时，会据此组织工作；需要查询数据库、执行分析或导出文件的步骤，仍依赖宿主工具与实际环境。

可以先按课题所处阶段挑选技能：

| 科研环节 | 对应技能 | 希望得到的材料 |
| --- | --- | --- |
| 查找与整理文献 | `paper-lookup`、`literature-review` | 可追溯的检索记录、文献表、已有证据与缺口 |
| 构思问题与提出假设 | `scientific-brainstorming`、`hypothesis-generation` | 候选方向、备选解释、可检验预测 |
| 设计实验与规划样本量 | `experimental-design`、`statistical-power` | 对照与分组方案、重复单位、样本量依据 |
| 检查数据 | `exploratory-data-analysis` | 字段与缺失情况、异常线索、质量检查报告 |
| 统计分析 | `statistical-analysis` | 与设计匹配的分析、效应估计及不确定性 |
| 绘制科研图表 | `scientific-visualization` | 有单位和误差定义的图、绘图代码与导出文件 |
| 撰写论文 | `scientific-writing` | 与证据对应的草稿、引用与一致性检查 |
| 审阅与修改 | `peer-review` | 有位置、依据和修改建议的审阅草稿 |
| 学术汇报 | `scientific-slides` | 报告结构、幻灯片与讲述安排 |

仓库还包含许多领域工具技能，例如生物信息、化学、机器学习、材料和地理空间分析。方法类技能可以跨领域参考，具体软件与数据库则要按学科选择。流程覆盖广，并不意味着它能独立完成所有研究判断。

## 每个环节怎样提问、怎样指定技能

下面用一个假设课题贯穿示例：**比较传感器校准方法 A 与 B 在不同温度下的测量误差**。文件名均为示例，需换成自己的真实材料；其中的条件是任务设定，不是实测结果。

每节先给普通提问，再给显式指定技能的提示词。技能已安装且被宿主发现后，可以直接在对话中写“使用某某技能”；这是一种自然语言调用方式，不是通用终端命令，也不保证所有客户端都有同名斜杠命令。提交任务后，可让 AI 说明实际读取了哪个技能、执行了哪些步骤。

### 1. 文献检索与综述：先留下可核对的来源

[paper-lookup](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/paper-lookup/SKILL.md) 面向论文与标识符检索；[literature-review](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/literature-review/SKILL.md) 进一步组织筛选、证据提取与综合。找到了论文标题，还需要确认原文是否支持准备使用的论点。

普通提问：“有哪些研究比较了温度变化下的传感器校准方法？它们怎样设计对照实验？”

```text
使用 paper-lookup 技能，检索 2020—2026 年关于传感器温度漂移与校准方法比较的论文。
先给出检索词与数据库选择理由，再返回标题、年份、DOI 或 arXiv ID、来源链接和检索日期。
区分期刊论文与预印本，说明哪些只有摘要、哪些取得了全文。

随后使用 literature-review 技能，按已取得的材料整理：
校准方法、传感器类型、温度范围、对照设置、评价指标和主要限制。
把无法从原文确认的项目标为“待核实”，保留筛选依据，输出 literature-notes.md。
```

这种限定范围的整理适合课题起步。若要做正式系统综述，还要制定检索协议、纳入排除标准并核对筛选数量，不能把一份搜索结果直接称为系统综述。

### 2. 研究构思与假设：写出怎样检验自己的解释

[scientific-brainstorming](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/scientific-brainstorming/SKILL.md) 用于提出与讨论候选方向；[hypothesis-generation](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/hypothesis-generation/SKILL.md) 将观察转化为假设、备选解释和可检验预测。

普通提问：“如果方法 B 在高温下误差更小，可以从哪些角度解释？怎么判断解释是否成立？”

```text
使用 scientific-brainstorming 技能，依据 literature-notes.md 提出值得研究的问题。
逐项区分已有证据、暂定假设和需要补充的材料，说明可行性与主要分歧。
不要仅凭检索中没找到相同工作就声称有创新性。

再使用 hypothesis-generation 技能，把我选定的问题写成可检验假设。
列出温度补偿机制、训练数据覆盖和传感器个体差异等备选解释，
为各解释提出能区分它们的观测或对照，并写出什么结果会削弱该假设。
保存为 research-question.md。
```

这里的交付物是研究计划。即使解释听起来合理，也要等待实验与分析来检验。

### 3. 实验设计与样本量：先确定什么算一次独立重复

[experimental-design](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/experimental-design/SKILL.md) 处理分组、随机化、区组与重复结构；[statistical-power](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/statistical-power/SKILL.md) 根据设计和假设规划样本量或统计功效。

普通提问：“我要在多个温度下比较 A、B，同一台传感器会测很多次，实验怎么安排？需要多少台传感器？”

```text
使用 experimental-design 技能，依据 research-question.md 设计 A、B 的比较实验。
同一台传感器在多个温度下重复测量，请区分传感器个体与重复读数，
说明配对、测量顺序、批次与温度的处理方式，以及可能的混杂因素。
先输出方案，不启动采集或实验。

使用 statistical-power 技能，检查上述设计所需的样本量信息。
若缺少最小有意义差异、变异估计或重复测量相关性，先列出缺口。
在假设有依据后，对不同假设值做样本量敏感性分析，记录计算方法。
输出 experiment-plan.md，供我审核。
```

先确定独立实验单位，才能讨论样本量。同一台设备的很多次读数，不能直接当作很多台独立设备。

### 4. 数据检查：先了解文件，再决定是否处理异常

[exploratory-data-analysis](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/exploratory-data-analysis/SKILL.md) 提供有范围限制的本地探索性检查，覆盖表格数据概况、缺失与数据泄漏等问题；具体格式支持需查看技能说明。

普通提问：“这份实验 CSV 能直接分析吗？是否有缺失、重复记录或不合理的值？”

```text
使用 exploratory-data-analysis 技能，仅检查我指定的 data/calibration.csv。
字段包括 sensor_id、method、temperature、batch、reference_value、measured_value。
核对字段类型、单位说明、缺失比例、重复记录，以及每台传感器的条件覆盖情况。
检查后续训练与测试划分是否可能包含同一传感器，造成数据泄漏。
输出汇总报告 data-audit.md；不覆盖原始文件，不自动删除异常值或填补缺失。
若只读取了部分记录，明确报告检查范围。
```

报告中的异常线索需要回到采集记录核实。探索性检查也不能直接证明校准方法存在优势。

### 5. 统计分析：让分析方法对应实验结构

[statistical-analysis](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/statistical-analysis/SKILL.md) 指导方法选择、假设检查、效应量与结果报告。使用时应同时提供实验方案和数据说明，避免只根据表格列名挑检验。

普通提问：“A、B 的误差是否有差别？差别随温度变化吗？”

```text
使用 statistical-analysis 技能，结合 experiment-plan.md、data-audit.md 和实验数据分析。
以预先确定的主要指标比较 A、B，并处理传感器内重复测量与批次结构。
先说明目标量、分析单位、候选模型及其条件，再执行与方案一致的分析。
报告差异估计、95% 置信区间、效应量、诊断和必要的多重比较处理。
区分预设分析与探索性分析；若结果不显著，不直接写成“两种方法等效”。
保存分析代码、环境信息和结果表，缺少输入时停在方案说明阶段。
```

### 6. 科研绘图：让读者看见差异与不确定性

[scientific-visualization](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/scientific-visualization/SKILL.md) 涉及图形选择、多面板布局、误差表达与导出检查。实际数值图应来自数据或分析结果，保留生成代码。

普通提问：“怎样把不同温度下的 A、B 误差画清楚，同时显示个体差异？”

```text
使用 scientific-visualization 技能，依据已核对的结果表绘制误差随温度变化的图。
展示传感器个体数据与汇总估计，标明单位、独立样本数和区间的具体含义。
用颜色之外的标记区分 A、B；不补造缺失点，不改变分析中确定的汇总方式。
输出绘图代码、SVG 与 PNG，并检查坐标、图例、文字截断及正文数值的一致性。
暂未确定投稿期刊，按通用科研图制作，不声称已满足某期刊规范。
```

### 7. 论文写作：把已有证据组织成正文

[scientific-writing](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/scientific-writing/SKILL.md) 强调事实来源、论点与证据对应，以及方法、结果和图表的一致性。它适合在材料已经整理后起草或审查论文段落。

普通提问：“帮我把实验方案和结果整理成论文的方法、结果与讨论部分。”

```text
使用 scientific-writing 技能，依据已审核的实验方案、分析代码、结果表和文献笔记，
先列出“论点—证据—图表或来源位置”对应表，再起草方法、结果和讨论。
保持方法与实际执行一致，区分观测结果、解释与尚未验证的机制。
不补写未知的实验条件、数值、引用或审批信息；缺项明确标为待补充。
保留统计不确定性与适用范围，输出 manuscript-draft.md 和一致性检查记录。
```

科学内容核对完成后，还可以参考本站的 [Humanizer 介绍](./humanizer.md)，做一次局部文风校对。此时要保留术语、引用、数据与结论范围，避免语言润色改动研究含义。

### 8. 审阅与修改：给出能落实的意见

[peer-review](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/peer-review/SKILL.md) 支持有证据边界的稿件评估和修改计划，可检查方法、统计、图表、引用与可复现信息。下面以自己的论文草稿自查为例；正式受托审稿还需遵守期刊的保密与 AI 使用政策。

普通提问：“这篇草稿有哪些结论写得过强？实验描述是否足以让别人复现？”

```text
使用 peer-review 技能审阅我自己的 manuscript-draft.md 及配套结果表。
重点检查核心结论是否有证据支持、重复测量处理、图文数值和复现说明。
每条意见列出正文位置、观察到的问题、对应依据、影响和具体修改建议。
缺少材料时写“当前无法判断”，不要虚构复现实验或替编辑作录用决定。
输出审阅草稿与修改优先级，供我逐项核对。
```

### 9. 学术汇报：围绕研究问题安排讲述

[scientific-slides](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/skills/scientific-slides/SKILL.md) 覆盖科研报告、会议展示与答辩的结构、时间安排和视觉检查。

普通提问：“把这项研究整理成一场 10 分钟的组会报告，哪些图和结果最该讲？”

```text
使用 scientific-slides 技能，依据已核对的论文草稿与现有图表准备 10 分钟组会报告。
先给每页主题、对应证据、建议讲述时间与讲者备注，再制作幻灯片。
突出研究问题、对照设计、主要结果与局限，不添加不存在的结果或装饰性数据图。
仅使用现有素材与本地制作工具；若依赖不齐，先交付大纲，说明尚未生成的文件。
若完成导出，逐页渲染检查文字溢出、图表清晰度与引用。
```

## 安装与使用时需要知道的事

官方 README 提供了基于 `skills` 安装器的入口。需要已有 Node.js 和支持 Agent Skills 的客户端；Windows PowerShell 可写为：

```powershell
npx.cmd skills add K-Dense-AI/scientific-agent-skills
```

这是官方命令的 Windows 写法，本文未执行安装。安装时按自己的课题选用技能，并在客户端确认技能已被发现；不同宿主的安装目录与发现方式可能不同。安装后的第一项任务可以是：“请读取 literature-review 技能，说明它的适用范围和依赖，暂不检索文献。”这样能先确认读取是否成功。

技能文件与执行环境要分别准备。统计与绘图可能需要 Python 包，数据库查询可能需要网络或凭据，幻灯片导出可能需要 Node.js、LibreOffice 或 TeX。按具体技能的兼容性说明配置环境，避免把全部科学计算依赖装进同一个项目。仓库在 2.72.0 中已移除随附的 `docx`、`pdf`、`pptx`、`xlsx` 四个文档技能，不能按旧教程假定它们仍包含在内。

对刚开始使用的人，可以先选文献、实验设计、统计和写作等方法类技能。领域数据库或软件技能等任务明确后再补充。保留技能版本、输入材料与实际运行记录，后续才能判断结果来自哪套流程。

这套库最适合把科研任务拆成有材料、有依据、有交付物的步骤。研究者仍需核对来源与计算，决定设计是否合理，并对最终结论负责；技能库提供的流程和测试范围，也不能替代自己课题中的验证。

## 参考资料

- [Scientific Agent Skills 官方仓库与 README](https://github.com/K-Dense-AI/scientific-agent-skills)：项目范围、版本、安装与依赖说明。
- 正文各环节链接至对应的官方 `SKILL.md`，技能名称、适用任务与示例约束据这些文件整理；提问示例为本文编写。
