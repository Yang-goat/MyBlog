import CodeDemo from "/media/goat/data/project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.90_markdown-it@14.1.0_markmap-lib@0.18.12_markmap-c_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "/media/goat/data/project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.90_markdown-it@14.1.0_markmap-lib@0.18.12_markmap-c_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";
import MarkMap from "/media/goat/data/project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.90_markdown-it@14.1.0_markmap-lib@0.18.12_markmap-c_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/MarkMap.js";
import Mermaid from "/media/goat/data/project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@2.0.0-rc.90_markdown-it@14.1.0_markmap-lib@0.18.12_markmap-c_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/Mermaid.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
    app.component("MarkMap", MarkMap);
    app.component("Mermaid", Mermaid);
  },
};
