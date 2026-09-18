---
home: true
title: 随笔
article: false
icon: pen-to-square
sidebar: false
pageInfo: false
heroText: 随笔
tagline: 随笔以灵活的形式记录学习、实践与日常观察中的思考，将零散经验沉淀为可回顾的知识。
heroStyle:
  min-height: 600px
bgImage: https://theme-hope-assets.vuejs.press/bg/5-light.svg
bgImageDark: https://theme-hope-assets.vuejs.press/bg/5-dark.svg
bgImageStyle:
  background-attachment: fixed
actions:
  - text: 海克斯麻将
    link: /notes/hex-mahjong/
    icon: dice
    type: primary

  - text: 程序设计语言随笔
    link: /notes/programming-languages/
    icon: code
    type: primary

  - text: 前端随笔
    link: /notes/web-development/
    icon: laptop-code
    type: default

  - text: 音乐
    link: /notes/music/
    icon: music
    type: default

  - text: 数学建模专题
    link: /notes/mathematical-modeling/
    icon: graduation-cap
    type: default

  - text: 数学随记
    link: /notes/mathematics/
    icon: square-root-variable
    type: default

  - text: 信号处理
    link: /notes/signal-processing/
    icon: wave-square
    type: default

  - text: 计算机随记
    link: /notes/computing/
    icon: computer
    type: default

highlights:
  - header: 海克斯麻将
    description: 配合实体四人麻将使用的电子卡牌主持台，包含快速开始、完整规则与 192 张卡牌资料。
    bgImage: https://theme-hope-assets.vuejs.press/bg/8-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/8-dark.svg
    features:
      - title: 打开主持台
        icon: gamepad
        details: 横放平板，管理电子卡牌、八局进度、状态与手动净分
        link: https://goatyang.com/hex-mahjong/

      - title: 查看规则与牌库
        icon: book-open
        details: 阅读网站主持台版规则、完整卡牌文字与三种模式组池
        link: /notes/hex-mahjong/

  - header: 程序设计语言随笔
    description: 按语言整理语法、标准库与工程实践内容，便于集中回看常用知识。
    bgImage: https://theme-hope-assets.vuejs.press/bg/3-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/3-dark.svg
    highlights:
      - title: Java语言
        icon: file-code
        details: IO、多线程、网络编程、泛型与 Maven 等常见进阶主题
        link: /notes/programming-languages/java/

      - title: Python语言
        icon: file-code
        details: 基础语法、Jupyter、类型提示、Pandas 与日常开发高频内容
        link: /notes/programming-languages/python/

      - title: MATLAB语言
        icon: square-root-variable
        details: 数值计算、矩阵操作和并行计算相关内容
        link: /notes/programming-languages/matlab/

      - title: 进入语言目录
        icon: arrow-up-right-from-square
        link: /notes/programming-languages/

  - header: 前端随笔
    description: 覆盖页面基础、脚本语言、Node.js 与前端工程化专题。
    bgImage: https://theme-hope-assets.vuejs.press/bg/9-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/9-dark.svg
    features:
      - title: 基础语法
        icon: code
        details: HTML、CSS、JavaScript、TypeScript 与 Node.js 基础文章
        link: /notes/web-development/

      - title: 包管理器
        icon: box-open
        details: npm、pnpm 等依赖管理工具的使用与理解
        link: /notes/web-development/package-managers/

      - title: 工具链
        icon: screwdriver-wrench
        details: 构建、打包和开发流程中的前端工具体系
        link: /notes/web-development/toolchains/

      - title: 框架
        icon: cubes
        details: Vue 等前端框架相关主题
        link: /notes/web-development/frameworks/

      - title: 模块化
        icon: puzzle-piece
        details: 模块系统、依赖组织与工程目录拆分
        link: /notes/web-development/modules/

  - header: 音乐
    description: 用于整理音乐相关的学习记录与随笔，当前目录暂为空。
    bgImage: https://theme-hope-assets.vuejs.press/bg/4-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/4-dark.svg
    features:
      - title: 进入音乐目录
        icon: music
        link: /notes/music/

  - header: 数学建模专题
    description: 数学建模专题会持续更新题目分析、论文写作与竞赛思路相关内容。
    bgImage: https://theme-hope-assets.vuejs.press/bg/9-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/9-dark.svg
    features:
      - title: 国赛 A 题指导
        icon: graduation-cap
        details: 从题目理解、建模思路到写作组织的单篇专题入口
        link: /notes/mathematical-modeling/cumcm-problem-a-guide.html

      - title: 进入专题目录
        icon: compass
        link: /notes/mathematical-modeling/
  
  - header: 数学随记
    description: 数学随记主要记录各种经典数学定义、定理、统计检验和计算方法。
    bgImage: https://theme-hope-assets.vuejs.press/bg/2-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/2-dark.svg
    bgImageStyle:
      background-repeat: repeat
      background-size: initial
    highlights:
      - title: 假设检验
        icon: vials
        details: 这里会持续更新参数检验与非参数检验相关内容
        link: /notes/mathematics/hypothesis-testing/

      - title: Kendall Tau
        icon: arrows-up-down-left-right
        details: 处理排序一致性和相关性时很常见的一类指标
        link: /notes/mathematics/kendall-tau.html

      - title: 一致估计
        icon: chart-simple
        details: 统计推断里常见的估计量性质，适合和其他概念一起回看
        link: /notes/mathematics/consistent-estimator.html

      - title: 计算方法随记
        icon: calculator
        details: 偏实践的数值方法与课堂学习记录
        link: "/notes/mathematics/numerical-methods-notes-1.html"

  - header: 计算机随记
    description: 计算机随记会持续更新操作系统、终端工具、命令行差异和日常使用问题相关内容。
    bgImage: https://theme-hope-assets.vuejs.press/bg/1-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/1-dark.svg
    features:
      - title: CMD 与 PowerShell
        icon: laptop-code
        details: 从 Windows 终端工具的定位、对象模型和脚本能力差异切入命令行基础
        link: /notes/computing/cmd-vs-powershell.html

      - title: 进入专题目录
        icon: arrow-up-right-from-square
        link: /notes/computing/

  - header: 信号处理
    description: 记录信号分析、时频方法与工程中的基础概念和实践。
    bgImage: https://theme-hope-assets.vuejs.press/bg/5-light.svg
    bgImageDark: https://theme-hope-assets.vuejs.press/bg/5-dark.svg
    features:
      - title: 小波分析基础
        icon: wave-square
        details: 从傅里叶变换、STFT 到连续与离散小波变换的基本思路
        link: /notes/signal-processing/wavelet-analysis-basics.html

---
