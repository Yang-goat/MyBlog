---
title: DE 系列：从差分变异到学习驱动
icon: arrows-left-right
index: false
article: false
dir:
  link: true
  expanded: true
  order: 2
---

差分进化（Differential Evolution，DE）利用种群个体之间的差分构造搜索步长，其发展重点逐渐从变异算子转向参数反馈、种群资源分配和学习控制。

## 发展脉络

本系列按 **DE → JADE → SHADE → L-SHADE → jSO / LSHADE-RSP → NL-SHADE-RSP → L-SRTDE / RDE → RDEx-SOP → 学习驱动的 DE** 的顺序阅读。它是一条理解机制的路线，不是所有算法依次继承的族谱，也不是性能排名。

| 阶段 | 代表工作 | 核心问题与变化 |
| --- | --- | --- |
| 差分搜索 | DE，1990 年代，经典期刊论文发表于 1997 年 | 用个体差分生成扰动，通过交叉与一对一选择推进搜索 |
| 在线参数适应 | JADE，2009 | 引入精英集合引导、外部档案，并从成功参数更新采样中心 |
| 多槽历史记忆 | SHADE，2013 | 保留多个历史参数中心，减少单一中心对近期反馈的依赖 |
| 预算分配 | L-SHADE，2014 | 随评价预算消耗线性缩小种群 |
| 搜索压力细化 | jSO，2017；LSHADE-RSP，2018 | 分别强调阶段性引导权重与按适应度排名抽取差分个体 |
| 非线性调度 | NL-SHADE-RSP，2021 | 联合调整种群缩减、档案使用及选择压力 |
| 反馈与组合 | L-SRTDE；RDE，均为 2024 年工作 | 前者突出成功率反馈，后者重新组合已有有效策略 |
| 反馈机制融合 | RDEx-SOP，CEC 2025 方法，报告公开于 2026 年 | 组合成功率反馈与偏开发分支，关注固定预算下的速度和精度 |
| 学习控制 | DE-DDQN、LDE 等 | 从优化轨迹学习算子或参数控制策略；这条研究线早于 2024 年已存在 |

JADE—SHADE—L-SHADE 是清晰的继承主线。jSO 通过 iL-SHADE 承接这条路线；LSHADE-RSP 与 NL-SHADE-RSP 重点研究排名选择及调度。L-SRTDE 还涉及 L-NTADE 的种群组织思路；RDE 则汇集多个分支的策略，因此不能把后二者简单写成 NL-SHADE-RSP 的连续升级。

## 怎样读这组文章

每篇围绕“上一阶段留下什么问题、本文改了哪一层、为什么可能有效、什么情况下会失效”展开。经典 DE 篇只建立后续需要的统一记号；更细的基础算子见[差分进化算法家族](../../fundamentals/differential-evolution/)。

默认问题是有边界的连续单目标最小化：$\min_{\mathbf{x}\in[\mathbf{l},\mathbf{u}]}f(\mathbf{x})$。$D$ 为维数，$N$ 为种群规模，$F$ 为缩放因子，$CR$ 为交叉率，$FE$ 为已用真实目标函数评价次数，$FE_{\max}$ 为评价上限。约束、多目标、噪声和昂贵仿真需要另行设计评价与选择规则。

比较算法时应统一问题、维数、边界处理、评价预算和重复运行方案。缩减种群后“一代”的成本会变化，因此不能仅比较迭代代数。本文系列为机制笔记与推导示例，未提供本地复现成绩，也不把论文中的局部优势推广成普遍优越性。

## 系列文章

<Catalog />

## 资料入口

- [Tanabe 的论文与 SHADE / L-SHADE 作者实现](https://ryojitanabe.github.io/publication)：主线论文、版本及代码修正说明。
- [jSO 原论文](https://labraj.feri.um.si/wp-content/uploads/janez/CEC2017-jSO.pdf)。
- [L-SRTDE 作者仓库](https://github.com/VladimirStanovov/L-SRTDE_CEC-2024)与 [RDE 原论文](https://arxiv.org/abs/2404.16280)。
- [LDE 原论文](https://arxiv.org/abs/2102.03572)：学习参数控制的代表性分支。
- [RDEx-SOP 报告](https://arxiv.org/abs/2603.27089)：后续组合设计与评测口径。
