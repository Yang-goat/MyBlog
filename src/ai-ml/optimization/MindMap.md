---
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

叶子节点可直接点击进入对应算法文章。

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
##### [遗传算法（GA）](/ai-ml/optimization/genetic-algorithms/genetic_algorithm.html)
##### [排序选择遗传算法（RSGA）](/ai-ml/optimization/genetic-algorithms/ranked_selection_genetic_algorithm.html)
##### [适应度缩放遗传算法（FSGA）](/ai-ml/optimization/genetic-algorithms/fitness_scaling_genetic_algorithm.html)
##### [稳态遗传算法（SSGA）](/ai-ml/optimization/genetic-algorithms/steady_state_genetic_algorithm.html)
##### [精英遗传算法（EGA）](/ai-ml/optimization/genetic-algorithms/elitist_genetic_algorithm.html)
##### [实数编码遗传算法（RCGA）](/ai-ml/optimization/genetic-algorithms/real_coded_genetic_algorithm.html)
#### 种群结构与编码扩展
##### [微型遗传算法（μGA）](/ai-ml/optimization/genetic-algorithms/micro_genetic_algorithm.html)
##### [元胞遗传算法（CGA）](/ai-ml/optimization/genetic-algorithms/cellular_genetic_algorithm.html)
##### [岛屿遗传算法（IGA）](/ai-ml/optimization/genetic-algorithms/island_genetic_algorithms.html)
##### [杂乱遗传算法（Messy GA）](/ai-ml/optimization/genetic-algorithms/messy_genetic_algorithm.html)
#### 系统扩展与多目标
##### [学习分类器系统（LCS）](/ai-ml/optimization/genetic-algorithms/learning_classifier_system.html)
##### [非支配排序遗传算法（NSGA）](/ai-ml/optimization/genetic-algorithms/non_dominated_sorting_genetic_algorithm.html)
##### [强度 Pareto 演化算法（SPEA）](/ai-ml/optimization/genetic-algorithms/strength_pareto_evolution_algorithm.html)

### 进化策略（Evolution Strategies）
#### 基础范式
##### [进化策略（ES）](/ai-ml/optimization/evolution-strategies/evolution_strategies.html)
##### [(1+1)-进化策略（(1+1)-ES）](/ai-ml/optimization/evolution-strategies/one_plus_one_evolution_strategy.html)
##### [(μ+1)-进化策略（(μ+1)-ES）](/ai-ml/optimization/evolution-strategies/mu_plus_one_evolution_strategy.html)
##### [(μ,λ)-进化策略（(μ,λ)-ES）](/ai-ml/optimization/evolution-strategies/mu_comma_lambda_evolution_strategy.html)
##### [(μ+λ)-进化策略（(μ+λ)-ES）](/ai-ml/optimization/evolution-strategies/mu_plus_lambda_evolution_strategy.html)
##### [(μ/ρ +, λ)-进化策略（(μ/ρ +, λ)-ES）](/ai-ml/optimization/evolution-strategies/mu_slash_rho_plus_lambda_evolution_strategy.html)
#### 自适应与高级变体
##### [自适应进化策略（SA-ES）](/ai-ml/optimization/evolution-strategies/self_adaptive_evolution_strategy.html)
##### [自然进化策略（NES）](/ai-ml/optimization/evolution-strategies/natural_evolution_strategy.html)
##### [协方差矩阵自适应进化策略（CMA-ES）](/ai-ml/optimization/evolution-strategies/covariance_matrix_adaptation_evolution_strategy.html)

### 进化规划（Evolutionary Programming）
#### 基础条目
##### [进化规划（EP）](/ai-ml/optimization/evolutionary-algorithms/evolutionary_programming.html)

### 差分进化（Differential Evolution）
#### 基础策略
##### [DE/rand/1/bin](/ai-ml/optimization/differential-evolution/de_rand_1_bin.html)
##### [DE/rand/1/exp](/ai-ml/optimization/differential-evolution/de_rand_1_exp.html)
##### [DE/best/1/bin](/ai-ml/optimization/differential-evolution/de_best_1_bin.html)
##### [DE/best/1/z](/ai-ml/optimization/differential-evolution/de_best_1_z.html)
##### [DE/current-to-rand/1](/ai-ml/optimization/differential-evolution/de_current_to_rand_1.html)
#### 自适应与复合扩展
##### [自适应差分进化（ADE）](/ai-ml/optimization/differential-evolution/adaptive_differential_evolution.html)
##### [自适应差分进化（参数自适应，SaDE）](/ai-ml/optimization/differential-evolution/self_adaptive_differential_evolution.html)
##### [具有可选外部档案的自适应差分进化（JADE）](/ai-ml/optimization/differential-evolution/adaptive_differential_evolution_with_optional_external_archive.html)
##### [复合差分进化（CoDE）](/ai-ml/optimization/differential-evolution/composite_differential_evolution.html)

