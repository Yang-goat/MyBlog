import { hasGlobalComponent } from "/media/goat/双系统共享/project/Blog/myBlog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.109_vuepress@2.0.0-rc.23_@vuepress+bundler-vite@2.0.0-rc.23_@_84b13afde302674e20ee757345055c86/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "/media/goat/双系统共享/project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-components@2.0.0-rc.90_sass-embedded@1.89.2_vuepress@2.0.0-rc.23_@vuepr_2a5533ab9bb7d2834fe63520538fb6eb/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "/media/goat/双系统共享/project/Blog/myBlog/node_modules/.pnpm/vuepress-plugin-components@2.0.0-rc.90_sass-embedded@1.89.2_vuepress@2.0.0-rc.23_@vuepr_2a5533ab9bb7d2834fe63520538fb6eb/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "/media/goat/双系统共享/project/Blog/myBlog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.109_vuepress@2.0.0-rc.23_@vuepress+bundler-vite@2.0.0-rc.23_@_84b13afde302674e20ee757345055c86/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

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
