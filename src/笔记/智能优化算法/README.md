---
title: 智能优化算法指南
icon: book
index: false
article: false
---

## 简介

智能优化算法指一类**无需目标函数解析信息（或仅用零/少量信息）**、基于启发式/随机搜索的优化方法：包括遗传/进化算法、群智能（PSO、ACO）、局部搜索/模拟退火、以及现代的代理/贝叶斯优化和神经进化等。它们适用于黑盒、昂贵、非凸、组合或多目标问题。

## 典型算法分类（含代表算法）

**1. 进化算法 / 遗传类（Evolutionary Algorithms, EAs）**
- 代表：Genetic Algorithms (GA)、Evolution Strategies (ES)、Genetic Programming (GP)、Differential Evolution (DE)。DE 在实值优化方面尤其重要。

**2. 群体智能 / Swarm Intelligence**
- 代表：Particle Swarm Optimization (PSO)、Ant Colony Optimization (ACO)、Artificial Bee Colony (ABC)。

**3. 局部搜索 / 单点启发式**
- 代表：Simulated Annealing、Tabu Search、Iterated Local Search、Variable Neighborhood Search。

**4. 基于模型 / 代理辅助的优化（Surrogate- / Model-based）**
- 代表：Surrogate-Assisted Evolutionary Algorithms（用于昂贵函数评估）与混合代理策略。近年来专门综述很多。

**5. 贝叶斯优化（Bayesian Optimization, BO）与高效采样**
- 代表：基于高斯过程的 BO、可扩展 BO（高维/多任务/并行/分布式 BO）。BO 在昂贵黑盒优化（机器学习超参、材料发现）非常流行。

**6. 多目标优化（MOO / MOEAs）**
- 代表：NSGA-II/III、MOEA/D、SPEA2 等。用于同时优化多个冲突目标（工程设计、建筑性能等）。

**7. 混合与超启发式（Hybrid & Hyper-heuristics）**
- 把全局搜索与局部优化、代理与真实评估结合，或自动选择/产生启发式规则。

**8. 神经进化 / Neuroevolution & RL for optimization** 
- 用进化方法直接进化神经网络结构/权重（例如 NEAT、神经架构搜索的进化方法），或把 RL 用作优化器/候选生成器。

<Catalog />
