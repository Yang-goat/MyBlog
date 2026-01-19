---
icon: pen-to-square
date: 2026-01-19
# order: 1
category:
  - 数学
tag:
  - 随笔
---

# 压缩映射定理（Contraction mapping theorem）

## 概念

### 不动点（Fixed point）

若 $x \in X$ 满足
$$
f(x)=x,
$$
则称 $x$ 是映射 $f: X \to X$ 的一个不动点。

### 压缩映射（Contraction mapping，或 contractive function）

若存在常数 $\gamma \in (0,1)$，使得对任意 $x_1,x_2 \in X$ 都有
$$
\lVert f(x_1)-f(x_2) \rVert \le \gamma \lVert x_1-x_2 \rVert,
$$
则称 $f$ 为压缩映射。

其中需要注意：

- $\gamma$ 必须严格小于 $1$，从而保证诸如 $\gamma^k \to 0$（当 $k \to \infty$）之类的极限成立；  
- 这里的 $\lVert \cdot \rVert$ 可以是任意向量范数。

## 定理

对于任意形如 $x=f(x)$ 的方程，如果 $f$ 是一个压缩映射，则有：

- 存在性（Existence）：存在一个不动点 $x^*$，使得 $f(x^*)=x^*.$
- 唯一性（Uniqueness）：该不动点 $x^*$ 是唯一的。
- 算法（Algorithm）：考虑序列 $\{x_k\}$，其中 $x_{k+1}=f(x_k)$， 则当 $k \to \infty$ 时，有 $x_k \to x^*$。此外，该收敛速度是指数级快的。