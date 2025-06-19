import CodeDemo from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-md-enhance@_0ef31b89da2291f1addc632d6de48f37/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-md-enhance@_0ef31b89da2291f1addc632d6de48f37/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
  },
};
