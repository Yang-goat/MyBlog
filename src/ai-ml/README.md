---
home: true
title: 人工智能
icon: book
article: false
sidebar: false
pageInfo: false
heroText: 人工智能
tagline: 这里整理算法学习中的主干知识，从基础概念到深度学习、强化学习与优化方法，再到具体案例。
heroStyle:
  min-height: 640px
bgImage: https://theme-hope-assets.vuejs.press/bg/1-light.svg
bgImageDark: https://theme-hope-assets.vuejs.press/bg/1-dark.svg
bgImageStyle:
  background-attachment: fixed
actions:
  - text: 通识基础
    link: /ai-ml/base/
    icon: book-open
    type: primary

  - text: 学习类算法导论
    link: /ai-ml/Introduction-to-Learning-Algorithms.html
    icon: lightbulb
    type: default

  - text: 参数设置分析方法
    link: /ai-ml/parameter-settings/
    icon: sliders
    type: default

  - text: 机器学习
    link: /ai-ml/machine-learning/
    icon: brain
    type: default

  - text: 深度学习
    link: /ai-ml/deep-learning/
    icon: network-wired
    type: default

  - text: 强化学习
    link: /ai-ml/RL/
    icon: robot
    type: default

  - text: 非学习类算法
    link: /ai-ml/other/
    icon: compass-drafting
    type: default

  - text: 智能优化算法
    link: /ai-ml/optimization/
    icon: diagram-project
    type: default

  - text: 具体问题 / 案例
    link: /ai-ml/problems/
    icon: flask-vial
    type: default

