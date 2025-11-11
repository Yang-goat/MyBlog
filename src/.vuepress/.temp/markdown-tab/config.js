import { CodeTabs } from "/media/goat/双系统共享/project/Blog/myBlog/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.108_markdown-it@14.1.0_vuepress@2.0.0-rc.23_@vue_62be0cad2ecdfe9a771ef2a783d1bc84/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "/media/goat/双系统共享/project/Blog/myBlog/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.108_markdown-it@14.1.0_vuepress@2.0.0-rc.23_@vue_62be0cad2ecdfe9a771ef2a783d1bc84/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "/media/goat/双系统共享/project/Blog/myBlog/node_modules/.pnpm/@vuepress+plugin-markdown-tab@2.0.0-rc.108_markdown-it@14.1.0_vuepress@2.0.0-rc.23_@vue_62be0cad2ecdfe9a771ef2a783d1bc84/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
