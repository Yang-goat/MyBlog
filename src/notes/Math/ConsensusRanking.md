---
icon: pen-to-square
date: 2025-12-03
# order: 1
category:
  - 数学
tag:
  - 随笔
---

# 共识排列（Consensus Ranking）

## 1. 基本概念

**共识排列**指：给定多个来源（评委、模型、算法）的排序，求一个能“最好代表所有排序意见”的最终排序。

设对象集合为  
$C=\{c_1,c_2,\dots,c_n\}$  
有 $m$ 个输入排序（对对象集合元素的排列）：  
$R^{(1)},R^{(2)},\dots,R^{(m)}$

目标是求一个排序 $R^\*$ 使得它与所有输入排序尽可能一致：

$$
R^\*=\arg\min_R\sum_{i=1}^{m}d(R,R^{(i)})
$$

常用距离：Kendall tau 距离（交换次数）。

---

## 2. Kemeny-Young 共识（最经典）

Kemeny 最优排序定义为最小化 Kendall tau 距离：

$$
R^\*=\arg\min_R\sum_{i=1}^{m}K(R,R^{(i)})
$$

其中 $K(\cdot,\cdot)$ 为 Kendall tau 距离。

**特点：**
- 理论上最严格
- 但求解是 **NP-hard**，候选项大时需要近似算法（因为排列个数为 $n!$）

---

## 3. 常见的求解方法

### 3.1 Pairwise Comparison（成对比较法）

对每一对候选项 $(a,b)$ 统计谁更常排前：

$$
w(a,b)=\#\{i\mid a\prec_i b\}
$$

形成胜负矩阵，通过最大一致性求排序。

---

### 3.2 Borda Count（波达计数）

简单近似方法：  
若排序有 $n$ 个元素，名次为 $k$ 则得分 $n-k$。

累加所有排序的得分，最终按得分降序排列。

**优点：** 高效、简单
**缺点：** 不一定是 Kemeny 最优

---

### 3.3 排序融合算法（Rank Aggregation）

常用近似策略包括：

- Markov Chain / PageRank-like 方法（如 MC4）
- Simulated Annealing（模拟退火）
- Genetic Algorithms（遗传算法）
- Local Kemenization（局部交换优化）

这些方法可近似求 Kemeny 最优。

---

## 4. 应用场景

- 多评委评分（竞赛、评审）
- 元搜索（meta-search）融合多个搜索引擎结果
- 推荐系统模型结果融合
- 多模型集成（Ensemble Learning）中的排序组合

---

## 5. 示例

3 个候选项 A, B, C  
3 个评委排序：

1. A > B > C  
2. B > C > A  
3. B > A > C  

统计 pairwise：
- B 胜 A：2 次  
- A 胜 C：2 次  
- B 胜 C：3 次  

最终共识排序：

**B > A > C**

---

## 6. 总结

- 共识排列本质是**排序合并问题**  
- 最经典方法是 Kemeny-Young，但计算困难  
- Borda 等方法是实用近似  
- 在搜索、推荐、评审等场景广泛使用

