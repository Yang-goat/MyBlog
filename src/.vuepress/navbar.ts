import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "笔记",
    icon: "book",
    children: [
      {
        text: "程序设计语言",
        link: "/程序设计语言/",
      },
    ],

  },
  {
    text: "实用工具教程",
    icon: "tool",
    link: "/实用工具教程/",

  },
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);
