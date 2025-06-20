import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/笔记/": [
    "",
    {
      text: "程序设计语言",
      icon: "code",
      prefix: "程序设计语言/",
      link: "程序设计语言/",
      children: [
        {
          text: "Java",
          icon: "code",
          prefix: "java/",
          link: "java/",
          collapsible: true,
          expanded: false,
          children: "structure",
        },
        {
          text: "python",
          icon: "code",
          prefix: "python/",
          link: "python/",
          collapsible: true,
          expanded: false,
          children: "structure",
        }
      ],
    },
    {
      text: "前端",
      icon: "laptop-code",
      prefix: "前端/",
      link: "前端/",
      children: "structure",
    },
  ],
  "/算法/": "structure",
  "/随笔/": "structure",
  "/实用工具教程/": "structure",
  // "/宝藏站点/": "structure",
});
