import CodeDemo from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-md-enhance@_dfac140cab6c36ae4717cb808b3640e3/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-md-enhance@_dfac140cab6c36ae4717cb808b3640e3/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";
import MarkMap from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-md-enhance@_dfac140cab6c36ae4717cb808b3640e3/node_modules/vuepress-plugin-md-enhance/lib/client/components/MarkMap.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
    app.component("MarkMap", MarkMap);
  },
};