### 分布估计算法（EDAs）
#### 单变量与紧凑模型
##### [单变量边缘分布算法（UMDA）](/ai-ml/optimization/estimation-of-distribution-algorithms/univariate_marginal_distribution_algorithm.html)
##### [基于种群的增量学习（PBIL）](/ai-ml/optimization/estimation-of-distribution-algorithms/population_based_incremental_learning.html)
##### [紧凑遗传算法（cGA）](/ai-ml/optimization/estimation-of-distribution-algorithms/compact_genetic_algorithm.html)
##### [交叉熵方法（CEM）](/ai-ml/optimization/estimation-of-distribution-algorithms/cross_entropy_method.html)
#### 多变量与结构学习
##### [双变量边缘分布算法（BMDA）](/ai-ml/optimization/estimation-of-distribution-algorithms/bivariate_marginal_distribution_algorithm.html)
##### [互信息最大化输入聚类算法（MIMIC）](/ai-ml/optimization/estimation-of-distribution-algorithms/mutual_information_maximization_for_input_clustering.html)
##### [因子分解分布算法（FDA）](/ai-ml/optimization/estimation-of-distribution-algorithms/factorized_distribution_algorithm.html)
##### [扩展紧凑遗传算法（ECGA）](/ai-ml/optimization/estimation-of-distribution-algorithms/extended_compact_genetic_algorithm.html)
##### [链接树遗传算法（LTGA）](/ai-ml/optimization/estimation-of-distribution-algorithms/linkage_tree_genetic_algorithm.html)
#### 贝叶斯模型
##### [贝叶斯优化算法（BOA）](/ai-ml/optimization/estimation-of-distribution-algorithms/bayesian_optimization_algorithm.html)
##### [分层贝叶斯优化算法（hBOA）](/ai-ml/optimization/estimation-of-distribution-algorithms/hierarchical_bayesian_optimization_algorithm.html)

### 遗传规划（Genetic Programming）
#### 基础结构
##### [遗传规划（GP）](/ai-ml/optimization/genetic-programming/genetic_programming.html)
##### [树式遗传规划（TGP）](/ai-ml/optimization/genetic-programming/tree_based_genetic_programming.html)
##### [强类型遗传规划（STGP）](/ai-ml/optimization/genetic-programming/strongly_typed_genetic_programming.html)
##### [自动函数定义遗传规划（ADF-GP）](/ai-ml/optimization/genetic-programming/automatic_function_definition_genetic_programming.html)
#### 语法与线性表示
##### [语法引导遗传规划（GGGP）](/ai-ml/optimization/genetic-programming/grammar_guided_genetic_programming.html)
##### [语法演化（GE）](/ai-ml/optimization/genetic-programming/grammatical_evolution.html)
##### [线性遗传规划（LGP）](/ai-ml/optimization/genetic-programming/linear_genetic_programming.html)
##### [笛卡尔遗传规划（CGP）](/ai-ml/optimization/genetic-programming/cartesian_genetic_programming.html)
#### 其他表达形式
##### [基因表达式编程（GEP）](/ai-ml/optimization/genetic-programming/gene_expression_programming.html)
##### [多表达式编程（MEP）](/ai-ml/optimization/genetic-programming/multi_expression_programming.html)
##### [基于栈的遗传规划（SBGP）](/ai-ml/optimization/genetic-programming/stack_based_genetic_programming.html)
##### [遗传网络规划（GNP）](/ai-ml/optimization/genetic-programming/genetic_network_programming.html)

### 小生境遗传算法（Niching Genetic Algorithms）
#### 拥挤与选择机制
##### [拥挤因子法（CF）](/ai-ml/optimization/niching-genetic-algorithms/crowding_factor.html)
##### [确定性拥挤法（DC）](/ai-ml/optimization/niching-genetic-algorithms/deterministic_crowding.html)
##### [概率拥挤法（PC）](/ai-ml/optimization/niching-genetic-algorithms/probabilistic_crowding.html)
##### [受限锦标赛选择拥挤法（RTS）](/ai-ml/optimization/niching-genetic-algorithms/restricted_tournament_selection.html)
#### 共享与清除机制
##### [适应度共享（FS）](/ai-ml/optimization/niching-genetic-algorithms/fitness_sharing.html)
##### [清除法（CGA）](/ai-ml/optimization/niching-genetic-algorithms/clearing.html)
##### [序贯小生境法（SN）](/ai-ml/optimization/niching-genetic-algorithms/sequential_niching.html)
##### [动态小生境共享（DNS）](/ai-ml/optimization/niching-genetic-algorithms/dynamic_niche_sharing.html)
##### [动态小生境聚类（DNC）](/ai-ml/optimization/niching-genetic-algorithms/dynamic_niche_clustering.html)
##### [小生境半径自适应（NRA）](/ai-ml/optimization/niching-genetic-algorithms/niche_radius_adaptation.html)
##### [协同进化共享小生境（CSN）](/ai-ml/optimization/niching-genetic-algorithms/coevolutionary_shared_niching.html)

