import { hasGlobalComponent } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_f0e6d6ae2d5754246c94b22fb8837f6e/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vueuse+core@13.3.0_vue@3.5.17/node_modules/@vueuse/core/index.mjs";
import { h } from "vue";
import { VPIcon } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0_10829c27fa49bd8602b998ba69850c2e/node_modules/@vuepress/plugin-icon/lib/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "iconify",
            prefix: "fa6-solid:",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(`https://cdn.jsdelivr.net/npm/iconify-icon@2`);
  },
}
