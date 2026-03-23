---
title: "模拟退火（SA）"
date: 2026-03-21
order: 1
category:
  - 智能优化算法
tag:
  - "物理启发优化"
---

# 模拟退火（SA）

## 名称

模拟退火（Simulated Annealing, SA）

## 分类

> [查看分类思维导图](/ai-ml/optimization/MindMap.html)

模拟退火是一种受冶金学中退火物理过程启发的随机优化算法。它与 Metropolis-Hastings 算法密切相关，并可视为一种元启发式方法或概率型局部搜索算法。

- 优化
  - 随机优化
    - 元启发式
      - 模拟退火

## 策略

模拟退火来源于材料退火的物理过程：材料首先被加热到较高温度，然后缓慢冷却，以消除缺陷并达到低能量晶体状态。在优化问题中，待最小化的目标函数对应于物理系统中的能量，而最优解则对应于最低能量状态。

算法从一个初始解出发，通过不断生成邻域解来迭代探索解空间。在每次迭代中，算法通过对当前解施加一个小扰动来生成新解。若新解能够改进目标函数值，则接受该新解作为当前解；然而，即使新解更差，也仍可能以某一概率被接受。该接受概率取决于当前“温度”以及当前解与新解之间目标函数差值的大小。

在优化初期，由于温度较高，较差解被接受的概率也较高，这使算法能够跳出局部最优。随着温度按照预先设定的降温计划逐步降低，较差解的接受概率也随之减小，算法从而逐渐收敛到一个近似最优解。

### 探索与开发

模拟退火通过温度参数来平衡探索与开发。在高温阶段，算法更有可能接受较差解，因此能够更充分地探索解空间；而随着温度降低，算法对解的选择会变得更加严格，从而更倾向于保留较优解，并加强对潜在优良区域的开发。

### 收敛性

模拟退火的收敛行为由降温计划所控制，即温度随时间下降的方式。常见的降温计划包括指数降温、对数降温和线性降温。降温计划的选择会影响最终解质量与达到该解所需计算时间之间的权衡关系。

## 过程

1. 初始化：
    1. 定义待最小化的目标函数
    2. 生成一个初始解
    3. 设置初始温度和降温计划参数
2. 当停止准则未满足时：
    1. 通过对当前解施加扰动生成一个新解
    2. 计算当前解与新解之间的目标函数差值
    3. 若新解更优（目标函数值更小）：
        1. 接受新解作为当前解
    4. 否则：
        1. 根据当前温度和目标函数差值计算接受概率
        2. 生成一个 0 到 1 之间的随机数
        3. 若该随机数小于接受概率：
            1. 接受新解作为当前解
    5. 按照降温计划更新温度
3. 返回搜索过程中找到的最优解

### 数据结构

- 当前解（Current Solution）：表示优化问题当前所处的状态
- 新解（New Solution）：通过对当前解施加扰动生成的候选解
- 最优解（Best Solution）：用于存储搜索过程中找到的最优解
- 温度（Temperature）：控制较差解被接受概率的参数

### 参数

- 初始温度（Initial Temperature）：退火过程开始时的温度
- 降温计划（Cooling Schedule）：决定温度如何随时间下降（如指数、对数、线性）
- 扰动函数（Perturbation Function）：定义如何由当前解生成新解
- 停止准则（Stopping Criteria）：终止算法的条件（如最大迭代次数、最小温度、连续若干次迭代无改进）

## 注意事项

### 优点

- 具有跳出局部最优并有效探索解空间的能力
- 适用于广泛类型的优化问题，包括组合优化和连续优化
- 实现相对简单，且易于迁移到不同问题领域
- 能够处理带噪声或随机性的目标函数

### 缺点

- 算法性能高度依赖于降温计划和扰动函数的选择
- 往往需要对参数进行仔细调节，才能获得较好效果
- 计算代价可能较高，尤其是在大规模问题中
- 无法保证最终解一定是全局最优解

## 启发式建议

### 降温计划

- 应从较高的初始温度开始，以保证对解空间进行充分探索
- 应逐步降低温度，以平衡探索与开发
- 指数降温计划（如 $T = T_0 * \alpha^k$，其中 $\alpha$ 为降温率，$k$ 为迭代次数）最为常用
- 对数降温计划（如 $T = T_0 / \log(1 + k)$）在理论上可提供收敛保证，但在实践中通常较慢
- 线性降温计划（如 $T = T_0 - \beta * k$，其中 $\beta$ 为降温步长）实现简单，但可能无法有效探索解空间

