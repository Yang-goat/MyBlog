import CodeDemo from "D:/Project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "D:/Project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";
import MarkMap from "D:/Project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/MarkMap.js";
import Mermaid from "D:/Project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-md-enhance@_e8e5e3def8e57bb21bbfc82ab253abee/node_modules/vuepress-plugin-md-enhance/lib/client/components/Mermaid.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
    app.component("MarkMap", MarkMap);
    app.component("Mermaid", Mermaid);
  },
};
