import { hasGlobalComponent } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_901be1d079241beac9b19145aea85811/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-components@_feb11a1bb105b5a2d2a0002b59b30e07/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-components@_feb11a1bb105b5a2d2a0002b59b30e07/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_901be1d079241beac9b19145aea85811/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

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
