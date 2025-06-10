import CodeDemo from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-md-enhance@_3def9a1e227c9e6a17d6bb839954fbd9/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-md-enhance@_3def9a1e227c9e6a17d6bb839954fbd9/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
  },
};
