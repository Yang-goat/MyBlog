---
title: RDE：重新组合有效策略的差分进化
icon: arrows-left-right
date: 2026-09-19
order: 9
category:
  - 智能优化算法
tag:
  - 差分进化
  - 混合优化
---

# RDE：重新组合有效策略的差分进化

随着 DE 变体增加，一个自然问题是：有效组件放在一起，是否仍然有效？Tao、Zhao、Wang 与 Gao 的 RDE（Reconstructed Differential Evolution，2024）围绕策略重组展开。本文的 RDE 专指这篇工作，不指其他同缩写算法。

## 从“增加组件”转向“安排组件”

RDE 将两种变异策略、扩展排名选择、成功历史记忆、种群缩减及 Cauchy 扰动组织在一起。其切入点并非所有组件都是新发明，而是如何分配资源、协调已有机制。

例如，向优秀区域集中与维持候选多样性可能互相牵制。一个组件独立加入时带来的收益，不保证在另一个强开发组件存在时仍然成立。因此组合方案本身也需要验证。

## 两种变异分支

第一种沿用 current-to-pbest：

$$
\mathbf{v}_i=\mathbf{x}_i+F_i(\mathbf{x}_{pbest}-\mathbf{x}_i)
+F_i(\mathbf{x}_{r_1}-\mathbf{x}_{r_2}).
$$

第二种 current-to-order-pbest 将选出的三个供体按目标值排序，记为 $\mathbf{x}_{best},\mathbf{x}_{mid},\mathbf{x}_{worst}$，再构造

$$
\mathbf{v}_i=\mathbf{x}_i+F_i(\mathbf{x}_{best}-\mathbf{x}_i)
+F_i(\mathbf{x}_{mid}-\mathbf{x}_{worst}).
$$

这里的 best 是所选供体中的最好者，不一定是全种群最优。排序让供体承担的角色与适应度关联，但 $\mathbf{x}_{mid}-\mathbf{x}_{worst}$ 仍不是梯度，不能保证沿它移动就会下降。

## 如何在两个分支之间分配资源

论文依据分支产生的平均改进分配后续资源，而不是始终各用一半。理解这一点时，要区分“总收益”和“每次试验的平均收益”。

举例说，A 分支用了 90 次评价，累计改善 9；B 分支用了 10 次评价，累计改善 2。按累计量看 A 更大，按每次平均值看 B 为 0.2、高于 A 的 0.1。归一化方式会改变下一轮预算的偏向。这是说明统计口径的示例，不是本文另行规定 RDE 的更新公式。

此外，如果两个分支都没有改进，比例公式可能出现零分母；如果一个分支长期拿不到资源，又无法提供新的效果证据。实现时应核对原算法的回退、概率范围和更新时点，不能只抄一个比值。

## 原文公式需要交叉核对

公开的 2024 年预印本中存在值得复现者检查的符号不一致：式 (11)–(12) 的 $F$ / $CR$ 标签与分布中心交叉，式 (8) 又混用了不同代的收益下标。本文保留机制层面的说明，不将这些写法当作可直接运行的规范，也不擅自把推测的修正称为作者定义。

这类问题说明，公式、伪代码和代码应共同核对。若无法得到一致解释，应在复现记录中写明采用哪一种，而不是把实现选择藏在代码里。

## 怎样评价这种创新

本文的判断是：RDE 的价值在于策略组合及分配方式，其有效性需要组件消融支撑。适合进一步问的是：有序供体是否必要、扩展 RSP 的收益是否独立、Cauchy 扰动是否只在少数函数上贡献明显，而不是把所有收益归到“重构”这个名称。

论文在 CEC2024 基准上进行了比较；本文未复现结果，也不据此推断任意任务或其他预算下的最优性。下一篇 [RDEx-SOP](./rdex.md) 继续考察这条重组路线怎样吸收成功率反馈。

## 参考资料

- Tao, S.; Zhao, R.; Wang, K.; Gao, S. (2024). [An Efficient Reconstructed Differential Evolution Variant by Some of the Current State-of-the-art Strategies for Solving Single Objective Bound Constrained Problems](https://arxiv.org/html/2404.16280v1)，本文对应 v1。
- [RDEx 系列作者仓库](https://github.com/SichenTao/IEEE-CEC-2025-Competition-RDEx-Series)，提供后续系列与 RDE 的文献关联。
