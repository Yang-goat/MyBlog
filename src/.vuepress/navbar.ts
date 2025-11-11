import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "软件开发",
    icon: "book",
    link: "/dev/",
  },
  {
    text: "人工智能",
    icon: "code",
    link: "/ai-ml/",
  },
  {
    text: "随笔",
    icon: "pen-to-square",
    link: "/notes/",
  },
  {
    text: "软件工具",
    icon: "toolbox",
    link: "/guides/",
  },
  {
    text: "宝藏站点",
    icon: "link",
    link: "/links/",
  },
  {
    text: "关于我",
    icon: "user",
    link: "/intro",
  },
  // {
  //   text: "功能测试",
  //   icon: "link",
  //   link: "/tests/",
  // },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
