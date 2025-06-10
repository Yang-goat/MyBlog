import { hasGlobalComponent } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_901be1d079241beac9b19145aea85811/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vueuse+core@13.3.0_vue@3.5.16/node_modules/@vueuse/core/index.mjs";
import { h } from "vue";
import { VPIcon } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0_f5be0ca2ca8774aa0e1b58f44a4b9abf/node_modules/@vuepress/plugin-icon/lib/client/index.js"

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
