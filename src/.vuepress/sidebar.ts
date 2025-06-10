import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "程序设计语言",
      icon: "book",
      prefix: "程序设计语言/",
      link: "程序设计语言/",
      children: "structure",
    },
    {
      text: "实用工具教程",
      icon: "book",
      prefix: "实用工具教程/",
      link: "实用工具教程/",
      children: "structure",
    },
    "intro",
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    // },
  ],
});
