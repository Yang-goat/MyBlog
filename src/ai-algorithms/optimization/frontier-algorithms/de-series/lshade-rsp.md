---
title: LSHADE-RSP：让排名参与差分供体选择
icon: arrows-left-right
date: 2026-09-19
order: 6
category:
  - 智能优化算法
tag:
  - 差分进化
  - 选择压力
---

# LSHADE-RSP：让排名参与差分供体选择

[jSO](./jso.md) 通过权重调节精英引导强度。另一种控制搜索偏向的方法，是改变差分供体的抽样概率。Stanovov、Akhmedova 与 Semenkin 在 2018 年提出的 LSHADE-RSP，将基于排名的选择压力（Rank-based Selective Pressure，RSP）引入 L-SHADE 路线。

## 供体均匀抽样意味着什么

在 current-to-pbest 变异中，精英向量已经偏向优秀解，但差分项中的其他个体仍可能均匀抽样。RSP 进一步让优秀个体更容易成为差分供体。它改变的是“候选向量如何产生”，并非用概率接受较差子代。

设按目标值从小到大排序后的名次为 $i=1,\ldots,N$，一种对应的排名权重写法为

$$
R_i=1+k_r(N-i),\qquad
P_i=\frac{R_i}{\sum_{j=1}^{N}R_j},\qquad k_r\ge0.
$$

排名越靠前，权重越大；$k_r=0$ 时退化为均匀抽样。此式和 RSP 在供体位置上的作用，可在 RDE 原论文第 II-B4 节对前序方法的说明中核对。具体变体还要区分从当前种群抽样和从档案抽样，不能把同一概率规则无条件套到所有来源。

## 四个个体的例子

令 $N=4,k_r=1$，四个名次的权重为 $(4,3,2,1)$，抽样概率为 $(0.4,0.3,0.2,0.1)$。均匀抽样时每个个体都是 $0.25$；引入排名后，较优供体更常出现，但较差供体仍有机会被抽中。

该例也说明“选前若干名”和“全体按排名加权”并不相同。前者可使集合外概率直接变为零，后者仍保留尾部概率。实现时，还必须在合法供体集合内满足索引互异要求，处理重抽样对最终概率的影响。

## 排名与原始目标值的区别

如果对目标函数作严格单调变换，名次不变，那么这部分抽样权重也不变。这是排名机制本身的性质，不代表整个算法都不受变换影响：成功历史更新仍可能使用目标值的改进幅度。

排名还丢弃了“好多少”的信息。目标值为 $(1,2,3,4)$ 与 $(1,2,3,10^6)$ 时，四个个体的排名权重相同。因此 RSP 在尺度上较稳定，但并没有利用最后一个个体异常差这一幅度信息。

## 更强选择压力的两面性

从机制推断，当优秀个体位于有价值的区域时，偏向它们可以减少低效试验；当优秀个体聚集在同一局部盆地时，过度偏向又可能减少差分方向的多样性。排名选择、精英集合大小、变异权重和种群缩减应一起看，而不是分别把每个参数都调得更贪婪。

若设计消融，至少区分“仅对子项供体使用 RSP”和“同时修改精英选择”。记录抽样名次分布、成功率及多样性，能帮助判断算法到底改变了什么。本文没有给出这些实验的实测结果。

后续 [NL-SHADE-RSP](./nl-shade-rsp.md) 不只把线性缩群替换成非线性曲线，也调整了 RSP 的使用位置与档案利用。

## 参考资料

- Stanovov, V.; Akhmedova, S.; Semenkin, E. (2018). *LSHADE Algorithm with Rank-Based Selective Pressure Strategy for Solving CEC 2017 Benchmark Problems*，原始工作的题名与机制可由下列公开论文参考文献及正文交叉核对。
- Tao, S.; Zhao, R.; Wang, K.; Gao, S. (2024). [RDE 原论文，第 II-B4 节](https://arxiv.org/html/2404.16280v1)：给出 RSP 公式并说明其扩展位置。
- Biedrzycki, R.; Arabas, J.; Warchulski, E. (2022). [A Version of NL-SHADE-RSP Algorithm with Midpoint](https://staff.elka.pw.edu.pl/~rbiedrzy/publ/nl_shade_midpoint.pdf)：第 II 节说明 RSP 系列的机制差异。
