---
icon: book
date: 2025-10-15
# order: 1
category:
  - 优化问题
# tag:
#   - GA
---

# 多目标优化问题

## 一、问题的定义

在传统的优化问题中，我们通常只有一个目标函数，比如：**最小化成本** 或 **最大化收益**。
但在实际工程或决策中，往往存在多个相互冲突的目标，比如：

- **汽车设计**：希望 速度快（目标1）同时 油耗低（目标2），但速度越快往往油耗越高。
- **机器学习模型调参**：希望 精度高（目标1）同时 推理延迟低（目标2）。
- **投资组合管理**：希望 收益高（目标1）同时 风险低（目标2）。

此时我们引入**多目标优化问题**，一般形式如下：

设

- $\mathbf{x} = (x_1, x_2, \ldots, x_n)^{\mathrm{T}} \in X \subseteq \mathbb{R}^n$ 为决策变量向量，  
- $\mathbf{f}(\mathbf{x}) = (f_1(\mathbf{x}), f_2(\mathbf{x}), \ldots, f_m(\mathbf{x}))^{\mathrm{T}}$ 为目标函数向量。  

约束条件为：

$$
g_i(\mathbf{x}) \le 0, \quad i = 1,2,\ldots,p,\\
h_j(\mathbf{x}) = 0, \quad j = 1,2,\ldots,q.
$$

则多目标优化问题可表述为：

$$
\begin{aligned}
\text{Minimize} \quad & \mathbf{f}(\mathbf{x}) = \{ f_1(\mathbf{x}), f_2(\mathbf{x}), \ldots, f_m(\mathbf{x}) \} \\
\text{s.t.} \quad & g_i(\mathbf{x}) \le 0, \quad i = 1, 2, \ldots, p, \\
& h_j(\mathbf{x}) = 0, \quad j = 1, 2, \ldots, q, \\
& \mathbf{x} \in X \subseteq \mathbb{R}^n.
\end{aligned}
$$

## 二、帕累托最优性

由于不存在一个在所有目标上同时优于其他所有解的“完美解”，我们引入 **“帕累托最优性（Pareto Optimality）”** 的概念：如果一个解在 **不恶化任何一个目标的前提下** 改进了至少一个目标，则认为它优于另一个解。所有无法被其他解支配的解构成的解集，称为 **Pareto 最优解集**，其在目标空间中的映射则构成 **Pareto 前沿（Pareto Front）**。

因此，求解多目标优化问题的核心任务不是寻找一个单一解，**而是求解整个 Pareto 前沿**，它代表了不同目标之间的最优折中关系，为决策者提供选择依据。

下面是对帕累托最优性的定义:

**定义 1.1（Pareto 支配）**   设 $\mathbf{x}_a, \mathbf{x}_b \in \Omega$，若满足：
$$
\begin{cases}
f_i(\mathbf{x}_a) \le f_i(\mathbf{x}_b), & \forall i \in \{1,2,\ldots,m\}, \\
f_j(\mathbf{x}_a) < f_j(\mathbf{x}_b), & \exists j \in \{1,2,\ldots,m\},
\end{cases}
$$
则称 $\mathbf{x}_a$ **Pareto 支配** $\mathbf{x}_b$，记作 $\mathbf{x}_a \prec \mathbf{x}_b$。

**定义 1.2（弱 Pareto 支配）**  若：
$$
f_i(\mathbf{x}_a) \le f_i(\mathbf{x}_b), \quad \forall i = 1,2,\ldots,m,
$$
则称 $\mathbf{x}_a$ **弱 Pareto 支配** $\mathbf{x}_b$，记作 $\mathbf{x}_a \preceq \mathbf{x}_b$。

**定义 1.3（Pareto 最优解）**  若 $\nexists \mathbf{x} \in \Omega$ 使得 $\mathbf{x} \prec \mathbf{x}^*$，则称 $\mathbf{x}^*$ 为 **Pareto 最优解**。

Pareto 最优解集合定义为：
$$
\mathcal{P}^* = \left\{ \mathbf{x} \in \Omega \,\middle|\, \nexists\, \mathbf{x}' \in \Omega, \mathbf{x}' \prec \mathbf{x} \right\}.
$$

**定义 1.4（Pareto 前沿）**  所有 Pareto 最优解在目标空间中的像构成的集合定义为 **Pareto 前沿**：
$$
\mathcal{F}^* = \left\{ \mathbf{f}(\mathbf{x}) \mid \mathbf{x} \in \mathcal{P}^* \right\}.
$$


## 三、求解


