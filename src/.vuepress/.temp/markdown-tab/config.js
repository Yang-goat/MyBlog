import { CodeTabs } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-markdown-t_dca4b4a09029b0b8fba92a7f853733e1/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-markdown-t_dca4b4a09029b0b8fba92a7f853733e1/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-markdown-t_dca4b4a09029b0b8fba92a7f853733e1/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
