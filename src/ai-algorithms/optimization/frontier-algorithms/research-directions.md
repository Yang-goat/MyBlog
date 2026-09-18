---
redirectFrom:
  - "/ai-ml/optimization/research-directions/"
  - "/ai-ml/optimization/research-directions/overview.html"
  - "/ai-ml/optimization/papers/research-directions.html"
title: 优化研究方向思维导图
icon: sitemap
date: 2026-09-18
order: 1
category:
  - 智能优化算法
---

# 优化研究方向思维导图

优化研究方向围绕目标、约束、评价成本与环境变化等问题特征，研究搜索方法的适用条件和改进机制。

本图用于理解研究问题之间的关系；文章按所属板块存放，相关方法在正文中引用。按算法来源浏览可见[算法家族思维导图](../fundamentals/algorithm-family-map.md)；具体方法见[前沿算法与框架](./)，实验资料见[基准测试与竞赛](../benchmarks/)。

```markmap
---
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---
# 智能优化研究方向
## 问题结构与目标
### 约束优化
#### 可行性维护、约束处理
### 多目标与高维多目标优化
#### [多目标基础与算法](/ai-algorithms/foundations/problem-cases/multi-objective-optimization/)
### 大规模优化
#### 变量分组、协同进化、降维
### 多峰优化与质量多样性
#### [小生境方法](/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/)
#### [新颖性搜索](/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/)
### 离散、组合与混合变量优化
### 双层优化
## 评价成本与信息条件
### 昂贵黑箱优化
#### 代理模型辅助搜索
#### 贝叶斯优化
### 多保真优化
#### 精度、成本与评价资源分配
### 噪声与鲁棒优化
### 动态与在线优化
## 学习与求解机制
### 迁移优化与多任务优化
### 学习辅助搜索
#### 强化学习控制、学习算子
### 自动算法设计与配置
### 混合搜索与协同求解
#### 全局与局部搜索、算法组合
```

## 如何理解不同研究维度

| 论文特征 | 问题方向 | 方法机制 |
| --- | --- | --- |
| 用代理模型减少带约束仿真的调用 | 昂贵优化、约束优化 | 代理模型、可行性预测 |
| 按变量组协同搜索高维解 | 大规模优化 | 协同进化、变量分组 |
| 从相关任务迁移经验来求解多个目标 | 多目标优化、迁移优化 | 知识迁移、多任务 |

算法名称不必成为新的研究方向。新论文先确定所解决的问题，再分析采用的机制；没有文章的方向暂留在导图中，避免产生大量空目录。

已有的[多目标优化专题](/ai-algorithms/foundations/problem-cases/multi-objective-optimization/)保留原有链接，作为这个索引的一部分。每周阅读过程见[论文随笔](/paper-notes/)。

## 分类依据

本页参考以下会议主题组织阅读维度，不照搬会议分会场作为固定目录：

- [GECCO 2026：演化数值优化主题](https://gecco-2026.sigevo.org/Track?itemId=55)，涵盖约束、大规模、预算限制、多峰、噪声和代理模型等问题。
- [GECCO 2026：研究轨道](https://gecco-2026.sigevo.org/Tracks)，用于对照演化多目标优化、组合优化与算法设计等主题。
