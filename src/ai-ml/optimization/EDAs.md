---
icon: e
date: 2025-11-27
category:
  - 智能优化算法
tag:
  - 分布估计算法
---

# 分布估计算法（EDAs）

EDAs（Estimation of Distribution Algorithms）是一类基于概率模型的进化优化算法。与传统遗传算法（Genetic Algorithms，GA）相比，EDAs 用**分布学习 + 采样**替代了交叉与变异算子，因此在结构表示能力、稳定性与全局搜索性能方面具有显著优势。

```markmap
# EDAs
## vs GA
- Model dependencies
- Stability
- No manual operators
## Types
### Univariate
- UMDA
- PBIL
### Pairwise
- MIMIC
### Multivariate
- EMNA
- BOA
### Hybrid
- GMM-EDA
- mixture-of-BNs
- global/local hybrid EDAs
### Parallel
- Island-based
- Parallel model learning
- Master-worker EDA
## Applications
- Combinational optimization
- Engineering optimization
- Hyperparameter tuning
```

## EDA vs GA

虽然 EDAs 与 GA 均属于基于种群的随机优化算法，但 EDAs 引入概率模型后具备了一系列关键优势：

- **模型驱动搜索**：GA 依赖交叉与变异等随机操作，而 EDA 明确构建概率模型来描述优秀解的结构，使搜索方向更具信息性。  
- **减少参数与操作复杂度**：无需复杂的交叉/变异设计，也避免不合适的操作对变量依赖关系造成破坏。  
- **更容易捕捉变量之间的依赖关系**：通过模型（如多变量分布）自动学习特征间关联，而 GA 通常无法显式表达。  
- **更适合集成机器学习思想**：EDA 使用“学习—采样”循环，可自然融合统计、ML、图模型等方法。  
- **更稳定的收敛行为**：基于概率模型的更新通常比 GA 的随机算子更稳定，可提高全局搜索能力。

## 1. 基本思想

EDAs 的核心思想是：

1. **生成初始种群**；
2. **选择优秀个体**；
3. **从优秀个体中估计概率分布 $p(\mathbf{x})$**；
4. **依据分布采样新种群**；
5. **迭代更新直至收敛**。

这种“学习 → 采样 → 更新”的范式使得 EDA 能够显式地捕捉变量结构与依赖关系。

## 2. 基本流程

EDAs 的通用流程如下：

$$
\text{Learn distribution} \Rightarrow \text{Sample population} \Rightarrow \text{Evaluate} \Rightarrow \text{Select}
$$

伪代码：

```pseudo
初始化种群 P
重复直到满足终止条件：
    从 P 中选择优秀个体 S
    基于 S 估计概率模型 M
    由模型 M 采样生成新个体集合 P_new
    将 P_new 替换或合并入 P
返回最优解
```

---

## 3. 按概率模型分类的 EDA 类型

以下根据模型的依赖能力与复杂度分类，伪代码以二元编码为例。

---

### 3.1 无依赖模型（Univariate EDAs）

假设变量独立：

$$
p(x_1,\ldots,x_n) = \prod_{i=1}^n p(x_i)
$$

代表算法：

- UMDA
- PBIL

#### 3.1.1 UMDA

UMDA（Univariate Marginal Distribution Algorithm）单变量边缘分布算法：假设各维度独立，对每个维度估计边缘分布。

```vbnet
初始化种群规模 N、选择比例 τ
随机初始化种群 P

循环直到满足终止条件：
    评估种群适应度
    选择前 τ·N 个优秀个体作为 S

    对于每个变量 i：
        统计 S 中变量 i = 1 的频率 p_i
        若 p_i = 0 或 1，则进行平滑处理 p_i ← 修正值

    根据 {p_i} 采样产生新种群 P
返回最优个体
```

#### 3.1.2 PBIL

PBIL（Population-Based Incremental Learning）基于增量学习的概率模型：维护一个概率向量，并以“学习率”向优秀样本更新。

```vbnet
初始化概率向量 p_i = 0.5
设定学习率 α、负学习率 β
设定最佳样本选择规则

循环直到终止：
    根据 p_i 采样得到种群 P
    评估适应度并选择最佳样本 B

    对于每个变量 i：
        p_i ← p_i * (1 - α) + B_i * α    # 正向学习
        若采用负学习：
            对最差样本 W：
                p_i ← p_i * (1 - β) + W_i * β（反向远离最差）
返回最优解
```

---

### 3.2 简单依赖模型（Pairwise / Chain-structured EDAs）

通过互信息或二阶统计量建模局部依赖。

典型算法：

- MIMIC（链式结构）
- BMDA（双变量依赖）

#### 3.2.1 MIMIC

MIMIC（Mutual-Information Maximizing Input Clustering）最大化互信息输入聚类算法：使用排序样本，通过最小化 KL 散度的有向链结构建模，等价于一个基于互信息的排序链式模型。

```
初始化种群规模 N
随机生成初始样本集 P

循环直到终止：
    评估个体适应度
    选出前 τ·N 个优秀样本 
    将 S 按目标函数值排序

    通过互信息计算变量之间的依赖关系
    构建最优的链式结构（最小化KL散度）

    根据链式模型估计条件概率
    采样产生新样本集合 P
返回最优解
```

