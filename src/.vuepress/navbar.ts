import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "笔记",
    icon: "book",
    link: "/笔记/",
  },
  {
    text: "算法",
    icon: "code",
    link: "/算法/",
  },
  {
    text: "随笔",
    icon: "pen-to-square",
    link: "/随笔/",
  },
  {
    text: "实用工具教程",
    icon: "toolbox",
    link: "/实用工具教程/",
  },
  {
    text: "宝藏站点",
    icon: "link",
    link: "/宝藏站点/",
  },
  {
    text: "关于我",
    icon: "user",
    link: "/intro",
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
