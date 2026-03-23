---
title: "标准粒子群优化（SPSO）"
date: 2026-03-21
order: 1
category:
  - 智能优化算法
tag:
  - "粒子群优化"
---

# 标准粒子群优化（SPSO）

## 名称

粒子群优化（Particle Swarm Optimization, PSO），粒子群算法（Particle Swarm Algorithm），群体智能优化（Swarm Intelligence Optimization），群优化（Swarm Optimization）

## 分类

> [查看分类思维导图](/ai-ml/optimization/MindMap.html)

粒子群优化是一种基于种群的随机优化技术，其灵感来源于鸟群飞行或鱼群游动等社会行为，属于群体智能领域；而群体智能又隶属于计算智能与生物启发计算的范畴。它与其他群体智能算法，如蚁群优化（ACO）和人工蜂群（ABC）优化，具有密切关联。

- 计算智能
  - 生物启发计算
    - 群体智能
      - 粒子群优化（PSO）
      - 蚁群优化（ACO）
      - 人工蜂群（ABC）优化

## 策略

粒子群优化基于对群居动物社会行为的模拟思想，例如鸟群觅食或鱼群集游。算法维护一个由候选解组成的种群，这些候选解称为粒子。粒子依据自身经验以及整个种群的经验，在搜索空间中不断移动。

### 粒子运动

粒子群中的每个粒子都具有位置和速度两个属性。位置表示优化问题中的一个候选解，速度则决定粒子在搜索空间中移动的方向和幅度。粒子根据其自身已知的最佳位置（个体最优）以及整个群体已知的最佳位置（全局最优）来调整速度。这使得粒子既能够利用自身搜索经验，也能够借鉴群体中其他粒子的搜索经验。

### 群体交互

粒子之间通过共享各自的最优位置信息进行交互。这种社会性信息交流使得整个粒子群能够协同探索搜索空间，并逐步向潜在优良区域收敛。全局最优位置在这一过程中起到吸引子的作用，引导粒子朝向群体当前发现的最有希望的解移动。

### 迭代优化

PSO 的优化过程具有迭代性。在每一次迭代中，粒子依据其个体最优位置和全局最优位置更新速度与位置。速度更新公式通过认知分量和社会分量，在粒子自身经验与群体经验之间实现平衡；随后，位置更新公式利用新的速度将粒子移动到搜索空间中的新位置。

### 收敛与终止

随着迭代进行，粒子会逐步向群体当前找到的最优解附近收敛。当满足预设终止条件时，算法结束，例如达到最大迭代次数或找到质量足够高的解。优化结束时的全局最优位置即为粒子群搜索过程中找到的最佳解。

## 过程

### 数据结构

- 粒子：表示搜索空间中的一个候选解，由位置向量和速度向量构成。
- 粒子群：由多个相互作用并协同搜索最优解的粒子组成的集合。

### 参数

- 种群规模：粒子群中的粒子数量。
- 惯性权重：控制粒子先前速度对当前速度影响程度的参数。
- 认知系数：决定粒子个体最优位置对其速度影响程度的参数。
- 社会系数：决定粒子群全局最优位置对粒子速度影响程度的参数。
- 最大速度：用于限制粒子最大移动速度、避免粒子越过搜索空间关键区域的参数。

### 伪代码

1. 初始化粒子群
    1. 对粒子群中的每个粒子：
        1. 在搜索空间内随机初始化粒子位置
        2. 随机初始化粒子速度
        3. 将粒子的个体最优位置设为其初始位置
    2. 将所有粒子中的最优位置设为全局最优位置
2. 重复执行，直到满足终止条件：
    1. 对粒子群中的每个粒子：
        1. 根据粒子的个体最优位置和全局最优位置更新粒子速度
        2. 利用更新后的速度更新粒子位置
        3. 评估粒子新位置的适应度
        4. 若新位置优于粒子的个体最优位置：
            1. 更新粒子的个体最优位置
            2. 若新位置优于全局最优位置：
                1. 更新全局最优位置
    2. 检查终止条件（如最大迭代次数、期望解质量等）
3. 返回全局最优位置作为最优解

## 注意事项

### 优点

- 简洁性：PSO 实现相对简单，且需要调节的参数较少，因而易于应用于广泛类型的优化问题。
- 收敛速度快：在连续搜索空间问题中，PSO 往往能够较快收敛到较优解。
- 适应性强：PSO 能够适应变化环境，也便于结合问题特定知识或约束进行改造。

### 缺点

- 早熟收敛：在复杂多峰问题中，PSO 可能过早收敛到次优解。
- 多样性不足：随着粒子向全局最优位置聚集，种群可能丧失多样性，从而削弱对搜索空间的探索能力。
- 参数敏感性：PSO 的性能可能对参数设置较为敏感，例如惯性权重以及认知/社会系数等，通常需要针对具体问题仔细调参。

