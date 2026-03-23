---
title: "遗传算法（GA）"
date: 2026-03-21
order: 1
category:
  - 智能优化算法
tag:
  - "遗传算法"
---

# 遗传算法（GA）

## 名称

遗传算法（Genetic Algorithm, GA），简单遗传算法（Simple Genetic Algorithm, SGA），经典遗传算法（Canonical Genetic Algorithm），基础遗传算法（Basic Genetic Algorithm）

## 分类

> [查看分类思维导图](/ai-ml/optimization/MindMap.html)

简单遗传算法是演化计算领域中的基础性方法，而演化计算是计算智能的一个子领域。该算法与其他演化算法，如遗传编程、进化策略以及进化规划等密切相关。

- 计算智能
  - 生物启发计算
    - 演化计算
      - 演化算法
        - 简单遗传算法

## 策略

简单遗传算法建立在自然选择与遗传继承原理之上。它维护一个候选解种群，其中每个个体均表示为一个基因串（通常为二进制串）。算法通过反复施加选择、交叉和变异等遗传算子，对种群进行迭代演化。

### 选择

在每一代中，算法首先利用与具体问题相关的适应度函数评估种群中各个个体的适应度。随后，从种群中选择一部分个体作为下一代繁殖的父代。常用的选择方法包括锦标赛选择，即固定数量的个体依据适应度进行竞争；以及适应度比例选择，即个体以与其相对适应度成比例的概率被选中。

### 交叉

被选中的父代两两配对，通过交叉算子产生子代。交叉操作通过在父代之间交换遗传信息来构造新个体。最常见的交叉方式是单点交叉，即随机选取一个交叉点，并交换该点之后的基因片段。其他常见变体还包括多点交叉和均匀交叉。

### 变异

交叉之后，子代还会经历变异过程，即以较小概率对个别基因进行随机改变。变异能够为种群引入新的遗传多样性，从而防止过早收敛，并使算法能够探索搜索空间中的新区域。在二进制编码中，变异通常表现为位翻转操作。

### 替换

新生成的子代随后用于替换原有种群中的部分个体。常见的替换策略包括代际替换，即整个种群均由子代替换；以及稳态替换，即每一代只替换少量个体。

上述选择、交叉、变异与替换过程持续进行，直到达到预设的迭代代数，或满足终止条件，例如找到满意解或达到计算预算上限。

## 过程

### 数据结构

- 种群：由若干个体组成的数组，其中每个个体表示为一个基因串（通常为二进制串）。
- 适应度：用于存储种群中每个个体适应度值的数组。

### 参数

- 种群规模：种群中个体的数量。
- 交叉概率：对一对父代施加交叉操作的概率。
- 变异概率：对子代中每个基因施加变异操作的概率。
- 终止条件：停止算法运行的条件，例如最大迭代代数或目标适应度值。

### 步骤

1. 初始化种群
    1. 创建一个空的种群数组
    2. 对于种群规模中的每个个体：
        1. 随机生成一个基因串
        2. 将该个体加入种群数组
2. 评估种群中每个个体的适应度
    1. 对于种群中的每个个体：
        1. 使用具体问题的适应度函数计算其适应度值
        2. 将适应度值存储到适应度数组中
3. 当终止条件未满足时：
    1. 从种群中选择父代
        1. 选择一种选择方法（例如锦标赛选择或适应度比例选择）
        2. 根据个体适应度，从种群中选出一部分个体作为父代
    2. 通过交叉生成子代
        1. 将选出的父代两两配对
        2. 对于每一对父代：
            1. 若随机数小于交叉概率：
                1. 执行交叉操作，生成两个子代
            2. 否则：
                1. 不进行交叉，直接复制父代作为子代
    3. 对子代施加变异
        1. 对于每个子代：
            1. 对于子代中的每个基因：
                1. 若随机数小于变异概率：
                    1. 对该基因执行变异操作（例如位翻转）
    4. 用子代替换部分种群个体
        1. 选择一种替换策略（例如代际替换或稳态替换）
        2. 按照所选策略，用子代替换种群中的部分个体
    5. 评估种群中新个体的适应度
        1. 对于种群中的每个新个体：
            1. 使用具体问题的适应度函数计算其适应度值
            2. 将适应度值存储到适应度数组中
4. 返回种群中找到的最优解

## 注意事项

### 优点

- 简单性：与其他优化技术相比，简单遗传算法相对容易理解与实现。
- 通用性：遗传算法可应用于广泛的优化问题，包括离散变量、连续变量以及混合整数变量问题。
- 鲁棒性：遗传算法能够处理含噪、复杂且多峰的适应度景观，因此适用于传统优化方法难以有效求解的问题。

### 缺点

