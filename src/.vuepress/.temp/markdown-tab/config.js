import { CodeTabs } from "D:/Project/Blog/myBlog/node_modules/.pnpm/@vuepress+plugin-markdown-t_62be0cad2ecdfe9a771ef2a783d1bc84/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "D:/Project/Blog/myBlog/node_modules/.pnpm/@vuepress+plugin-markdown-t_62be0cad2ecdfe9a771ef2a783d1bc84/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "D:/Project/Blog/myBlog/node_modules/.pnpm/@vuepress+plugin-markdown-t_62be0cad2ecdfe9a771ef2a783d1bc84/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
