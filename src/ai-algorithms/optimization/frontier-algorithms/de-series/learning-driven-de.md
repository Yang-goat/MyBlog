---
title: 学习驱动的 DE：从手写反馈到策略学习
icon: arrows-left-right
date: 2026-09-19
order: 11
category:
  - 智能优化算法
tag:
  - 差分进化
  - 强化学习
---

# 学习驱动的 DE：从手写反馈到策略学习

JADE、SHADE 和 L-SRTDE 都利用运行反馈，但反馈如何映射到参数仍主要由人设计。学习驱动的 DE 把其中一部分决策交给从优化经验训练出来的模型。本篇是一篇方向综述，并不把“学习驱动 DE”当作一个具有唯一实现的算法名称。

这条研究线与前面的手工自适应方法并行发展，不能在时间上简单排成 [RDEx-SOP](./rdex.md) 之后的一代。

## 模型到底控制哪一层

| 学习对象 | 动作示例 | 对应代表工作 |
| --- | --- | --- |
| 算子选择 | 为一个父代选择变异策略 | DE-DDQN，2019 |
| 参数控制 | 根据运行状态给出控制参数 | LDE，2021 |
| 算法调度 | 在多个 DE 求解器之间切换 | DE 上的动态算法选择研究，2024 |

预测目标函数值的代理模型属于另一条路线。一个方法使用神经网络，不意味着它一定学习了 DE 的控制策略；需要先看模型的输入和输出。

## DE-DDQN：学习选择变异算子

Sharma、Komninos、López-Ibáñez 与 Kazakov 的 DE-DDQN 将双重深度 Q 学习用于自适应算子选择。它离线收集优化状态与算子效果，在测试问题上用训练好的网络选择变异策略。论文使用 99 个状态特征，比较了不同奖励定义。

它的重要区别是：动作主要选择离散策略，不是直接输出候选解。训练好控制器后，候选解仍由所选 DE 算子产生，仍需进行真实目标评价。

## LDE：学习参数控制策略

Sun、Liu、Bäck 与 Xu 的 LDE 把参数控制建模为有限时域决策过程，通过策略梯度从一组优化问题的经验中训练控制器。作者实现提供训练与测试流程，并报告 CEC2013 / CEC2017 上的实验。

可以用下面的概念式理解控制回路：

$$
\mathbf{s}_g\xrightarrow{\pi_\theta}\mathbf{a}_g
\xrightarrow{\text{DE 生成与评价}}(r_g,\mathbf{s}_{g+1}).
$$

$\mathbf{s}_g$ 是状态特征，$\mathbf{a}_g$ 是控制动作，$r_g$ 是反馈奖励，$\theta$ 是模型参数。这个表达只概括回路，不代替 LDE 的网络结构、状态设计和训练算法。

## 从算子选择到算法选择

Guo 等人在 2024 年研究用强化学习动态调度不同 DE 算法，并讨论切换时的算法上下文恢复。这个层次比在固定框架内选择一个算子更高：不同求解器可能拥有各自的档案、参数记忆和运行状态。

从机制上看，如果切换时只交接当前最优解，可能丢失种群分布与历史参数；如果全部状态都保留，则又需要决定哪些状态可以共享。算法调度的难点因此不仅是“选择哪个”，还有“怎样接着运行”。

## 怎样验证学到了可迁移的策略

下面是阅读与实验设计建议，不是上述论文全部已经完成的验证项目。

首先区分训练、验证与测试问题。只更换随机种子通常不足以证明跨问题泛化；还应检查维数、函数结构、旋转方式、约束和预算是否发生变化。

其次分别统计成本：

$$
C_{total}=C_{train}+C_{features}+C_{inference}+C_{evaluation}.
$$

这四项分别表示训练、特征提取、模型推理和真实目标评价的成本。它们可以用时间记录；若统一换算为评价等价量，需要交代换算条件。把离线训练忽略不计与把它分摊到大量任务中，是不同使用场景。

最后设置能够回答问题的基线：固定算子、随机选择、手工自适应规则、固定算法组合。若只比一个弱固定配置，无法判断收益来自学习本身，还是来自增加了候选策略。

## 与成功历史方法的关系

SHADE 用少量历史统计在线更新，学习控制器则有机会利用更丰富的跨任务经验；后者也引入训练分布偏移、奖励设计和模型开销。哪条路线更适合，取决于目标任务是否重复出现、训练成本能否摊销以及预算是否允许。

因此，“学习驱动”是一种扩大控制器设计空间的方法，不是天然优于经典自适应 DE 的标签。本文只整理原论文机制与验证问题，没有训练控制器，也未复现性能结论。

## 参考资料

- Sharma, M.; Komninos, A.; López-Ibáñez, M.; Kazakov, D. (2019). [Deep Reinforcement Learning Based Parameter Control in Differential Evolution](https://arxiv.org/abs/1905.08006).
- Sun, J.; Liu, X.; Bäck, T.; Xu, Z. (2021). [Learning Adaptive Differential Evolution Algorithm From Optimization Experiences by Policy Gradient](https://arxiv.org/abs/2102.03572)；[作者实现](https://github.com/yierh/LDE)。
- Guo, H. 等 (2024). [Deep Reinforcement Learning for Dynamic Algorithm Selection: A Proof-of-Principle Study on Differential Evolution](https://arxiv.org/abs/2403.02131).
