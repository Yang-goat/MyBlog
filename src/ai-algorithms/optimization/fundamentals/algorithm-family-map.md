---
redirectFrom:
  - "/ai-ml/optimization/MindMap.html"
title: 分类思维导图
icon: sitemap
date: 2026-03-22
order: 2
category:
  - 智能优化算法
tag:
  - 导论
  - 分类
---

# 分类思维导图

本图按算法家族与搜索机制组织，叶子节点可直接点击进入对应算法文章。按问题特征阅读可打开[研究方向思维导图](../frontier-algorithms/research-directions.md)。

```markmap
---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 4
---

# 智能优化算法（Optimization）

## 演化计算类

### 遗传算法（Genetic Algorithms）
#### 基础与经典改进
##### [遗传算法（GA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/genetic-algorithm.html)
##### [排序选择遗传算法（RSGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/ranked-selection-genetic-algorithm.html)
##### [适应度缩放遗传算法（FSGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/fitness-scaling-genetic-algorithm.html)
##### [稳态遗传算法（SSGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/steady-state-genetic-algorithm.html)
##### [精英遗传算法（EGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/elitist-genetic-algorithm.html)
##### [实数编码遗传算法（RCGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/real-coded-genetic-algorithm.html)
#### 种群结构与编码扩展
##### [微型遗传算法（μGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/micro-genetic-algorithm.html)
##### [元胞遗传算法（CGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/cellular-genetic-algorithm.html)
##### [岛屿遗传算法（IGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/island-genetic-algorithms.html)
##### [杂乱遗传算法（Messy GA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/messy-genetic-algorithm.html)
#### 系统扩展与多目标
##### [学习分类器系统（LCS）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/learning-classifier-system.html)
##### [非支配排序遗传算法（NSGA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/non-dominated-sorting-genetic-algorithm.html)
##### [强度 Pareto 演化算法（SPEA）](/ai-algorithms/optimization/fundamentals/genetic-algorithms/strength-pareto-evolution-algorithm.html)

### 进化策略（Evolution Strategies）
#### 基础范式
##### [进化策略（ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/evolution-strategies.html)
##### [(1+1)-进化策略（(1+1)-ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/one-plus-one-evolution-strategy.html)
##### [(μ+1)-进化策略（(μ+1)-ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/mu-plus-one-evolution-strategy.html)
##### [(μ,λ)-进化策略（(μ,λ)-ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/mu-comma-lambda-evolution-strategy.html)
##### [(μ+λ)-进化策略（(μ+λ)-ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/mu-plus-lambda-evolution-strategy.html)
##### [(μ/ρ +, λ)-进化策略（(μ/ρ +, λ)-ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/mu-slash-rho-plus-lambda-evolution-strategy.html)
#### 自适应与高级变体
##### [自适应进化策略（SA-ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/self-adaptive-evolution-strategy.html)
##### [自然进化策略（NES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/natural-evolution-strategy.html)
##### [协方差矩阵自适应进化策略（CMA-ES）](/ai-algorithms/optimization/fundamentals/evolution-strategies/covariance-matrix-adaptation-evolution-strategy.html)

### 进化规划（Evolutionary Programming）
#### 基础条目
##### [进化规划（EP）](/ai-algorithms/optimization/fundamentals/evolutionary-algorithms/evolutionary-programming.html)

### 差分进化（Differential Evolution）
#### 基础策略
##### [DE/rand/1/bin](/ai-algorithms/optimization/fundamentals/differential-evolution/de-rand-1-bin.html)
##### [DE/rand/1/exp](/ai-algorithms/optimization/fundamentals/differential-evolution/de-rand-1-exp.html)
##### [DE/best/1/bin](/ai-algorithms/optimization/fundamentals/differential-evolution/de-best-1-bin.html)
##### [DE/best/1/z](/ai-algorithms/optimization/fundamentals/differential-evolution/de-best-1-z.html)
##### [DE/current-to-rand/1](/ai-algorithms/optimization/fundamentals/differential-evolution/de-current-to-rand-1.html)
#### 自适应与复合扩展
##### [自适应差分进化（ADE）](/ai-algorithms/optimization/fundamentals/differential-evolution/adaptive-differential-evolution.html)
##### [自适应差分进化（参数自适应，SaDE）](/ai-algorithms/optimization/fundamentals/differential-evolution/self-adaptive-differential-evolution.html)
##### [具有可选外部档案的自适应差分进化（JADE）](/ai-algorithms/optimization/fundamentals/differential-evolution/adaptive-differential-evolution-with-optional-external-archive.html)
##### [复合差分进化（CoDE）](/ai-algorithms/optimization/fundamentals/differential-evolution/composite-differential-evolution.html)

### 分布估计算法（EDAs）
#### 单变量与紧凑模型
##### [单变量边缘分布算法（UMDA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/univariate-marginal-distribution-algorithm.html)
##### [基于种群的增量学习（PBIL）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/population-based-incremental-learning.html)
##### [紧凑遗传算法（cGA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/compact-genetic-algorithm.html)
##### [交叉熵方法（CEM）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/cross-entropy-method.html)
#### 多变量与结构学习
##### [双变量边缘分布算法（BMDA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/bivariate-marginal-distribution-algorithm.html)
##### [互信息最大化输入聚类算法（MIMIC）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/mutual-information-maximization-for-input-clustering.html)
##### [因子分解分布算法（FDA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/factorized-distribution-algorithm.html)
##### [扩展紧凑遗传算法（ECGA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/extended-compact-genetic-algorithm.html)
##### [链接树遗传算法（LTGA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/linkage-tree-genetic-algorithm.html)
#### 贝叶斯模型
##### [贝叶斯优化算法（BOA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/bayesian-optimization-algorithm.html)
##### [分层贝叶斯优化算法（hBOA）](/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/hierarchical-bayesian-optimization-algorithm.html)

### 遗传规划（Genetic Programming）
#### 基础结构
##### [遗传规划（GP）](/ai-algorithms/optimization/fundamentals/genetic-programming/genetic-programming.html)
##### [树式遗传规划（TGP）](/ai-algorithms/optimization/fundamentals/genetic-programming/tree-based-genetic-programming.html)
##### [强类型遗传规划（STGP）](/ai-algorithms/optimization/fundamentals/genetic-programming/strongly-typed-genetic-programming.html)
##### [自动函数定义遗传规划（ADF-GP）](/ai-algorithms/optimization/fundamentals/genetic-programming/automatic-function-definition-genetic-programming.html)
#### 语法与线性表示
##### [语法引导遗传规划（GGGP）](/ai-algorithms/optimization/fundamentals/genetic-programming/grammar-guided-genetic-programming.html)
##### [语法演化（GE）](/ai-algorithms/optimization/fundamentals/genetic-programming/grammatical-evolution.html)
##### [线性遗传规划（LGP）](/ai-algorithms/optimization/fundamentals/genetic-programming/linear-genetic-programming.html)
##### [笛卡尔遗传规划（CGP）](/ai-algorithms/optimization/fundamentals/genetic-programming/cartesian-genetic-programming.html)
#### 其他表达形式
##### [基因表达式编程（GEP）](/ai-algorithms/optimization/fundamentals/genetic-programming/gene-expression-programming.html)
##### [多表达式编程（MEP）](/ai-algorithms/optimization/fundamentals/genetic-programming/multi-expression-programming.html)
##### [基于栈的遗传规划（SBGP）](/ai-algorithms/optimization/fundamentals/genetic-programming/stack-based-genetic-programming.html)
##### [遗传网络规划（GNP）](/ai-algorithms/optimization/fundamentals/genetic-programming/genetic-network-programming.html)

### 小生境遗传算法（Niching Genetic Algorithms）
#### 拥挤与选择机制
##### [拥挤因子法（CF）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/crowding-factor.html)
##### [确定性拥挤法（DC）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/deterministic-crowding.html)
##### [概率拥挤法（PC）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/probabilistic-crowding.html)
##### [受限锦标赛选择拥挤法（RTS）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/restricted-tournament-selection.html)
#### 共享与清除机制
##### [适应度共享（FS）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/fitness-sharing.html)
##### [清除法（CGA）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/clearing.html)
##### [序贯小生境法（SN）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/sequential-niching.html)
##### [动态小生境共享（DNS）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/dynamic-niche-sharing.html)
##### [动态小生境聚类（DNC）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/dynamic-niche-clustering.html)
##### [小生境半径自适应（NRA）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/niche-radius-adaptation.html)
##### [协同进化共享小生境（CSN）](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/coevolutionary-shared-niching.html)

## 群体智能类

### 粒子群优化（PSO）
#### 标准模型与拓扑
##### [标准粒子群优化（SPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/standard-particle-swarm-optimization.html)
##### [全局最优粒子群优化（GBPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/global-best-particle-swarm-optimization.html)
##### [局部最优粒子群优化（LBPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/local-best-particle-swarm-optimization.html)
#### 参数控制机制
##### [惯性权重粒子群优化（IWPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/inertia-weight-particle-swarm-optimization.html)
##### [收缩因子粒子群优化（CFPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/constriction-factor-particle-swarm-optimization.html)
##### [速度限制粒子群优化（VCPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/velocity-clamping-particle-swarm-optimization.html)
##### [裸粒子群优化（BBPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/bare-bones-particle-swarm-optimization.html)
##### [自适应粒子群优化（APSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/adaptive-particle-swarm-optimization.html)
#### 离散与多群体扩展
##### [二进制粒子群优化（BPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/binary-particle-swarm-optimization.html)
##### [离散粒子群优化（DPSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/discrete-particle-swarm-optimization.html)
##### [动态多群粒子群优化器（DMS-PSO）](/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/dynamic-multi-swarm-particle-swarm-optimizer.html)

### 蚁群优化（ACO）
#### 经典蚁群系统族
##### [蚂蚁系统（AS）](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/ant-system.html)
##### [精英蚁群系统（EAS）](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/elitist-ant-system.html)
##### [基于排序的蚁群系统（RBAS）](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/rank-based-ant-system.html)
##### [最大-最小蚁群系统（MMAS）](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/max-min-ant-system.html)
##### [最优-最劣蚁群系统（BWAS）](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/best-worst-ant-system.html)
##### [蚁群系统（ACS）](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/ant-colony-system.html)
#### 扩展与融合
##### [快速蚁群系统（FANT）](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/fast-ant-system.html)
##### [Ant-Q](/ai-algorithms/optimization/fundamentals/ant-colony-optimization/ant-q.html)

### 其他群智能算法
#### 蜂群与昆虫启发
##### [蜜蜂算法（BeA）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/bees-algorithm.html)
##### [人工蜂群算法（ABC）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/artificial-bee-colony.html)
##### [萤火虫算法（FA）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/firefly-algorithm.html)
##### [蝙蝠算法（BA）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/bat-algorithm.html)
##### [布谷鸟搜索算法（CS）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/cuckoo-search.html)
##### [飞蛾扑火优化算法（MFO）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/moth-flame-optimization.html)
#### 其他群体觅食/围猎机制
##### [细菌觅食优化算法（BFOA）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/bacterial-foraging-optimization-algorithm.html)
##### [灰狼优化算法（GWO）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/grey-wolf-optimizer.html)
##### [鲸鱼优化算法（WOA）](/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/whale-optimization-algorithm.html)

## 人工免疫系统类

### 人工免疫系统（AIS）
#### 基础机制
##### [否定选择算法（NSA）](/ai-algorithms/optimization/fundamentals/artificial-immune-systems/negative-selection-algorithm.html)
##### [克隆选择算法（CLONALG）](/ai-algorithms/optimization/fundamentals/artificial-immune-systems/clonalg.html)
##### [动态克隆选择（DCS）](/ai-algorithms/optimization/fundamentals/artificial-immune-systems/dynamic-clonal-selection.html)
##### [免疫网络算法（INA）](/ai-algorithms/optimization/fundamentals/artificial-immune-systems/immune-network-algorithm.html)
#### 识别与检测扩展
##### [人工免疫识别系统（AIRS）](/ai-algorithms/optimization/fundamentals/artificial-immune-systems/artificial-immune-recognition-system.html)
##### [树突状细胞算法（DCA）](/ai-algorithms/optimization/fundamentals/artificial-immune-systems/dendritic-cell-algorithm.html)

## 新颖性搜索与质量多样性

### 新颖性搜索（Novelty Search）
#### 新颖性驱动搜索
##### [新颖性搜索算法（NS）](/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/novelty-search-algorithm.html)
##### [带局部竞争的新颖性搜索（NSLC）](/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/novelty-search-with-local-competition.html)
##### [兼顾质量的新颖性搜索（NSQ）](/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/novelty-search-with-quality.html)
##### [约束新颖性搜索（CNS）](/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/constrained-novelty-search.html)
#### 质量多样性（QD）
##### [表型精英多维档案（MAP-Elites）](/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/map-elites.html)
##### [照明算法（IA）](/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/illumination-algorithm.html)

## 随机搜索与局部搜索类

### 随机优化算法（Stochastic Optimization）
#### 随机搜索与爬山
##### [随机搜索（RS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/random-search.html)
##### [自适应随机搜索（ARS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/adaptive-random-search.html)
##### [随机爬山算法（SHC）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/stochastic-hill-climbing.html)
##### [带随机重启的随机爬山算法（SHCR）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/stochastic-hill-climbing-with-random-restarts.html)
#### 禁忌与迭代局部搜索
##### [禁忌搜索（TS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/tabu-search.html)
##### [反应式禁忌搜索（RTS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/reactive-tabu-search.html)
##### [迭代局部搜索（ILS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/iterated-local-search.html)
##### [变邻域搜索（VNS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/variable-neighborhood-search.html)
##### [引导式局部搜索（GLS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/guided-local-search.html)
#### 构造式与参考集方法
##### [贪婪随机自适应搜索（GRASP）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/greedy-randomized-adaptive-search.html)
##### [分散搜索（SS）](/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/scatter-search.html)

## 物理 / 文化 / 混合启发类

### 物理启发优化算法
#### 经典物理或过程启发
##### [模拟退火（SA）](/ai-algorithms/optimization/fundamentals/physical-optimization-algorithms/simulated-annealing.html)
##### [极值优化（EO）](/ai-algorithms/optimization/fundamentals/physical-optimization-algorithms/extremal-optimization.html)
##### [和声搜索（HS）](/ai-algorithms/optimization/fundamentals/physical-optimization-algorithms/harmony-search.html)
#### 社会文化与混合范式
##### [文化算法（CA）](/ai-algorithms/optimization/fundamentals/physical-optimization-algorithms/cultural-algorithm.html)
##### [模因算法（MA）](/ai-algorithms/optimization/fundamentals/physical-optimization-algorithms/memetic-algorithm.html)
```