## 群体智能类

### 粒子群优化（PSO）
#### 标准模型与拓扑
##### [标准粒子群优化（SPSO）](/ai-ml/optimization/particle-swarm-optimization/standard_particle_swarm_optimization.html)
##### [全局最优粒子群优化（GBPSO）](/ai-ml/optimization/particle-swarm-optimization/global_best_particle_swarm_optimization.html)
##### [局部最优粒子群优化（LBPSO）](/ai-ml/optimization/particle-swarm-optimization/local_best_particle_swarm_optimization.html)
#### 参数控制机制
##### [惯性权重粒子群优化（IWPSO）](/ai-ml/optimization/particle-swarm-optimization/inertia_weight_particle_swarm_optimization.html)
##### [收缩因子粒子群优化（CFPSO）](/ai-ml/optimization/particle-swarm-optimization/constriction_factor_particle_swarm_optimization.html)
##### [速度限制粒子群优化（VCPSO）](/ai-ml/optimization/particle-swarm-optimization/velocity_clamping_particle_swarm_optimization.html)
##### [裸粒子群优化（BBPSO）](/ai-ml/optimization/particle-swarm-optimization/bare_bones_particle_swarm_optimization.html)
##### [自适应粒子群优化（APSO）](/ai-ml/optimization/particle-swarm-optimization/adaptive_particle_swarm_optimization.html)
#### 离散与多群体扩展
##### [二进制粒子群优化（BPSO）](/ai-ml/optimization/particle-swarm-optimization/binary_particle_swarm_optimization.html)
##### [离散粒子群优化（DPSO）](/ai-ml/optimization/particle-swarm-optimization/discrete_particle_swarm_optimization.html)
##### [动态多群粒子群优化器（DMS-PSO）](/ai-ml/optimization/particle-swarm-optimization/dynamic_multi_swarm_particle_swarm_optimizer.html)

### 蚁群优化（ACO）
#### 经典蚁群系统族
##### [蚂蚁系统（AS）](/ai-ml/optimization/ant-colony-optimization/ant_system.html)
##### [精英蚁群系统（EAS）](/ai-ml/optimization/ant-colony-optimization/elitist_ant_system.html)
##### [基于排序的蚁群系统（RBAS）](/ai-ml/optimization/ant-colony-optimization/rank_based_ant_system.html)
##### [最大-最小蚁群系统（MMAS）](/ai-ml/optimization/ant-colony-optimization/max_min_ant_system.html)
##### [最优-最劣蚁群系统（BWAS）](/ai-ml/optimization/ant-colony-optimization/best_worst_ant_system.html)
##### [蚁群系统（ACS）](/ai-ml/optimization/ant-colony-optimization/ant_colony_system.html)
#### 扩展与融合
##### [快速蚁群系统（FANT）](/ai-ml/optimization/ant-colony-optimization/fast_ant_system.html)
##### [Ant-Q](/ai-ml/optimization/ant-colony-optimization/ant_q.html)

### 其他群智能算法
#### 蜂群与昆虫启发
##### [蜜蜂算法（BeA）](/ai-ml/optimization/swarm-intelligence-algorithms/bees_algorithm.html)
##### [人工蜂群算法（ABC）](/ai-ml/optimization/swarm-intelligence-algorithms/artificial_bee_colony.html)
##### [萤火虫算法（FA）](/ai-ml/optimization/swarm-intelligence-algorithms/firefly_algorithm.html)
##### [蝙蝠算法（BA）](/ai-ml/optimization/swarm-intelligence-algorithms/bat_algorithm.html)
##### [布谷鸟搜索算法（CS）](/ai-ml/optimization/swarm-intelligence-algorithms/cuckoo_search.html)
##### [飞蛾扑火优化算法（MFO）](/ai-ml/optimization/swarm-intelligence-algorithms/moth_flame_optimization.html)
#### 其他群体觅食/围猎机制
##### [细菌觅食优化算法（BFOA）](/ai-ml/optimization/swarm-intelligence-algorithms/bacterial_foraging_optimization_algorithm.html)
##### [灰狼优化算法（GWO）](/ai-ml/optimization/swarm-intelligence-algorithms/grey_wolf_optimizer.html)
##### [鲸鱼优化算法（WOA）](/ai-ml/optimization/swarm-intelligence-algorithms/whale_optimization_algorithm.html)

