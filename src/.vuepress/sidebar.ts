import { sidebar } from "vuepress-theme-hope";

// 文件夹与板块对应；直属文章写相对路径，子栏目用 prefix 和 children。
// 新增文章时在所属板块添加条目。
export default sidebar({
  // 通识基础
  "/ai-algorithms/foundations/general/": [
    "ablation-study.html",
    "inverse-transform-sampling.html",
    "no-free-lunch-and-inductive-bias.html",
    "learning-algorithms-introduction.html"
  ],

  // 参数设置分析方法
  "/ai-algorithms/foundations/parameter-analysis/": [
    "response-surface-methodology.html",
    "taguchi-method.html"
  ],

  // 非学习类算法
  "/ai-algorithms/foundations/non-learning-methods/": [
    "topsis.html"
  ],

  // 具体问题与案例
  "/ai-algorithms/foundations/problem-cases/": [
    "distributed-shop-scheduling.html",
    {
      text: "多目标优化问题",
      icon: "bullseye",
      link: "/ai-algorithms/foundations/problem-cases/multi-objective-optimization/",
      collapsible: true,
      expanded: true,
      children: [
        {
          text: "多目标进化算法（MOEA）",
          icon: "chart-line",
          link: "/ai-algorithms/foundations/problem-cases/multi-objective-optimization/evolutionary-algorithms/",
          collapsible: true,
          expanded: true,
          children: [
            "moea-d.html",
            "npga.html",
            "nsga2.html",
            "nsga3.html",
            "spea2.html",
            "moga.html"
          ],
          prefix: "/ai-algorithms/foundations/problem-cases/multi-objective-optimization/evolutionary-algorithms/"
        },
        "evaluation-metrics.html",
        "intro.html"
      ],
      prefix: "/ai-algorithms/foundations/problem-cases/multi-objective-optimization/"
    }
  ],

  // 机器学习
  "/ai-algorithms/learning/machine-learning/": [
    "knn.html"
  ],

  // 深度学习
  "/ai-algorithms/learning/deep-learning/": [
    "addnorm.html",
    "essential-code.html",
    "lstm.html",
    "gru.html"
  ],

  // 迁移学习
  "/ai-algorithms/learning/transfer-learning/": [],

  // 强化学习
  "/ai-algorithms/learning/reinforcement-learning/": [
    {
      text: "强化学习的数学原理",
      icon: "square-root-variable",
      collapsible: true,
      expanded: false,
      children: [
        "01-reinforcement-learning-overview.html",
        "02-bellman-equations.html",
        "03-bellman-optimality-equations.html",
        "04-value-and-policy-iteration.html",
        "05-monte-carlo-methods.html",
        "06-stochastic-approximation.html",
        "07-temporal-difference-methods.html",
        "08-value-function-methods.html",
        "09-policy-gradient-methods.html",
        "10-actor-critic-methods.html",
        "11-summary.html"
      ],
      link: "/ai-algorithms/learning/reinforcement-learning/mathematical-principles/",
      prefix: "/ai-algorithms/learning/reinforcement-learning/mathematical-principles/"
    },
    {
      text: "前沿方法",
      icon: "lightbulb",
      link: "/ai-algorithms/learning/reinforcement-learning/frontier-methods/"
    }
  ],

  // 优化基础与算法
  "/ai-algorithms/optimization/fundamentals/": [
    {
      text: "遗传规划",
      icon: "code-branch",
      link: "/ai-algorithms/optimization/fundamentals/genetic-programming/",
      collapsible: true,
      expanded: false,
      children: [
        "genetic-programming.html",
        "tree-based-genetic-programming.html",
        "strongly-typed-genetic-programming.html",
        "automatic-function-definition-genetic-programming.html",
        "grammar-guided-genetic-programming.html",
        "grammatical-evolution.html",
        "linear-genetic-programming.html",
        "cartesian-genetic-programming.html",
        "gene-expression-programming.html",
        "multi-expression-programming.html",
        "stack-based-genetic-programming.html",
        "genetic-network-programming.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/genetic-programming/"
    },
    {
      text: "进化算法",
      icon: "dna",
      link: "/ai-algorithms/optimization/fundamentals/evolutionary-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "evolutionary-programming.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/evolutionary-algorithms/"
    },
    {
      text: "其他优化技巧",
      icon: "shapes",
      link: "/ai-algorithms/optimization/fundamentals/supporting-strategies/",
      collapsible: true,
      expanded: false,
      children: [
        "latin-hypercube-sampling.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/supporting-strategies/"
    },
    {
      text: "蚁群优化算法",
      icon: "route",
      link: "/ai-algorithms/optimization/fundamentals/ant-colony-optimization/",
      collapsible: true,
      expanded: false,
      children: [
        "ant-system.html",
        "elitist-ant-system.html",
        "rank-based-ant-system.html",
        "max-min-ant-system.html",
        "best-worst-ant-system.html",
        "ant-colony-system.html",
        "fast-ant-system.html",
        "ant-q.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/ant-colony-optimization/"
    },
    {
      text: "人工免疫系统算法",
      icon: "shield-virus",
      link: "/ai-algorithms/optimization/fundamentals/artificial-immune-systems/",
      collapsible: true,
      expanded: false,
      children: [
        "negative-selection-algorithm.html",
        "clonalg.html",
        "dynamic-clonal-selection.html",
        "immune-network-algorithm.html",
        "artificial-immune-recognition-system.html",
        "dendritic-cell-algorithm.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/artificial-immune-systems/"
    },
    {
      text: "进化策略",
      icon: "dna",
      link: "/ai-algorithms/optimization/fundamentals/evolution-strategies/",
      collapsible: true,
      expanded: false,
      children: [
        "evolution-strategies.html",
        "one-plus-one-evolution-strategy.html",
        "mu-plus-one-evolution-strategy.html",
        "mu-comma-lambda-evolution-strategy.html",
        "mu-plus-lambda-evolution-strategy.html",
        "mu-slash-rho-plus-lambda-evolution-strategy.html",
        "self-adaptive-evolution-strategy.html",
        "natural-evolution-strategy.html",
        "covariance-matrix-adaptation-evolution-strategy.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/evolution-strategies/"
    },
    {
      text: "小生境遗传算法",
      icon: "bullseye",
      link: "/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "crowding-factor.html",
        "deterministic-crowding.html",
        "probabilistic-crowding.html",
        "restricted-tournament-selection.html",
        "fitness-sharing.html",
        "clearing.html",
        "sequential-niching.html",
        "dynamic-niche-sharing.html",
        "dynamic-niche-clustering.html",
        "niche-radius-adaptation.html",
        "coevolutionary-shared-niching.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/niching-genetic-algorithms/"
    },
    {
      text: "新颖性搜索算法",
      icon: "lightbulb",
      link: "/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "novelty-search-algorithm.html",
        "novelty-search-with-local-competition.html",
        "novelty-search-with-quality.html",
        "constrained-novelty-search.html",
        "map-elites.html",
        "illumination-algorithm.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/novelty-search-algorithms/"
    },
    {
      text: "物理启发优化算法",
      icon: "atom",
      link: "/ai-algorithms/optimization/fundamentals/physical-optimization-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "simulated-annealing.html",
        "extremal-optimization.html",
        "harmony-search.html",
        "cultural-algorithm.html",
        "memetic-algorithm.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/physical-optimization-algorithms/"
    },
    {
      text: "群智能算法",
      icon: "circle-nodes",
      link: "/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "bees-algorithm.html",
        "artificial-bee-colony.html",
        "firefly-algorithm.html",
        "bat-algorithm.html",
        "cuckoo-search.html",
        "bacterial-foraging-optimization-algorithm.html",
        "grey-wolf-optimizer.html",
        "whale-optimization-algorithm.html",
        "moth-flame-optimization.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/swarm-intelligence-algorithms/"
    },
    {
      text: "优化基础理论知识",
      icon: "user-graduate",
      link: "/ai-algorithms/optimization/fundamentals/theory/",
      collapsible: true,
      expanded: false,
      children: [
        "optimization-theory.html",
        "optimization-categories.html",
        "optimization-problem.html",
        "model-based-and-model-free.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/theory/"
    },
    "algorithm-family-map.html",
    {
      text: "随机优化算法",
      icon: "dice",
      link: "/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "random-search.html",
        "adaptive-random-search.html",
        "stochastic-hill-climbing.html",
        "stochastic-hill-climbing-with-random-restarts.html",
        "tabu-search.html",
        "reactive-tabu-search.html",
        "iterated-local-search.html",
        "variable-neighborhood-search.html",
        "guided-local-search.html",
        "greedy-randomized-adaptive-search.html",
        "scatter-search.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/stochastic-optimization-algorithms/"
    },
    {
      text: "遗传算法",
      icon: "dna",
      link: "/ai-algorithms/optimization/fundamentals/genetic-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "genetic-algorithm.html",
        "ranked-selection-genetic-algorithm.html",
        "fitness-scaling-genetic-algorithm.html",
        "steady-state-genetic-algorithm.html",
        "elitist-genetic-algorithm.html",
        "real-coded-genetic-algorithm.html",
        "micro-genetic-algorithm.html",
        "cellular-genetic-algorithm.html",
        "island-genetic-algorithms.html",
        "messy-genetic-algorithm.html",
        "learning-classifier-system.html",
        "non-dominated-sorting-genetic-algorithm.html",
        "strength-pareto-evolution-algorithm.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/genetic-algorithms/"
    },
    {
      text: "遗传算法的算子",
      icon: "toolbox",
      link: "/ai-algorithms/optimization/fundamentals/genetic-operators/",
      collapsible: true,
      expanded: false,
      children: [
        "tournament-selection.html",
        "simulated-binary-crossover.html",
        "polynomial-mutation.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/genetic-operators/"
    },
    {
      text: "差分进化算法",
      icon: "arrows-left-right",
      link: "/ai-algorithms/optimization/fundamentals/differential-evolution/",
      collapsible: true,
      expanded: false,
      children: [
        "de-rand-1-bin.html",
        "de-rand-1-exp.html",
        "de-best-1-bin.html",
        "de-best-1-z.html",
        "de-current-to-rand-1.html",
        "adaptive-differential-evolution.html",
        "self-adaptive-differential-evolution.html",
        "adaptive-differential-evolution-with-optional-external-archive.html",
        "composite-differential-evolution.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/differential-evolution/"
    },
    {
      text: "粒子群优化",
      icon: "circle-nodes",
      link: "/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/",
      collapsible: true,
      expanded: false,
      children: [
        "standard-particle-swarm-optimization.html",
        "global-best-particle-swarm-optimization.html",
        "local-best-particle-swarm-optimization.html",
        "inertia-weight-particle-swarm-optimization.html",
        "constriction-factor-particle-swarm-optimization.html",
        "velocity-clamping-particle-swarm-optimization.html",
        "bare-bones-particle-swarm-optimization.html",
        "adaptive-particle-swarm-optimization.html",
        "binary-particle-swarm-optimization.html",
        "discrete-particle-swarm-optimization.html",
        "dynamic-multi-swarm-particle-swarm-optimizer.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/particle-swarm-optimization/"
    },
    {
      text: "分布估计算法",
      icon: "chart-area",
      link: "/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/",
      collapsible: true,
      expanded: false,
      children: [
        "univariate-marginal-distribution-algorithm.html",
        "population-based-incremental-learning.html",
        "compact-genetic-algorithm.html",
        "cross-entropy-method.html",
        "bivariate-marginal-distribution-algorithm.html",
        "mutual-information-maximization-for-input-clustering.html",
        "factorized-distribution-algorithm.html",
        "extended-compact-genetic-algorithm.html",
        "linkage-tree-genetic-algorithm.html",
        "bayesian-optimization-algorithm.html",
        "hierarchical-bayesian-optimization-algorithm.html"
      ],
      prefix: "/ai-algorithms/optimization/fundamentals/estimation-of-distribution-algorithms/"
    }
  ],

  // 前沿算法与框架
  "/ai-algorithms/optimization/frontier-algorithms/": [
    "research-directions.html"
  ],

  // 基准测试与竞赛
  "/ai-algorithms/optimization/benchmarks/": [
    "cec-resources.html",
    "cec-tracks.html"
  ],

  // 知识图谱
  "/ai-applications/knowledge-retrieval/knowledge-graphs/": [],

  // 检索增强生成（RAG）
  "/ai-applications/knowledge-retrieval/rag/": [],

  // Agent 设计
  "/ai-applications/agent-systems/agent-design/": [],

  // 记忆系统
  "/ai-applications/agent-systems/memory/": [],

  // 提示词工程
  "/ai-applications/agent-systems/prompt-engineering/": [],

  // Agent 客户端与工具
  "/ai-applications/tools-practice/agent-clients/": [
    {
      text: "必装工具",
      link: "/ai-applications/tools-practice/agent-clients/tools/",
      collapsible: true,
      expanded: true,
      children: [
        "gh.html",
        "cc-switch.html",
        "ripgrep.html",
        "libreoffice.html"
      ],
      prefix: "/ai-applications/tools-practice/agent-clients/tools/"
    },
    {
      text: "ChatGPT-Codex",
      link: "/ai-applications/tools-practice/agent-clients/chatgpt-codex/",
      collapsible: true,
      expanded: true,
      children: [
        "codex-advanced-usage.html",
        "codex-reconnecting.html"
      ],
      prefix: "/ai-applications/tools-practice/agent-clients/chatgpt-codex/"
    }
  ],

  // Skills、MCP 与插件
  "/ai-applications/tools-practice/skills-mcp/": [
    "matlab-agentic-toolkit.html",
    "research-reproduction-workflow.html"
  ],

  // AI 应用话题
  "/ai-applications/tools-practice/topics/": [
    "info.html"
  ],

  // 论文随笔
  "/paper-notes/": [
    {
      text: "每周阅读总结",
      icon: "calendar",
      link: "/paper-notes/weekly/"
    },
    "reading-workflow.html"
  ],

  // 数学建模专题
  "/notes/mathematical-modeling/": [
    "cumcm-problems.html",
    "modeling-competitions-overview.html",
    "preparation-resources.html",
    "cumcm-problem-a-guide.html"
  ],

  // 数学随记
  "/notes/mathematics/": [
    "characteristic-function.html",
    "closed-form-expression.html",
    "consensus-ranking.html",
    "consistent-estimator.html",
    "contraction-mapping.html",
    {
      text: "假设检验",
      icon: "flask",
      link: "/notes/mathematics/hypothesis-testing/",
      collapsible: true,
      expanded: true,
      children: [
        "anova.html",
        "friedman.html",
        "p-value.html",
        "type.html",
        "wilcoxon-signed-rank.html"
      ],
      prefix: "/notes/mathematics/hypothesis-testing/"
    },
    "kendall-tau.html",
    "numerical-methods-notes-2.html",
    "numerical-methods-notes-1.html"
  ],

  // 信号处理
  "/notes/signal-processing/": [
    "wavelet-analysis-basics.html"
  ],

  // 计算机随记
  "/notes/computing/": [
    "cmd-vs-powershell.html",
    "windows-install.html",
    "ubuntu-install.html"
  ],

  // 程序设计语言随笔
  "/notes/programming-languages/": [
    {
      text: "Java语言",
      icon: "brands:java",
      link: "/notes/programming-languages/java/",
      collapsible: true,
      expanded: true,
      children: [
        "advanced-java.html",
        "javafx.html",
        "maven.html",
        "io.html",
        "multithreading.html",
        "network-programming.html",
        "generics.html"
      ],
      prefix: "/notes/programming-languages/java/"
    },
    {
      text: "MATLAB语言",
      icon: "calculator",
      link: "/notes/programming-languages/matlab/",
      collapsible: true,
      expanded: true,
      children: [
        "parallel.html"
      ],
      prefix: "/notes/programming-languages/matlab/"
    },
    {
      text: "Python语言",
      icon: "brands:python",
      link: "/notes/programming-languages/python/",
      collapsible: true,
      expanded: true,
      children: [
        "python.html",
        "jupyter-notebook.html",
        "conda.html",
        "pandas.html",
        "type-hints.html",
        "dataclass.html"
      ],
      prefix: "/notes/programming-languages/python/"
    }
  ],

  // 前端随笔
  "/notes/web-development/": [
    {
      text: "包管理器",
      icon: "box-open",
      link: "/notes/web-development/package-managers/",
      collapsible: true,
      expanded: true,
      children: [
        "package-managers.html",
        "npm-and-pnpm-commands.html",
        "package-json-and-pnpm-lock.html"
      ],
      prefix: "/notes/web-development/package-managers/"
    },
    {
      text: "工具链",
      icon: "screwdriver-wrench",
      link: "/notes/web-development/toolchains/",
      collapsible: true,
      expanded: true,
      children: [
        "overview.html",
        "build-and-bundling-tools.html"
      ],
      prefix: "/notes/web-development/toolchains/"
    },
    {
      text: "框架",
      icon: "cubes",
      link: "/notes/web-development/frameworks/",
      collapsible: true,
      expanded: true,
      children: [
        "vue.html"
      ],
      prefix: "/notes/web-development/frameworks/"
    },
    {
      text: "模块化",
      icon: "puzzle-piece",
      link: "/notes/web-development/modules/",
      collapsible: true,
      expanded: true,
      children: [
        "overview.html",
        "esm-specification.html"
      ],
      prefix: "/notes/web-development/modules/"
    },
    "html.html",
    "css.html",
    "javascript.html",
    "nodejs.html",
    "typescript.html"
  ],

  // 海克斯麻将
  "/notes/hex-mahjong/": [
    "quick-start.html",
    "rules-v1-2.html",
    "card-library.html",
    "card-pools.html"
  ],

  // 音乐
  "/notes/music/": [
    "mixes.html"
  ],

  // Git
  "/software-tools/version-control/git/": [
    "git-installation-and-github-ssh.html",
    "git-common-workflows.html",
    "git-command-reference.html"
  ],

  // Linux
  "/software-tools/systems-containers/linux/": [
    "editor.html",
    "info.html",
    "apt.html",
    "command.html"
  ],

  // Docker
  "/software-tools/systems-containers/docker/": [
    "command.html",
    "install.html"
  ],

  // VSCode
  "/software-tools/development-remote/vscode/": [
    "latex-setup.html",
    "snippet.html",
    "multi-language-setup.html"
  ],

  // 远程连接与控制
  "/software-tools/development-remote/remote-access/": [
    "tailscale-windows-remote-desktop.html",
    "ssh.html"
  ],

  // 论文管理与知识库构建
  "/software-tools/documentation-knowledge/paper-management/": [
    "zotero.html",
    "obsidian.html",
    "ai-research-workflow.html"
  ],

  // LaTeX
  "/software-tools/documentation-knowledge/latex/": [
    "latex-basics.html",
    "mathematical-modeling-paper-template.html",
    "usts-undergraduate-thesis-template.html"
  ],

  // 开源项目推荐
  "/software-tools/open-source-projects/": [
    "bulk-crap-uninstaller.html",
    "markitdown.html"
  ],

  // 外站
  "/external-links/": [],

  // 首页
  "/": [],

});
