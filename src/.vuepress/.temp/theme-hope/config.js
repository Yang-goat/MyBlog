import { Layout, NotFound, injectDarkMode, setupDarkMode, setupSidebarItems, scrollPromise } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_cb4b0666ce8e6f18dc068fef957f6af5/node_modules/vuepress-theme-hope/lib/bundle/exports/base.js";

import { defineCatalogInfoGetter } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+plugin-catalog@2._a974a4fd694131e2d719ff430abfecad/node_modules/@vuepress/plugin-catalog/lib/client/index.js"
import { h } from "vue"
import { resolveComponent } from "vue"
import { Blog, BloggerInfo, SocialMedias, setupBlog } from "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_cb4b0666ce8e6f18dc068fef957f6af5/node_modules/vuepress-theme-hope/lib/bundle/exports/blog.js";
import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_cb4b0666ce8e6f18dc068fef957f6af5/node_modules/vuepress-theme-hope/lib/bundle/styles/blog/bundle.scss";

import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_47789790c9bff09a01056a76b05eda50/node_modules/@vuepress/helper/lib/client/styles/colors.css";
import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_47789790c9bff09a01056a76b05eda50/node_modules/@vuepress/helper/lib/client/styles/normalize.css";
import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_47789790c9bff09a01056a76b05eda50/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";
import "D:/Project/Blog/my-blog_newtheme/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_cb4b0666ce8e6f18dc068fef957f6af5/node_modules/vuepress-theme-hope/lib/bundle/styles/bundle.scss";

defineCatalogInfoGetter((meta) => {
  const title = meta.title;
  const shouldIndex = meta.index ?? true;
  const icon = meta.icon;

  return shouldIndex ? {
    title,
    content: icon ? () =>[h(resolveComponent("VPIcon"), { icon, sizing: "both" }), title] : null,
    order: meta.order,
    index: meta.index,
  } : null;
});

export default {
  enhance: ({ app, router }) => {
    const { scrollBehavior } = router.options;

    router.options.scrollBehavior = async (...args) => {
      await scrollPromise.wait();

      return scrollBehavior(...args);
    };

    // inject global properties
    injectDarkMode(app);

    app.component("BloggerInfo", BloggerInfo);
    app.component("SocialMedias", SocialMedias);
  },
  setup: () => {
    setupDarkMode();
    setupSidebarItems();
    setupBlog();
  },
  layouts: {
    Layout,
    NotFound,
    Blog,
  }
};
