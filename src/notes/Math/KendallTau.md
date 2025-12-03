---
icon: pen-to-square
date: 2025-12-03
# order: 1
category:
  - 数学
tag:
  - 随笔
---

# Kendall Tau 距离

## 1. 概念概述

**Kendall tau 距离（Kendall tau distance）**用于衡量两个排序（permutations）之间**相对顺序的不一致程度**。  
它统计所有顺序相反的成对元素数量，也称为 *discordant pairs*。

---

## 2. 数学定义

给定两个排序 $\sigma$ 和 $\pi$（元素相同但顺序可能不同），定义 Kendall tau 距离为：

$$
K(\sigma,\pi)=|\{(i,j): i<j,\ (\sigma(i)-\sigma(j))(\pi(i)-\pi(j))<0\}|
$$

更直观解释：  
比较所有 $\frac{n(n-1)}{2}$ 对元素，只要 $\sigma$ 和 $\pi$ 中的相对顺序相反，就计一次距离。

---

## 3. 示例

设两个排序：

- $\sigma = [1,2,3,4]$
- $\pi = [1,3,2,4]$

不一致的仅是 $(2,3)$：

- 在 $\sigma$ 中：2 在 3 前  
- 在 $\pi$ 中：3 在 2 前  

因此：

$$
K(\sigma,\pi) = 1
$$

---

## 4. 距离范围

最大距离发生在完全逆序时：

$$
0 \le K(\sigma,\pi) \le \binom{n}{2}
$$

---

## 5. 与 Kendall Tau 相关系数的关系

Kendall $\tau$ 相关性定义为：

$$
\tau = 1 - \frac{2K}{\binom{n}{2}}
$$

距离越大，相关性越小。

---

## 6. 计算算法

### 1. 朴素算法 $O(n^2)$
比较所有成对元素。

### 2. 基于归并排序的逆序对统计 $O(n\log n)$
可将一个排序映射到另一个的序号序列，然后统计逆序对数，即为 Kendall tau 距离。

---

## 7. 应用场景

- 评价排序算法质量  
- 排序预测 vs. 实际排序的偏差分析  
- 推荐系统中比较推荐列表  
- 投票系统 / 社会选择理论  
- 统计学中的 Kendall $\tau$ 系数

---
