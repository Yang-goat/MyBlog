import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Goat_Yang",
  description: "Goat_Yang 的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,


  alias: {  // 创建组件别名
      "@Comment": path.resolve(__dirname, "components/Comment.vue"),

  },
});
