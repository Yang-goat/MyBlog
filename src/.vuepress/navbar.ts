import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "首页",
    icon: "house",
    link: "/",
  },
  {
    text: "人工智能 · 算法",
    icon: "code",
    children: [
      {
        text: "通识基础",
        icon: "book-open",
        link: "/ai-ml/base/",
      },
      {
        text: "学习类算法导论",
        icon: "lightbulb",
        link: "/ai-ml/Introduction-to-Learning-Algorithms.html",
      },
      {
        text: "参数设置分析方法",
        icon: "sliders",
        link: "/ai-ml/parameter-settings/",
      },
      {
        text: "机器学习",
        icon: "brain",
        link: "/ai-ml/machine-learning/",
      },
      {
        text: "深度学习",
        icon: "network-wired",
        link: "/ai-ml/deep-learning/",
      },
      {
        text: "强化学习",
        icon: "robot",
        link: "/ai-ml/RL/",
      },
      {
        text: "非学习类算法",
        icon: "compass-drafting",
        link: "/ai-ml/other/",
      },
      {
        text: "智能优化算法",
        icon: "diagram-project",
        link: "/ai-ml/optimization/",
      },
      {
        text: "具体问题 / 案例",
        icon: "flask-vial",
        link: "/ai-ml/problems/",
      },
    ],
  },
  {
    text: "AI应用实践",
    icon: "robot",
    children: [
      {
        text: "智能体",
        icon: "robot",
        link: "/ai-practice/agents/",
      },
      {
        text: "提示词",
        icon: "comment",
        link: "/ai-practice/prompts/",
      },
    ],
  },
  {
    text: "随笔",
    icon: "pen-to-square",
    children: [
      {
        text: "数学建模专题",
        icon: "graduation-cap",
        link: "/notes/MCM/",
      },
      {
        text: "数学随记",
        icon: "square-root-variable",
        link: "/notes/Math/",
      },
      {
        text: "计算机随记",
        icon: "computer",
        link: "/notes/computer/",
      },
      {
        text: "程序设计语言随笔",
        icon: "code",
        link: "/notes/language/",
      },
      {
        text: "前端随笔",
        icon: "laptop-code",
        link: "/notes/frontend/",
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
        text: "Docker",
        icon: "brands:docker",
        link: "/guides/docker/",
      },
      {
        text: "Git",
        icon: "brands:git-alt",
        link: "/guides/git/",
      },
      {
        text: "LaTeX",
        icon: "file-lines",
        link: "/guides/Latex/",
      },
      {
        text: "Linux",
        icon: "brands:linux",
        link: "/guides/linux/",
      },
      {
        text: "SSH",
        icon: "key",
        link: "/guides/ssh.html",
      },
      {
        text: "VSCode",
        icon: "code",
        link: "/guides/VSCode/",
      },
      {
        text: "Zotero",
        icon: "book-bookmark",
        link: "/guides/Zotero.html",
      },
    ],
  },
  {
    text: "网站导航",
    icon: "link",
    link: "/links/",
  },
  {
    text: "关于我",
    icon: "user",
    link: "/intro",
  },
]);