## 人工免疫系统类

### 人工免疫系统（AIS）
#### 基础机制
##### [否定选择算法（NSA）](/ai-ml/optimization/artificial-immune-systems/negative_selection_algorithm.html)
##### [克隆选择算法（CLONALG）](/ai-ml/optimization/artificial-immune-systems/clonalg.html)
##### [动态克隆选择（DCS）](/ai-ml/optimization/artificial-immune-systems/dynamic_clonal_selection.html)
##### [免疫网络算法（INA）](/ai-ml/optimization/artificial-immune-systems/immune_network_algorithm.html)
#### 识别与检测扩展
##### [人工免疫识别系统（AIRS）](/ai-ml/optimization/artificial-immune-systems/artificial_immune_recognition_system.html)
##### [树突状细胞算法（DCA）](/ai-ml/optimization/artificial-immune-systems/dendritic_cell_algorithm.html)

## 新颖性搜索与质量多样性

### 新颖性搜索（Novelty Search）
#### 新颖性驱动搜索
##### [新颖性搜索算法（NS）](/ai-ml/optimization/novelty-search-algorithms/novelty_search_algorithm.html)
##### [带局部竞争的新颖性搜索（NSLC）](/ai-ml/optimization/novelty-search-algorithms/novelty_search_with_local_competition.html)
##### [兼顾质量的新颖性搜索（NSQ）](/ai-ml/optimization/novelty-search-algorithms/novelty_search_with_quality.html)
##### [约束新颖性搜索（CNS）](/ai-ml/optimization/novelty-search-algorithms/constrained_novelty_search.html)
#### 质量多样性（QD）
##### [表型精英多维档案（MAP-Elites）](/ai-ml/optimization/novelty-search-algorithms/map_elites.html)
##### [照明算法（IA）](/ai-ml/optimization/novelty-search-algorithms/illumination_algorithm.html)

## 随机搜索与局部搜索类

### 随机优化算法（Stochastic Optimization）
#### 随机搜索与爬山
##### [随机搜索（RS）](/ai-ml/optimization/stochastic-optimization-algorithms/random_search.html)
##### [自适应随机搜索（ARS）](/ai-ml/optimization/stochastic-optimization-algorithms/adaptive_random_search.html)
##### [随机爬山算法（SHC）](/ai-ml/optimization/stochastic-optimization-algorithms/stochastic_hill_climbing.html)
##### [带随机重启的随机爬山算法（SHCR）](/ai-ml/optimization/stochastic-optimization-algorithms/stochastic_hill_climbing_with_random_restarts.html)
#### 禁忌与迭代局部搜索
##### [禁忌搜索（TS）](/ai-ml/optimization/stochastic-optimization-algorithms/tabu_search.html)
##### [反应式禁忌搜索（RTS）](/ai-ml/optimization/stochastic-optimization-algorithms/reactive_tabu_search.html)
##### [迭代局部搜索（ILS）](/ai-ml/optimization/stochastic-optimization-algorithms/iterated_local_search.html)
##### [变邻域搜索（VNS）](/ai-ml/optimization/stochastic-optimization-algorithms/variable_neighborhood_search.html)
##### [引导式局部搜索（GLS）](/ai-ml/optimization/stochastic-optimization-algorithms/guided_local_search.html)
#### 构造式与参考集方法
##### [贪婪随机自适应搜索（GRASP）](/ai-ml/optimization/stochastic-optimization-algorithms/greedy_randomized_adaptive_search.html)
##### [分散搜索（SS）](/ai-ml/optimization/stochastic-optimization-algorithms/scatter_search.html)

## 物理 / 文化 / 混合启发类

### 物理启发优化算法
#### 经典物理或过程启发
##### [模拟退火（SA）](/ai-ml/optimization/physical-optimization-algorithms/simulated_annealing.html)
##### [极值优化（EO）](/ai-ml/optimization/physical-optimization-algorithms/extremal_optimization.html)
##### [和声搜索（HS）](/ai-ml/optimization/physical-optimization-algorithms/harmony_search.html)
#### 社会文化与混合范式
##### [文化算法（CA）](/ai-ml/optimization/physical-optimization-algorithms/cultural_algorithm.html)
##### [模因算法（MA）](/ai-ml/optimization/physical-optimization-algorithms/memetic_algorithm.html)
```
