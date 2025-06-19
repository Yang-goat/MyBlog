import { hasGlobalComponent } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_47789790c9bff09a01056a76b05eda50/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-components@_f7ce81eb70f062c49bce7a8d9cce07a5/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-plugin-components@_f7ce81eb70f062c49bce7a8d9cce07a5/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_47789790c9bff09a01056a76b05eda50/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

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