## 启发式建议

### 种群规模

- 可从约 20–50 个粒子的种群规模开始，并根据问题复杂度和可用计算资源进行调整。
- 对于复杂多峰问题，较大的种群通常有助于维持多样性并减轻早熟收敛。

### 惯性权重

- 应选择能够平衡探索与开发的惯性权重，常用范围为 0.4 到 0.9。
- 较大的惯性权重有利于增强探索能力，而较小的惯性权重更有利于开发潜在优良区域。
- 可考虑采用随时间递减的自适应惯性权重策略，以实现从探索向开发的逐步过渡。

### 认知系数与社会系数

- 认知系数和社会系数通常可设置为 2.0 左右，该设置在许多问题中表现较好。
- 应根据问题特征调节认知分量与社会分量之间的平衡。较大的认知系数会鼓励粒子进行个体探索，而较大的社会系数会增强群体协同作用。

### 最大速度

- 可将粒子最大速度限制为搜索空间范围的一定比例（如 10%–20%），以防止粒子越过最优解区域。
- 应根据问题尺度以及所需的探索—开发平衡，适当调整最大速度。

### 终止准则

- 应依据问题复杂度和可用计算资源设置最大迭代次数。
- 还可引入额外终止条件，例如检测收敛状态（如在若干次迭代中改进幅度很小）或达到期望解质量。

### 问题特定改进

- 可将问题特定知识或约束融入粒子表示方式、速度更新公式或位置更新公式中。
- 可采用特殊初始化技术，如对立学习（opposition-based learning）或拟随机序列，以提升初始种群多样性。
- 可结合局部搜索技术，如爬山算法或模拟退火，对 PSO 找到的解进行进一步精细化，从而改善局部最优困境。

## 代码

::: details Show

### Python 粒子群优化

如果你暂时没有思路，下面给出一个使用纯 Python 实现粒子群优化的参考代码。

```python
# AlgorithmAfternoon.com
import random

def objective_function(x, y):
    """ 目标函数 f(x, y) = (1 - x)^2 + 100(y - x^2)^2 """
    return (1 - x) ** 2 + 100 * (y - x ** 2) ** 2

def initialize_particles(num_particles, bounds):
    """ 初始化粒子的位置和速度 """
    particles = []
    for _ in range(num_particles):
        particle = {
            'position': [random.uniform(bounds[dim][0], bounds[dim][1]) for dim in range(len(bounds))],
            'velocity': [random.uniform(-1, 1) for _ in range(len(bounds))],
            'best_position': None,
            'best_cost': float('inf')
        }
        particles.append(particle)
    return particles

def update_velocity(particle, global_best_position, w, c1, c2):
    """ 根据认知分量和社会分量更新速度 """
    for i in range(len(particle['velocity'])):
        cognitive = c1 * random.random() * (particle['best_position'][i] - particle['position'][i])
        social = c2 * random.random() * (global_best_position[i] - particle['position'][i])
        particle['velocity'][i] = w * particle['velocity'][i] + cognitive + social

def update_position(particle, bounds):
    """ 根据速度更新位置，并处理边界约束 """
    for i in range(len(particle['position'])):
        particle['position'][i] += particle['velocity'][i]
        # 保证粒子始终位于边界内
        particle['position'][i] = max(bounds[i][0], min(particle['position'][i], bounds[i][1]))

def particle_swarm_optimization(objective_function, bounds, num_particles, max_iter, w, c1, c2):
    """ 执行粒子群优化 """
    # 初始化粒子
    particles = initialize_particles(num_particles, bounds)
    global_best_position = None
    global_best_cost = float('inf')

    for iteration in range(max_iter):
        for particle in particles:
            # 计算目标函数值
            cost = objective_function(particle['position'][0], particle['position'][1])
            # 更新个体最优
            if cost < particle['best_cost']:
                particle['best_position'] = particle['position'][:]
                particle['best_cost'] = cost
                # 更新全局最优
                if cost < global_best_cost:
                    global_best_position = particle['position'][:]
                    global_best_cost = cost

        # 更新速度和位置
        for particle in particles:
            update_velocity(particle, global_best_position, w, c1, c2)
            update_position(particle, bounds)

        # 输出当前迭代的最优代价
        print(f"Iteration {iteration + 1}: Best Cost = {global_best_cost}")

    return global_best_position, global_best_cost

# 算法参数
bounds = [(-2, 2), (-1, 3)]  # x 和 y 的取值范围
num_particles = 30
max_iter = 100
w = 0.5
c1 = 1.5
c2 = 1.5

# 运行粒子群优化算法
best_position, best_cost = particle_swarm_optimization(objective_function, bounds, num_particles, max_iter, w, c1, c2)
print(f"Best solution: x = {best_position[0]}, y = {best_position[1]}, Cost = {best_cost}")
```
