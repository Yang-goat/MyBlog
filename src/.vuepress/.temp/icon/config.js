import { hasGlobalComponent } from "/media/goat/data/project/Blog/myBlog/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.108_vuepress@2.0.0-rc.23_@vuepress+bundler-vite@2.0.0-rc.23_@_68281f65d97426df139edd3441032404/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "/media/goat/data/project/Blog/myBlog/node_modules/.pnpm/@vueuse+core@13.3.0_vue@3.5.17/node_modules/@vueuse/core/index.mjs";
import { h } from "vue";
import { VPIcon } from "/media/goat/data/project/Blog/myBlog/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0-rc.108_markdown-it@14.1.0_vuepress@2.0.0-rc.23_@vuepress+bu_a4d657bf36da19b89285fb88e0e97e20/node_modules/@vuepress/plugin-icon/lib/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "fontawesome",
            prefix: "",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(
  `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/solid.min.js`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);

    useScriptTag(
  `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/regular.min.js`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);

    useScriptTag(
  `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/fontawesome.min.js`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);

  },
}
