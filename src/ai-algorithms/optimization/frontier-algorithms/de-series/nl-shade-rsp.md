---
title: NL-SHADE-RSP：非线性缩群与档案利用
icon: arrows-left-right
date: 2026-09-19
order: 7
category:
  - 智能优化算法
tag:
  - 差分进化
  - 种群规模控制
---

# NL-SHADE-RSP：非线性缩群与档案利用

线性缩群把种群规模与已用预算直接关联，但这条直线未必适合整个搜索过程。Stanovov、Akhmedova 与 Semenkin 的 NL-SHADE-RSP（2021）在 [LSHADE-RSP](./lshade-rsp.md) 路线上进一步调整种群调度、排名选择和档案使用。

## 非线性缩群改变了什么

记 $t=FE/FE_{\max}$。后续 NL-SHADE-RSP-Midpoint 原论文在介绍基底时给出的缩群规则为

$$
N_{next}=\left\lfloor N_{init}+(N_{min}-N_{init})t^{1-t}\right\rfloor.
$$

这里 $N_{init}>N_{min}$。对 $0<t<1$，有 $t^{1-t}>t$，所以在相同端点下，这条曲线对应的种群规模不大于线性曲线。不能仅凭“非线性”一词把它描述成前期始终保留更多个体。

以 $N_{init}=100,N_{min}=4$ 为示例，忽略代际更新时点的差异：

| $t$ | 线性目标规模，四舍五入 | 非线性目标规模，向下取整 |
| --- | --- | --- |
| 0.25 | 76 | 66 |
| 0.50 | 52 | 32 |
| 0.75 | 28 | 10 |

数字是由公式计算的示意值，并非论文所用初始化参数。它说明同样消耗一半预算时，两种方法可处于明显不同的种群规模与更新频率。

## 不只是换一条曲线

NL-SHADE-RSP 还改变了排名选择的作用范围，并自适应调整档案的使用概率。NL-SHADE-RSP-Midpoint 的基底说明明确指出，RSP 改为作用于 $r_2$；这与前序方法对多个供体使用排名权重不同。

应把三个问题分开：

- **种群调度**：还有多少个体继续搜索？
- **来源选择**：差分供体来自当前种群，还是历史档案？
- **来源内抽样**：在选定来源后，哪些个体更容易被抽到？

只调整档案容量，并不等同于调整档案使用概率。本篇聚焦上述结构与缩群曲线；档案概率的完整更新及常数应对照 2021 年参赛源码，不用另一版本的公式替代。

## 为什么需要区分 Midpoint 版本

2022 年的 NL-SHADE-RSP-Midpoint 是独立的后续改进，加入中点评价、重启等机制。它不能作为 2021 年基线的同名实现使用。额外评价点会消耗预算；改变边界修复或初始种群规模也会改变轨迹。

因此，下载代码时需要同时记录算法名、论文年份与代码来源。官方竞赛仓库提供论文和方法代码包，可以作为版本核对入口；本文未运行其中的完整实验。

## 如何理解它在发展线中的位置

从设计层面看，研究重点已从单个 $F$ 或 $CR$ 转向几个反馈与资源机制的配合。非线性曲线本身仍由预算进度驱动；若要让控制直接响应搜索难度，还需要观察成功率等运行信号。[L-SRTDE](./l-srtde.md) 提供了另一条值得对照的路线，但二者不是简单的前后替换关系。

## 参考资料

- Stanovov, V.; Akhmedova, S.; Semenkin, E. (2021). [NL-SHADE-RSP Algorithm with Adaptive Archive and Selective Pressure for CEC 2021 Numerical Optimization](https://doi.org/10.1109/CEC45853.2021.9504959)，原始文献入口。
- [CEC 2021 单目标有界优化官方资料仓库](https://github.com/P-N-Suganthan/2021-SO-BCO)：论文与参赛代码包。
- Biedrzycki, R.; Arabas, J.; Warchulski, E. (2022). [A Version of NL-SHADE-RSP Algorithm with Midpoint for CEC 2022 Single Objective Bound Constrained Problems](https://staff.elka.pw.edu.pl/~rbiedrzy/publ/nl_shade_midpoint.pdf)，本文使用其第 II 节核对基底机制。
