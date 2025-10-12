import { defineClientConfig } from "vuepress/client";
import Blog from "./layouts/BingBackground.vue";
// import Websites from './components/Websites.vue';
import TreasureSites from "./layouts/TreasureSites.vue";

export default defineClientConfig({
  layouts: {
    Blog,
    TreasureSites,
  },

  // enhance: ({ app }) => {
  //   app.component('Websites', Websites);
  // }
});