---
title: DE：差分搜索的基本骨架
icon: arrows-left-right
date: 2026-09-19
order: 1
category:
  - 智能优化算法
tag:
  - 差分进化
---

# DE：差分搜索的基本骨架

差分进化（Differential Evolution，DE）的出发点是：不计算梯度，而用种群中已有解的位置差构造新候选解。Storn 与 Price 的 1997 年经典论文给出了这一连续优化方法。本篇建立后续自适应 DE 共用的记号；基础变体的细节可参见 [DE/rand/1/bin](../../fundamentals/differential-evolution/de-rand-1-bin.md)。

## 一个候选解怎样产生

考虑 $D$ 维最小化问题，第 $g$ 代种群为 $P_g=\{\mathbf{x}_{i,g}\}_{i=1}^{N}$。以 DE/rand/1/bin 为例，从不含目标个体 $i$ 的种群中抽取互异的 $r_1,r_2,r_3$：

$$
\mathbf{v}_{i,g}=\mathbf{x}_{r_1,g}+F(\mathbf{x}_{r_2,g}-\mathbf{x}_{r_3,g}).
$$

$\mathbf{v}_{i,g}$ 是变异向量，$F>0$ 控制差分的缩放。随后对每个坐标独立交叉：

$$
u_{i,j,g}=\begin{cases}
v_{i,j,g},&q_j\le CR\ \text{或}\ j=j_{\mathrm{rand}},\\
x_{i,j,g},&\text{其他情况},
\end{cases}
$$

其中 $q_j\sim U(0,1)$，$CR\in[0,1]$，$j_{\mathrm{rand}}$ 从 $1,\ldots,D$ 均匀抽取，保证至少一个坐标来自变异向量。修复越界坐标并评价后，只比较试验向量与自己的父代：

$$
\mathbf{x}_{i,g+1}=\begin{cases}
\mathbf{u}_{i,g},&f(\mathbf{u}_{i,g})\le f(\mathbf{x}_{i,g}),\\
\mathbf{x}_{i,g},&\text{其他情况}.
\end{cases}
$$

这不是把全部父子代混合后选前 $N$ 个。若生成全部子代时使用固定的 $P_g$，就是本文讨论的代际更新；立即把成功子代供后续个体使用，会改变搜索过程。

## 一个二维例子

以下数字仅用于解释运算。取三个供体为 $(2,1)$、$(4,3)$、$(1,2)$，$F=0.5$，则差分为 $(3,1)$，变异向量为 $(3.5,1.5)$。若父代为 $(3,4)$，交叉只采用第一个变异坐标，试验向量就是 $(3.5,4)$。

对球函数 $f(\mathbf{x})=x_1^2+x_2^2$，父代值为 $25$，试验值为 $28.25$，这次试验被拒绝。**产生了不同的解，不等于取得改进**；差分向量也不是目标函数的下降梯度。

## 为什么种群状态很重要

从变异式可直接看出：供体彼此越接近，差分越短。即使保持同一个 $F$，后期实际步长也可能很小。反过来，较大的差分配上较大的 $F$ 可能频繁越界，修复规则就会显著影响真正接受评价的点。

由此可以分开观察三件事：种群是否还有空间多样性、参数是否允许合适的步长、交叉是否保留了有用的变量组合。仅画最优目标值曲线无法区分这些原因。

## 从固定配置走向自适应

| 控制量 | 影响 | 固定设置的困难 |
| --- | --- | --- |
| $F$ | 差分步长 | 同一尺度未必适合所有搜索阶段 |
| $CR$ | 被替换坐标的比例 | 变量耦合不同，合适的组合粒度不同 |
| $N$ | 差分来源与每代评价成本 | 多样性与预算之间存在取舍 |
| 供体选择 | 搜索方向分布 | 过度集中与过度分散都可能低效 |

后续 [JADE](./jade.md) 从成功试验中反馈参数，并让优秀个体和历史档案参与供体构造。其问题意识可以概括为：保留 DE 的骨架，同时减少固定配置对人工经验的依赖。

## 参考资料

- Storn, R.; Price, K. (1997). [Differential Evolution – A Simple and Efficient Heuristic for Global Optimization over Continuous Spaces](https://doi.org/10.1023/A:1008202821328).
- Tanabe, R.; Fukunaga, A. (2013). [Success-History Based Parameter Adaptation for Differential Evolution](https://metahack.org/CEC2013-SHADE.pdf)，第 II 节给出 DE 的统一形式。