highlights:
  - header: 通识基础
    description: 通识基础负责解释机器学习与优化算法里反复出现的核心概念，是后续所有专题的理论底座。
    bgImage: https://theme-hope-assets.vuejs.press/bg/3-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/3-dark.svg
    highlights:
      - title: 逆变换抽样
        icon: shuffle
        details: 从采样方法理解随机变量生成，是很多概率算法的起点
        link: /ai-ml/base/InverseTransformSampling.html

      - title: NFL 与归纳偏置
        icon: scale-balanced
        details: 理解没有免费午餐定理，以及模型为什么必须带着偏好去学习
        link: /ai-ml/base/NFLandInductiveBias.html

      - title: 消融实验
        icon: flask
        details: 用实验对比验证模块和设计选择，是论文与项目里很常见的方法
        link: /ai-ml/base/Ablation.html

  - header: 学习类算法导论
    description: 这篇导论用最短路径解释什么是学习、学习算法在做什么，以及为什么机器能从数据中总结规则。
    bgImage: https://theme-hope-assets.vuejs.press/bg/5-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/5-dark.svg
    features:
      - title: 进入导论
        icon: arrow-up-right-from-square
        details: 单篇总览文章，适合在正式进入机器学习相关主题前先建立整体认识
        link: /ai-ml/Introduction-to-Learning-Algorithms.html

  - header: 参数设置分析方法
    description: 参数设置分析方法关注调参与实验设计，适合在算法对比、灵敏度分析和实验复现时回看。
    bgImage: https://theme-hope-assets.vuejs.press/bg/2-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/2-dark.svg
    bgImageStyle:
      background-repeat: repeat
      background-size: initial
    highlights:
      - title: RSM
        icon: chart-line
        details: 响应面法适合分析参数变化对目标结果的影响
        link: /ai-ml/parameter-settings/RSM.html

      - title: Taguchi
        icon: sliders
        details: 田口方法强调正交实验和稳健参数设计
        link: /ai-ml/parameter-settings/Taguchi.html

      - title: 方法目录
        icon: arrow-up-right-from-square
        details: 从目录页继续查看调参与实验设计相关内容
        link: /ai-ml/parameter-settings/

  - header: 机器学习
    description: 机器学习部分整理经典模型与入门算法，偏重基础理解和方法直觉。
    bgImage: https://theme-hope-assets.vuejs.press/bg/9-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/9-dark.svg
    features:
      - title: KNN
        icon: brain
        details: 从最直观的邻近思想理解监督学习里的分类与回归
        link: /ai-ml/machine-learning/knn.html

      - title: 进入机器学习目录
        icon: arrow-up-right-from-square
        details: 从目录主页进入后，当前机器学习专题树会直接展开
        link: /ai-ml/machine-learning/

  - header: 深度学习
    description: 深度学习部分围绕网络结构、模块机制和代码片段整理，适合读模型时快速回看关键实现。
    bgImage: https://theme-hope-assets.vuejs.press/bg/6-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/6-dark.svg
    highlights:
      - title: LSTM
        icon: wave-square
        details: 适合梳理长短期记忆网络的门控结构和序列建模思路
        link: /ai-ml/deep-learning/LSTM.html

      - title: GRU
        icon: code-branch
        details: 用更紧凑的门控设计理解另一种常见循环网络
        link: /ai-ml/deep-learning/GRU.html

      - title: AddNorm
        icon: layer-group
        details: 关注 Transformer 常见基础模块的结构与作用
        link: /ai-ml/deep-learning/addnorm.html

      - title: 必备代码
        icon: laptop-code
        details: 记录深度学习实验里常反复用到的代码片段
        link: /ai-ml/deep-learning/必备代码.html

  - header: 强化学习
    description: 强化学习部分按照概念推进顺序展开，从价值函数到策略方法，适合连续阅读。
    bgImage: https://theme-hope-assets.vuejs.press/bg/4-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/4-dark.svg
    features:
      - title: 贝尔曼公式
        icon: pen-nib
        details: 从价值递推关系开始进入强化学习的数学核心
        link: /ai-ml/RL/02贝尔曼公式.html

      - title: 蒙特卡洛
        icon: dice
        details: 通过采样回报理解无模型估计的基本方法
        link: /ai-ml/RL/05蒙特卡洛方法.html

      - title: 时序差分
        icon: clock-rotate-left
        details: 将估计和更新结合起来，是强化学习里最关键的一类方法
        link: /ai-ml/RL/07时序差分方法.html

      - title: 策略梯度
        icon: chart-line
        details: 直接优化策略本身，适合进一步进入连续动作与深度强化学习
        link: /ai-ml/RL/09策略梯度方法.html

      - title: 演员-评论家
        icon: masks-theater
        details: 把价值估计与策略更新结合起来，是很多现代算法的基础框架
        link: /ai-ml/RL/10演员-评论家方法.html

      - title: 强化学习目录
        icon: arrow-up-right-from-square
        details: 从目录页连续阅读完整章节，侧边栏会保持展开
        link: /ai-ml/RL/

  - header: 非学习类算法
    description: 非学习类算法部分整理评价与决策分析里常用的方法，和学习算法主线分开，查找会更直接。
    bgImage: https://theme-hope-assets.vuejs.press/bg/2-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/2-dark.svg
    bgImageStyle:
      background-repeat: repeat
      background-size: initial
    highlights:
      - title: TOPSIS
        icon: scale-balanced
        details: 从距离理想解的角度做排序，是常见的多指标评价方法
        link: /ai-ml/other/topsis.html

      - title: 进入目录
        icon: arrow-up-right-from-square
        details: 从目录页查看当前评价与决策分析专题的全部内容
        link: /ai-ml/other/

  - header: 智能优化算法
    description: 智能优化算法部分已经按理论基础、算法家族和搜索机制拆成多级目录，后续会持续更新进化计算、群体智能和随机优化方向文章。
    bgImage: https://theme-hope-assets.vuejs.press/bg/5-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/5-dark.svg
    features:
      - title: Theory
        icon: book
        details: 先看优化问题、算法分类和理论基础，再进入后续具体方法
        link: /ai-ml/optimization/Theory/

      - title: 进化算法
        icon: dna
        details: 进入演化计算的基础框架与代表性方法分支
        link: /ai-ml/optimization/evolutionary-algorithms/

      - title: 进化策略
        icon: chart-line
        details: 查看 ES、NES、CMA-ES 等参数自适应搜索方法
        link: /ai-ml/optimization/evolution-strategies/

      - title: 遗传算法
        icon: users-viewfinder
        details: 从编码方式、群体演化流程和典型 GA 变体进入主线
        link: /ai-ml/optimization/genetic-algorithms/

      - title: 遗传算法算子
        icon: shuffle
        details: 继续查看选择、交叉、变异等核心算子专题
        link: /ai-ml/optimization/genetic-algorithm-operator/

      - title: 小生境遗传算法
        icon: mountain-sun
        details: 进入多样性保持、多峰优化和种群分化机制专题
        link: /ai-ml/optimization/niching-genetic-algorithms/

      - title: 遗传规划
        icon: code-branch
        details: 查看程序表示、树结构操作与表达式演化方法
        link: /ai-ml/optimization/genetic-programming/

      - title: 差分进化
        icon: arrows-spin
        details: 继续查看标准策略、自适应机制与外部档案方法
        link: /ai-ml/optimization/differential-evolution/

      - title: 分布估计算法
        icon: chart-area
        details: 进入概率建模、采样更新与结构学习方法专题
        link: /ai-ml/optimization/estimation-of-distribution-algorithms/

      - title: 粒子群优化
        icon: arrows-to-circle
        details: 查看拓扑结构、参数控制与离散化扩展
        link: /ai-ml/optimization/particle-swarm-optimization/

      - title: 群智能算法
        icon: people-group
        details: 进入蜂群、蝙蝠、萤火虫、狼群等集群协同方法
        link: /ai-ml/optimization/swarm-intelligence-algorithms/

      - title: 蚁群优化
        icon: bug
        details: 查看信息素机制、路径构造与多种蚁群系统变体
        link: /ai-ml/optimization/ant-colony-optimization/

      - title: 人工免疫系统
        icon: shield-virus
        details: 继续查看克隆选择、免疫记忆与异常检测方法
        link: /ai-ml/optimization/artificial-immune-systems/

      - title: 新颖性搜索
        icon: compass
        details: 进入行为差异驱动搜索与质量多样性专题
        link: /ai-ml/optimization/novelty-search-algorithms/

      - title: 随机优化
        icon: dice
        details: 查看随机搜索、局部搜索、禁忌搜索与邻域扰动
        link: /ai-ml/optimization/stochastic-optimization-algorithms/

      - title: 物理启发优化
        icon: atom
        details: 继续查看模拟退火、和声搜索、文化算法等方法
        link: /ai-ml/optimization/physical-optimization-algorithms/

      - title: 其他优化技巧
        icon: screwdriver-wrench
        details: 进入采样、初始化和辅助策略等补充内容
        link: /ai-ml/optimization/other/

  - header: 具体问题 / 案例
    description: 具体问题 / 案例部分会把算法放回真实任务场景中，后续会持续更新案例分析与多目标优化等问题方向文章。
    bgImage: https://theme-hope-assets.vuejs.press/bg/3-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/3-dark.svg
    highlights:
      - title: DHFS
        icon: flask-vial
        details: 从具体案例出发理解问题建模与算法应用的结合方式
        link: /ai-ml/problems/DHFS.html

      - title: 进入案例目录
        icon: arrow-up-right-from-square
        details: 从目录页继续查看案例型笔记，适合按问题背景快速定位
        link: /ai-ml/problems/

      - title: 多目标优化
        icon: bullseye
        details: 从问题定义、评价指标到 MOEA 算法，逐层进入多目标优化专题
        link: /ai-ml/problems/MOO/
---