#### 3.2.2 BMDA

BMDA（Bivariate Marginal Distribution Algorithm）双变量边缘分布算法：通过相关性将变量分组，每组内用二元分布建模，组间假设独立。

```
初始化种群 P

循环直到终止：
    评估适应度
    选择优秀样本 S

    计算变量之间的相关性矩阵
    将变量按相关性成对分组（贪心或最小生成树法）

    对于每一对变量 (i, j)：
        统计 S 中两变量的联合概率 P(x_i, x_j)

    依据所有二元联合概率采样生成新种群 P
返回最优解
```

---

### 3.3 全依赖模型（Multivariate EDAs）

能够表达完整依赖结构，如高斯模型或贝叶斯网络。

代表：

- EMNA（多元正态分布）
- BOA（贝叶斯网络）
- hBOA（层次贝叶斯网络）

#### 3.3.1 EMNA

EMNA（Estimation of Multivariate Normal Algorithm）多元正态分布估计算法：连续变量的 EDA，用多元高斯分布来建模。

```
初始化连续解的种群 P

循环直到终止：
    评估适应度
    选择优秀样本 S

    估计均值向量 μ
    估计协方差矩阵 Σ

    使用多元正态分布 N(μ, Σ) 采样生成新的 P
返回最佳解
```

#### 3.3.2 BOA与hBOA

> 暂时略过

---

## 4. 分布参数估计方法

### 4.1 最大似然估计（MLE）

对 elite 样本直接估计参数，如高斯模型：

$$
\mu=\frac{1}{m}\sum_{i=1}^m x^{(i)},\quad
\Sigma=\frac{1}{m}\sum_{i=1}^m (x^{(i)}-\mu)(x^{(i)}-\mu)^T
$$

### 4.2 增量式更新（PBIL）

使用学习率更新分布参数：

$$
p_{t+1} = (1 - \eta)p_t + \eta \hat{p}
$$

---

## 5. 混合分布估计算法（Hybrid EDAs）

混合分布 EDA（Hybrid EDAs 或 Mixture-based EDAs）旨在提高模型表达能力，使算法既能保持探索性，又能抓住不同模式的结构信息。

常见的混合 EDA 模型包括：

### 5.1 高斯混合模型（GMM-EDA）

使用 GMM 建模多个模式：

$$
p(x) = \sum_{k=1}^K \pi_k \mathcal{N}(x|\mu_k, \Sigma_k)
$$

优势：

- 能同时表示多个高质量区域（多峰优化问题中尤为重要）  
- 采样时能够保持种群多样性  
- 自适应学习不同群体结构  

典型程序包括：

- Elite 样本聚类  
- 使用 EM 算法估计各组件参数  
- 从混合模型采样生成下一代  

缺点：

- 高维时 GMM 学习成本较高  
- 需要确定簇数 K（可使用 BIC/MDL 自动选择）  

### 5.2 混合贝叶斯网络 EDA

将不同结构的贝叶斯网组合形成 mixture-of-BNs：

$$
p(x)=\sum_{k=1}^K \pi_k p_k(x|\text{BN}_k)
$$

适合多模式、组合依赖强的问题。

### 5.3 混合策略（局部 EDA + 全局 EDA）

例如：

- 全局：高斯或贝叶斯网络学习全局趋势  
- 局部：UMDA 或 PBIL 专注局部搜索  

这种“双层结构”能在探索和利用之间取得更好平衡。

---

## 6. 并行分布估计算法（Parallel EDAs）

随着高维优化和大规模计算需求的增加，并行化 EDA 成为重要方向。

以下是两大类并行技术：

---

### 6.1 种群划分（Island-based Parallel EDAs）

将种群划分为多个“岛屿”：

- 每个岛独立运行一个 EDA  
- 使用不同的模型或参数  
- 周期性迁移部分个体以共享信息  

优势：

- 高性能扩展性强  
- 不同岛屿可探索不同分布结构  
- 抵抗早熟收敛  

典型框架：

- Island UMDA  
- Island BOA  
- Island EMNA  

---

### 6.2 分布学习并行化（Parallel Model Learning）

针对模型学习成本高的问题（如 BOA、GMM、EMNA），可对以下步骤并行化：

#### 1. 统计量并行计算  
例如均值、协方差、计数统计可通过 Map-Reduce 实现。

#### 2. 模型学习并行化  
- EM 算法的 E/M 步并行  
- 贝叶斯网络结构搜索（评分可拆分为局部结构评分）  

#### 3. 并行采样  
从概率分布采样天然可并行。

---

### 6.3 主–从（Master–Worker）并行 EDA

- Master 负责模型学习  
- Worker 负责采样与适应度计算

适用于计算代价非常大的适应度评估任务（例如工程仿真优化）。

---

### 6.4 优势与应用

并行化 EDA 可极大加速：

- 工程领域的大规模模拟优化（如 CFD、材料建模）  
- 深度学习超参数搜索  
- 基因组计算、大型组合优化  

---
