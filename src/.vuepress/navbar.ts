import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "首页",
    icon: "house",
    link: "/",
  },
  {
    text: "AI 与算法",
    icon: "code",
    children: [
      {
        text: "基础与方法", icon: "book-open",
        children: [
          { text: "通识基础", icon: "book-open", link: "/ai-algorithms/foundations/general/" },
          { text: "参数设置分析方法", icon: "sliders", link: "/ai-algorithms/foundations/parameter-analysis/" },
          { text: "非学习类算法", icon: "compass-drafting", link: "/ai-algorithms/foundations/non-learning-methods/" },
          { text: "具体问题与案例", icon: "flask-vial", link: "/ai-algorithms/foundations/problem-cases/" },
        ],
      },
      {
        text: "机器学习与研究", icon: "brain",
        children: [
          {
            text: "机器学习", icon: "brain", link: "/ai-algorithms/learning/machine-learning/",
          },
          { text: "深度学习", icon: "network-wired", link: "/ai-algorithms/learning/deep-learning/" },
          { text: "迁移学习", icon: "arrows-left-right", link: "/ai-algorithms/learning/transfer-learning/" },
          { text: "强化学习", icon: "robot", link: "/ai-algorithms/learning/reinforcement-learning/" },
        ],
      },
      {
        text: "智能优化", icon: "diagram-project",
        children: [
          {
            text: "优化基础与算法", icon: "diagram-project", link: "/ai-algorithms/optimization/fundamentals/",
          },
          { text: "前沿算法与框架", icon: "file-lines", link: "/ai-algorithms/optimization/frontier-algorithms/" },
          { text: "基准测试与竞赛", icon: "trophy", link: "/ai-algorithms/optimization/benchmarks/" },
        ],
      },
    ],
  },
  {
    text: "AI 应用",
    icon: "robot",
    children: [
      {
        text: "知识与检索", icon: "magnifying-glass",
        children: [
          { text: "知识图谱", icon: "diagram-project", link: "/ai-applications/knowledge-retrieval/knowledge-graphs/" },
          { text: "检索增强生成（RAG）", icon: "magnifying-glass", link: "/ai-applications/knowledge-retrieval/rag/" },
        ],
      },
      {
        text: "智能体系统", icon: "robot",
        children: [
          { text: "Agent 设计", icon: "robot", link: "/ai-applications/agent-systems/agent-design/" },
          { text: "记忆系统", icon: "brain", link: "/ai-applications/agent-systems/memory/" },
          { text: "提示词工程", icon: "comment-dots", link: "/ai-applications/agent-systems/prompt-engineering/" },
        ],
      },
      {
        text: "工具与实践", icon: "screwdriver-wrench",
        children: [
          { text: "Agent 客户端与工具", icon: "desktop", link: "/ai-applications/tools-practice/agent-clients/" },
          { text: "Skills、MCP 与插件", icon: "puzzle-piece", link: "/ai-applications/tools-practice/skills-mcp/" },
          { text: "AI 应用话题", icon: "lightbulb", link: "/ai-applications/tools-practice/topics/" },
        ],
      },
    ],
  },
  {
    text: "论文随笔",
    icon: "book-open",
    link: "/paper-notes/",
  },
  {
    text: "随笔",
    icon: "pen-to-square",
    children: [
      {
        text: "数学建模专题",
        icon: "graduation-cap",
        link: "/notes/mathematical-modeling/",
      },
      {
        text: "数学随记",
        icon: "square-root-variable",
        link: "/notes/mathematics/",
      },
      {
        text: "信号处理",
        icon: "wave-square",
        link: "/notes/signal-processing/",
      },
      {
        text: "计算机随记",
        icon: "computer",
        link: "/notes/computing/",
      },
      {
        text: "程序设计语言随笔",
        icon: "code",
        link: "/notes/programming-languages/",
      },
      {
        text: "前端随笔",
        icon: "laptop-code",
        link: "/notes/web-development/",
      },
      {
        text: "海克斯麻将",
        icon: "dice",
        link: "/notes/hex-mahjong/",
      },
      {
        text: "音乐",
        icon: "music",
        link: "/notes/music/",
      },
    ],
  },
  {
    text: "软件工具",
    icon: "toolbox",
    children: [
      {
        text: "版本控制",
        icon: "code-branch",
        children: [
          {
            text: "Git",
            icon: "brands:git-alt",
            link: "/software-tools/version-control/git/",
          },
        ],
      },
      {
        text: "系统与容器",
        icon: "server",
        children: [
          {
            text: "Linux",
            icon: "brands:linux",
            link: "/software-tools/systems-containers/linux/",
          },
          {
            text: "Docker",
            icon: "brands:docker",
            link: "/software-tools/systems-containers/docker/",
          },
        ],
      },
      {
        text: "开发与远程工具",
        icon: "screwdriver-wrench",
        children: [
          {
            text: "VSCode",
            icon: "code",
            link: "/software-tools/development-remote/vscode/",
          },
          { text: "远程连接与控制", icon: "desktop", link: "/software-tools/development-remote/remote-access/" },
        ],
      },
      {
        text: "文档与知识管理",
        icon: "book-open",
        children: [
          {
            text: "论文管理与知识库构建",
            icon: "book-bookmark",
            link: "/software-tools/documentation-knowledge/paper-management/",
          },
          {
            text: "LaTeX",
            icon: "file-lines",
            link: "/software-tools/documentation-knowledge/latex/",
          },
        ],
      },
      {
        text: "开源项目推荐",
        icon: "brands:github",
        link: "/software-tools/open-source-projects/",
      },
    ],
  },
  {
    text: "外站",
    icon: "link",
    link: "/external-links/",
  },
]);
