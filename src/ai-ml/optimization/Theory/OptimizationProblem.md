---
icon: layer-group
date: 2025-10-22
category:
  - 智能优化算法
tag:
  - 导论
---

# 优化问题的分类

| 优化问题类型                                        | 典型基准问题 / 模型                                                                                                                                                      | 主要研究方向                                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **连续优化（Continuous Optimization）**             | - Sphere 函数：$f(x)=\sum x_i^2$<br>- Rosenbrock 函数：$f(x)=(1-x_1)^2+100(x_2-x_1^2)^2$<br>- Rastrigin、Ackley、Griewank、Schwefel 函数<br>- CEC系列连续测试集（CEC2005/2013/2017） | - 高维连续优化（10–100维）<br>- 非凸、多峰函数优化<br>- 旋转/偏移不变性研究<br>- 混合函数与复杂景观分析            |
| **组合优化（Combinatorial Optimization）**          | - 旅行商问题（TSP）<br>- 背包问题（Knapsack）<br>- 作业车间调度（JSSP）<br>- 车辆路径问题（VRP）<br>- 图着色问题（Graph Coloring）                                                                   | - 离散编码设计与邻域搜索<br>- 混合群智能算法（如GA+ACO）<br>- 大规模与动态调度优化<br>- 元启发式的多任务迁移优化        |
| **约束优化（Constrained Optimization）**            | - 压力容器设计<br>- 悬臂梁设计<br>- 焊接梁设计<br>- CEC2010/2020约束测试集                                                                                                            | - 约束处理策略（惩罚函数、Deb规则、修复策略）<br>- 可行性保持与动态罚项调节<br>- 混合差分进化（DE）与CMA-ES算法         |
| **多目标优化（Multi-objective Optimization, MOO）**  | - ZDT系列（ZDT1–ZDT6）<br>- DTLZ系列（DTLZ1–DTLZ7）<br>- WFG系列（WFG1–WFG9）<br>- CEC多目标优化测试集                                                                               | - 帕累托前沿近似与分布性分析<br>- NSGA-II、MOEA/D及其改进算法<br>- 高维多目标（>10目标）优化<br>- 决策偏好与交互优化 |
| **动态优化（Dynamic Optimization）**                | - 动态TSP（DTSP）<br>- Moving Peak Benchmark (MPB)<br>- 动态约束优化问题（DOPs）                                                                                               | - 环境变化检测与预测<br>- 多种群与记忆机制<br>- 自适应学习与转移优化<br>- 在线优化与持续学习                     |
| **鲁棒/随机优化（Robust & Stochastic Optimization）** | - 不确定参数线性/非线性规划<br>- 随机TSP / 随机VRP<br>- 鲁棒设计问题                                                                                                                   | - 鲁棒性建模与期望最优策略<br>- 随机场景采样与分布式优化<br>- 不确定性建模与贝叶斯优化                           |
| **混合整数优化（Mixed Integer Optimization）**        | - 混合整数规划（MIP）<br>- 混合Job Shop问题<br>- 能源调度优化                                                                                                                      | - 连续与离散变量协同优化<br>- 混合编码与约束修复机制<br>- 智能电网与微电网调度优化                             |
| **工程优化（Engineering Optimization）**            | - 容器设计、梁结构优化<br>- 天线阵列优化<br>- PID参数整定<br>- 机械结构与控制系统设计                                                                                                           | - 工程约束处理与可行性修复<br>- 多学科优化（MDO）<br>- 基于仿真的黑盒优化                                |
| **数据与机器学习优化（ML-related Optimization）**        | - 特征选择 / 特征子集优化<br>- 聚类优化（K-means改进）<br>- 超参数优化 / 神经结构搜索（NAS）                                                                                                    | - 黑盒高维优化算法<br>- 基于梯度与元启发式的结合<br>- 自适应采样与代理模型优化                               |
| **复杂混合优化（Hybrid & Multi-type Optimization）**  | - CEC混合测试函数<br>- 组合+连续混合设计问题<br>- 动态多目标约束问题                                                                                                                      | - 多层次优化（分解策略）<br>- 多算法协同与迁移学习<br>- 算法框架统一化（如Auto-EA）                         |

[多目标优化的ZDT基准问题详细介绍](https://blog.csdn.net/a1920993165/article/details/112661010)


## 附注：常用标准测试库与竞赛平台

| 测试库 / 平台                                             | 组织       | 特点                 |
| ---------------------------------------------------- | -------- | ------------------ |
| **CEC系列（IEEE Congress on Evolutionary Computation）** | IEEE CIS | 连续、约束、多目标、动态等标准测试集 |
| **BBOB / COCO平台**                                    | GECCO社区  | 黑盒优化标准化平台          |
| **Moving Peaks Benchmark (MPB)**                     | Branke等人 | 动态环境标准模型           |
| **WCCI / GECCO Optimization Competitions**           | 国际优化竞赛   | 最新复杂优化基准集合         |
