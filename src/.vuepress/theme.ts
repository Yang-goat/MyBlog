import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://github.com/Yang-goat/MyBlog", 

  author: {
    name: "Goat_Yang",
    url: "https://mister-hope.com",
  },

  logo: "assets/icon/头像.jpg",

  repo: "Yang-goat/MyBlog",
  repoLabel: "GitHub",
  repoDisplay: true,

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "感谢访问",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "立志考研的程序员 爱好电音 信计本科在读",
    intro: "/intro.html",
    medias: {
      BiliBili: "https://space.bilibili.com/415221098",
      // Wechat: "https://u.wechat.com/MKk5IZZiRVAPXwZ0ZJk43V4",
      Email: "mailto:1700425119@qq.com",
      GitHub: "https://github.com/Yang-goat",
      QQ: "https://qm.qq.com/cgi-bin/qm/qr?k=W9kVREFn34sQS_QB1aGDmqoJ2-W4Lst_",
      "163Music": "https://music.163.com/#/user/home?id=1499103686",
      // VuePressThemeHope: {
      //   icon: "https://theme-hope-assets.vuejs.press/logo.svg",
      //   link: "https://theme-hope.vuejs.press",
      // },
    },
  },

  // 加密配置
  // encrypt: {
  //   config: {
  //     "/demo/encrypt.html": {
  //       hint: "Password: 1234",
  //       password: "1234",
  //     },
  //   },
  // },

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 打印按钮配置
  print: true,

  // 全屏按钮配置
  fullscreen: false,

  // 纯净模式
  pure: false,

  pageInfo: [
    "Author",
    // "Original",
    "Date",
    "Category",
    "Tag",
    "Word",
    "ReadingTime",
    // "PageView",
  ],

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
    markmap: true,

    // TeX 支持
    math: {
      type: "katex",
    },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,

    // 启用之前需安装 @waline/client
    // 警告: 这是一个仅供演示的测试服务，在生产环境中请自行部署并使用自己的服务！
    // comment: {
    //   provider: "Waline",
    //   serverURL: "https://waline-comment.vuejs.press",
    // },

    components: {
      components: ["Badge", "VPCard"],
      // 查看内置组件文档：https://theme-hope.vuejs.press/zh/guide/component/built-in.html
    },

    icon: {
      prefix: "fa6-solid:",
    },

    notice: [ // 公告
      {
        path: "/",
        showOnce: true,
        key: "计算方法笔记更新",
        title: "更新通知",
        content: "发布了计算方法笔记，在随笔中。",
        actions: [
          { text: "已了解" },
        ],
        // fullscreen: true,
        confirm: true,
      },
    ],

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