### 扰动函数

- 扰动函数应根据具体问题领域进行设计
- 对于连续优化问题，较小的随机扰动（如加入高斯噪声）通常较为有效
- 对于组合优化问题，可采用问题特定的算子（如交换、插入、删除）来生成邻域解
- 扰动幅度应合理平衡，以兼顾局部搜索与全局探索

### 停止准则

- 应设置最大迭代次数或计算时间上限，以避免运行时间过长
- 可监测当前最优解的改进情况；若在连续若干次迭代中没有显著改进，则可停止算法
- 可设定最小温度作为终止条件，因为在低温阶段接受较差解的概率已接近于零

### 目标函数

- 应确保目标函数能够准确刻画优化问题的目标
- 可考虑对目标函数进行归一化或尺度变换，以避免数值问题并提升算法性能
- 若问题具有多个目标，可考虑采用加权求和或基于 Pareto 的方法处理多目标优化问题

### 初始解

- 初始解的选择会影响模拟退火的性能
- 若具备问题特定知识，可利用启发式方法或贪心算法生成较好的初始解
- 否则，可采用随机初始解，或通过多次随机重启探索解空间中的不同区域

### 参数调节

- 应尝试不同的初始温度、降温计划和扰动函数取值，以寻找适合具体问题的最佳配置
- 可先在部分问题实例或较小规模问题上进行参数调节，以降低调参成本
- 还可考虑使用自动化参数调节技术，如元优化或自适应降温计划，以进一步提升算法性能

## 代码

::: details Show

### Python 模拟退火

如果你暂时没有思路，下面给出一个使用纯 Python 实现模拟退火的参考代码。

```python
# AlgorithmAfternoon.com
import math
import random

def objective_function(x):
    """目标函数 f(x) = sin(x) + sin(10 * x / 3)。"""
    return math.sin(x) + math.sin(10 * x / 3)

def acceptance_criteria(cost, new_cost, temperature):
    """根据当前温度判断是否接受新解。"""
    if new_cost > cost:
        return True
    # 计算接受概率（玻尔兹曼分布）
    return math.exp((new_cost - cost) / temperature) > random.random()

def exponential_cooling(current_temperature, cooling_rate):
    """采用指数方式降低温度。"""
    return current_temperature * cooling_rate

def uniform_neighbor_generation(current_x, neighborhood_size):
    """在当前解的邻域内生成一个新解。"""
    return current_x + random.uniform(-neighborhood_size, neighborhood_size)

def simulated_annealing(objective_function, bounds, initial_temperature, final_temperature, cooling_rate, max_iterations, neighborhood_size):
    """执行模拟退火算法。"""
    # 在边界范围内随机选择初始位置
    current_x = random.uniform(bounds[0], bounds[1])
    current_cost = objective_function(current_x)
    best_x = current_x
    best_cost = current_cost

    temperature = initial_temperature

    iteration = 0
    while temperature > final_temperature and iteration < max_iterations:
        # 生成一个邻域解
        candidate_x = uniform_neighbor_generation(current_x, neighborhood_size)
        # 确保候选解位于边界范围内
        if candidate_x < bounds[0] or candidate_x > bounds[1]:
            continue
        candidate_cost = objective_function(candidate_x)

        # 接受判定
        if acceptance_criteria(current_cost, candidate_cost, temperature):
            current_x, current_cost = candidate_x, candidate_cost
            if candidate_cost > best_cost:
                best_x, best_cost = candidate_x, candidate_cost

        # 降温
        temperature = exponential_cooling(temperature, cooling_rate)

        # 输出当前迭代的最优代价值
        print(f"Iteration {iteration+1}: Best Cost = {best_cost}")

        iteration += 1

    return best_x, best_cost

# 算法参数
initial_temperature = 1000
final_temperature = 1e-3
cooling_rate = 0.97
max_iterations = 500
neighborhood_size = 1.0
bounds = (-5, 5)

# 运行模拟退火算法
best_x, best_cost = simulated_annealing(objective_function, bounds, initial_temperature, final_temperature, cooling_rate, max_iterations, neighborhood_size)
print(f"Best solution: x = {best_x}, Cost = {best_cost}")
```
