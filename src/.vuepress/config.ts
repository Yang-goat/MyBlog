import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/MyBlog/",

  lang: "zh-CN",
  title: "Goat_Yang",
  description: "Goat_Yang 的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