- 参数敏感性：简单遗传算法的性能对参数设置较为敏感，例如种群规模、交叉概率和变异概率。合理参数的选择通常需要实验调节与领域知识支持。
- 早熟收敛：如果种群多样性丧失过快，算法可能收敛到次优解。这种情况通常出现在选择压力过大或变异率过低时。
- 计算代价高：对于搜索空间较大或适应度评估代价较高的问题，遗传算法可能具有较高的计算开销。为了获得满意解，算法往往需要较多代数迭代和适应度评估。

## 启发式建议

### 种群规模

- 应选择能够在探索与开发之间取得平衡的种群规模。较大的种群规模有助于提升多样性和增强探索能力，但同时也会增加计算成本。
- 经验上，可先将种群规模设定在 50 到 200 个个体之间，再根据问题复杂度和可用计算资源进行调整。

### 交叉概率

- 应将交叉概率设置得足够高，以促进个体之间的遗传信息交换。常见取值范围为 0.6 至 0.9。
- 若交叉概率过低，算法可能难以有效组合潜在优良解，从而导致收敛速度较慢。

### 变异概率

- 应采用较低的变异概率，以向种群中引入适量随机扰动。常见取值范围为每个基因 0.01 至 0.1。
- 若变异概率过高，算法可能表现出过强的随机性，从而难以收敛到高质量解。

### 终止条件

- 应设定能够在解的质量与计算资源之间取得平衡的终止条件。
- 常见的终止方式包括设定最大迭代代数、目标适应度值，或收敛阈值（例如当最优适应度在若干代内不再改进时停止）。

### 适应度函数设计

- 应设计能够准确衡量候选解质量的适应度函数，以反映具体问题背景下解的优劣。
- 适应度函数还应尽可能计算高效，因为在算法执行过程中需要被反复评估。
- 可考虑对适应度值进行归一化或缩放处理，以防止适应度差异过大而导致选择过程被极端个体主导。

### 多样性维持

- 应采用适当技术维持种群多样性，以避免早熟收敛。
- 可选方法包括增大种群规模、提高变异概率、采用保多样性的选择机制（如拥挤机制或生态位机制），或周期性地向种群中引入新的随机个体。

## 代码

::: details Show

### Python 遗传算法

如果你在实现过程中遇到困难，下面给出了一个使用纯 Python 编写的遗传算法示例实现。

```python
import random

def onemax(bitstring):
    """需要最大化的目标函数。统计 bitstring 中 1 的个数。"""
    return sum(bitstring)

def bit_flip_mutation(bitstring, mutation_rate):
    """对二进制串执行位翻转变异，变异概率为给定的 mutation_rate。"""
    for i in range(len(bitstring)):
        if random.random() < mutation_rate:
            bitstring[i] = 1 - bitstring[i]  # 翻转该位
    return bitstring

def one_point_crossover(parent1, parent2):
    """对两个二进制串执行单点交叉。"""
    if len(parent1) != len(parent2):
        raise ValueError("Parents must have the same length.")
    point = random.randint(1, len(parent1) - 1)
    child1 = parent1[:point] + parent2[point:]
    child2 = parent2[:point] + parent1[point:]
    return child1, child2

def tournament_selection(population, k):
    """使用锦标赛选择法选出一个个体。"""
    tournament = random.sample(population, k)
    tournament.sort(key=lambda x: x[1], reverse=True)  # 按适应度从高到低排序
    return tournament[0][0]  # 返回锦标赛中最优个体的二进制串

def genetic_algorithm(objective, bitstring_length, population_size, generations, mutation_rate, tournament_size):
    """运行遗传算法。"""
    # 随机初始化种群
    population = [[random.randint(0, 1) for _ in range(bitstring_length)] for _ in range(population_size)]
    # 评估初始种群
    population = [(individual, objective(individual)) for individual in population]

    # 演化过程
    for generation in range(generations):
        # 选择与繁殖
        new_population = []
        while len(new_population) < population_size:
            parent1 = tournament_selection(population, tournament_size)
            parent2 = tournament_selection(population, tournament_size)
            child1, child2 = one_point_crossover(parent1, parent2)
            new_population.append(child1)
            if len(new_population) < population_size:
                new_population.append(child2)

        # 变异
        population = [bit_flip_mutation(individual, mutation_rate) for individual in new_population]
        # 评估新种群
        population = [(individual, objective(individual)) for individual in population]

        # 输出当前结果
        best_individual = max(population, key=lambda x: x[1])
        print(f"Generation {generation+1}: Best Fitness = {best_individual[1]}")

    return best_individual

# 算法参数
bitstring_length = 100
population_size = 100
generations = 50
mutation_rate = 0.01
tournament_size = 5

# 运行遗传算法
best_individual = genetic_algorithm(onemax, bitstring_length, population_size, generations, mutation_rate, tournament_size)
print(f"Best Individual: {best_individual[0]}, Fitness: {best_individual[1]}")
:::
