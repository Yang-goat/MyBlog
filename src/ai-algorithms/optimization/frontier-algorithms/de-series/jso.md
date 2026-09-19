---
title: jSO：按搜索阶段调整精英引导
icon: arrows-left-right
date: 2026-09-19
order: 5
category:
  - 智能优化算法
tag:
  - 差分进化
  - 参数自适应
---

# jSO：按搜索阶段调整精英引导

Brest、Maučec 与 Bošković 于 2017 年提出 jSO。它通过 iL-SHADE 承接 [L-SHADE](./l-shade.md) 路线，保留成功历史记忆与线性缩群，同时细化变异权重及参数调度。理解 jSO 的关键是分清“向精英靠近”与“差分扰动”这两部分。

## 两个差分项不必共享同一个强度

其加权 current-to-pbest 变异可以写为

$$
\mathbf{v}_i=\mathbf{x}_i+F_{w,i}(\mathbf{x}_{pbest}-\mathbf{x}_i)
+F_i(\mathbf{x}_{r_1}-\widetilde{\mathbf{x}}_{r_2}).
$$

令 $t=FE/FE_{\max}$，论文给出的引导权重为

$$
F_{w,i}=\begin{cases}
0.7F_i,&t<0.2,\\
0.8F_i,&0.2\le t<0.4,\\
1.2F_i,&t\ge0.4.
\end{cases}
$$

该规则只改变精英引导项的权重。将它实现为“把整个变异式中的 $F$ 都乘以系数”，会同时放大扰动项，得到另一种搜索行为。

## 一个向量例子

取当前解 $(0,0)$、精英方向 $(2,0)$、差分扰动方向 $(0,2)$，并令 $F_i=0.5$。三个阶段交叉前的变异向量分别为

$$
(0.7,1),\quad(0.8,1),\quad(1.2,1).
$$

第二个坐标的扰动保持为 1，而第一个坐标的引导逐渐增强。这个人为例子说明，权重调度改变的不只是向量长度，还改变了搜索方向。

早期降低引导、后期提高引导，是设计意图；是否真的改善探索与开发，仍取决于精英所在区域是否值得持续搜索。

## jSO 不是一条公式

论文还调整了初始种群规模、记忆设置、优秀集合比例，以及早期 $F$ / $CR$ 的限制。因此，上面的加权变异只是理解入口，不能单独代表完整 jSO。

复现尤其要检查“阶段进度”的定义：变异权重公式明确使用函数评价次数；原文伪代码中的其他阶段条件使用了代数记号。对照作者实现时应逐项记录实际判断变量，不能因种群规模变化而随意把代数比例与评价比例互换。

## 怎么判断改进来自哪里

可以设计三组机制对照：相同框架下使用统一 $F$、使用阶段性 $F_w$、使用固定 $F_w/F$ 比例。若阶段性方案占优，才进一步分析它是否在特定阶段降低了越界率、保持了多样性或提高了成功率。

这个实验设计是阅读建议，不是本文已完成的消融。原论文在 CEC2017 上与 L-SHADE、iL-SHADE 比较；其中的实验结果不直接证明 jSO 在所有实际问题上更好，也不能单凭论文内部比较推断整个竞赛的名次。

[LSHADE-RSP](./lshade-rsp.md) 接下来把注意力转向供体的抽样分布：除了控制差分项的系数，还能控制哪些个体更容易进入差分项。

## 参考资料

- Brest, J.; Maučec, M. S.; Bošković, B. (2017). [Single Objective Real-Parameter Optimization: Algorithm jSO](https://labraj.feri.um.si/wp-content/uploads/janez/CEC2017-jSO.pdf)，DOI：10.1109/CEC.2017.7969456。
- [作者实验室的差分进化文献页面](https://labraj.feri.um.si/dejavnosti/raziskovalna-dejavnost/diferencialna-evolucija/)。
