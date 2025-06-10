import { CodeTabs } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-markdown-t_08b0530337a698477800cd1a17fc26ae/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-markdown-t_08b0530337a698477800cd1a17fc26ae/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-markdown-t_08b0530337a698477800cd1a17fc26ae/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
