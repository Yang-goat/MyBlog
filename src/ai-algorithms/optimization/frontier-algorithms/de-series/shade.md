---
title: SHADE：用成功历史保留多种参数经验
icon: arrows-left-right
date: 2026-09-19
order: 3
category:
  - 智能优化算法
tag:
  - 差分进化
  - 参数自适应
---

# SHADE：用成功历史保留多种参数经验

[JADE](./jade.md) 把成功参数压缩为一对采样中心。SHADE（Success-History based Adaptive Differential Evolution）由 Tanabe 与 Fukunaga 于 2013 年提出，改用多个历史中心。它主要改变参数控制层，仍沿用 current-to-pbest 变异和外部档案。

## 两种“记忆”不要混淆

| 对象 | 保存什么 | 在哪里使用 |
| --- | --- | --- |
| 解档案 $A$ | 被替换的旧父代向量 | 提供差分供体 |
| 参数记忆 $M_F,M_{CR}$ | $H$ 组成功参数的统计中心 | 生成新参数 |

生成第 $i$ 个试验时，随机抽取槽位 $r_i\in\{1,\ldots,H\}$，围绕该槽的中心采样 $F_i,CR_i$。一代结束后，把成功样本汇总到当前写入槽 $k$；有有效成功样本时写入并推进 $k$，到末尾再回到首槽。

这里保存的是历史统计量，不是每次成功试验的完整日志，也不是按槽位把种群固定分成 $H$ 个子群。

## 原版 SHADE 的更新

令严格改进样本的收益为 $\Delta f_i=f(\mathbf{x}_i)-f(\mathbf{u}_i)>0$，归一化权重为

$$
w_i=\frac{\Delta f_i}{\sum_{j\in S}\Delta f_j}.
$$

2013 年原版使用加权 Lehmer 均值更新 $F$，加权算术均值更新 $CR$：

$$
M_{F,k}\leftarrow\frac{\sum_{i\in S}w_iF_i^2}{\sum_{i\in S}w_iF_i},
\qquad M_{CR,k}\leftarrow\sum_{i\in S}w_iCR_i.
$$

当 $S$ 为空时不更新。后续 SHADE 1.1 / L-SHADE 的 $CR$ 更新采用加权 Lehmer 均值，并带有特殊零值处理；不能把后者的公式直接标成 2013 年原版。

## 一个更新例子

设两次成功的收益分别为 $1,3$，对应 $F=(0.2,0.8)$、$CR=(0.3,0.9)$。则权重为 $(0.25,0.75)$：

$$
M_{F,k}=\frac{0.25\times0.2^2+0.75\times0.8^2}{0.25\times0.2+0.75\times0.8}
=\frac{0.49}{0.65}\approx0.75385,
$$

$$
M_{CR,k}=0.25\times0.3+0.75\times0.9=0.75.
$$

这是人为构造的算例，不是论文实验。它显示，较大收益对中心影响更大，但被更新的只是一个槽；其他槽仍保留此前的参数经验。因此下一代不必全部围绕本代结果采样。

## 多槽机制能解决什么

从存储结构看，多槽使反馈不必立即覆盖全部历史经验。代价是多了记忆长度 $H$：记忆太短可能快速遗忘，太长可能保留不再适用的中心。这里是机制层面的取舍，不能据此直接确定最优 $H$。

还有一个容易忽视的性质：若目标函数做正仿射变换 $f'=af+b$、$a>0$，收益权重保持不变；若做一般的单调非线性变换，排序可能不变，收益比例却会变化。因此“相同排序”并不保证相同的参数适应轨迹。

## 从参数记忆走向预算调度

SHADE 控制的是“怎样采样参数”，并不自动回答“还应保留多少个体”。当评价预算逐渐消耗时，固定大种群可能使同一批个体得到的更新轮次有限。[L-SHADE](./l-shade.md) 因而把种群规模也纳入调度。

复现时应明确 SHADE 的版本、成功判据、记忆长度、档案容量及 $p$ 的设置。本文解释机制，未运行原论文的基准实验。

## 参考资料

- Tanabe, R.; Fukunaga, A. (2013). [Success-History Based Parameter Adaptation for Differential Evolution](https://metahack.org/CEC2013-SHADE.pdf)，重点见第 V 节。
- Tanabe, R.; Fukunaga, A. (2014). [Improving the Search Performance of SHADE Using Linear Population Size Reduction](https://metahack.org/CEC2014-Tanabe-Fukunaga.pdf)，包含 SHADE 1.1 的参数更新。
