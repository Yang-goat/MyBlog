import { hasGlobalComponent } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_68281f65d97426df139edd3441032404/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vueuse+core@13.3.0_vue@3.5.17/node_modules/@vueuse/core/index.mjs";
import { h } from "vue";
import { VPIcon } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0_a4d657bf36da19b89285fb88e0e97e20/node_modules/@vuepress/plugin-icon/lib/client/index.js"

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
