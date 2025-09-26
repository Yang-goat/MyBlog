import { hasGlobalComponent } from "D:/Project/Blog/myBlog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_84b13afde302674e20ee757345055c86/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "D:/Project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-components@_2a5533ab9bb7d2834fe63520538fb6eb/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "D:/Project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-components@_2a5533ab9bb7d2834fe63520538fb6eb/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "D:/Project/Blog/myBlog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_84b13afde302674e20ee757345055c86/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("VPCard")) app.component("VPCard", VPCard);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
