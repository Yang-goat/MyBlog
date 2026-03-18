import { defineClientConfig } from "vuepress/client";
import Blog from "./layouts/Main.vue";
// import Websites from './components/Websites.vue';
import TreasureSites from "./layouts/TreasureSites.vue";
import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
import { setupTransparentNavbar } from "vuepress-theme-hope/presets/transparentNavbar.js";

export default defineClientConfig({
  layouts: {
    Blog,
    TreasureSites,
  },

  setup() {
    setupTransparentNavbar({
      type: "blog-homepage",
      threshold: 80,
      light: "#3c3c43",
      dark: "#ebebf5db`",
    });

    setupRunningTimeFooter(
      "2025-06-18T20:44:30+08:00",
      {
        "/": "本站已运行 :day 天 :hour 时 :minute 分 :second 秒",
        "/en/": "Site has been running for :day days :hour hours :minute minutes :second seconds",
      },
      true,
    );
  },
});
