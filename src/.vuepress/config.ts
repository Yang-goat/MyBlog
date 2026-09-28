import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
import { viteBundler } from '@vuepress/bundler-vite'

import theme, { siteHostname, siteEncryption } from "./theme.js";
import knowledgeGraphPlugin from "./knowledge-graph/plugin.js";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
    },
    "/en/": {
      lang: "en-US",
    },
  },

  title: "Goat_Yang",
  description: "Goat_Yang 的博客",

  theme,
  plugins: [knowledgeGraphPlugin({
    hostname: siteHostname,
    encryptedPaths: Object.keys(siteEncryption.config ?? {}),
    globallyEncrypted: siteEncryption.global === true,
  })],

  // 和 PWA 一起启用
  // shouldPrefetch: false,

  // 指定打包工具
  bundler: viteBundler({
    viteOptions: {
      build: {
        rolldownOptions: {
          onLog(level, log, defaultHandler) {
            if (
              log.code === "INVALID_ANNOTATION" &&
              log.id?.includes("@vueuse/core/dist/index.js")
            )
              return;

            defaultHandler(level, log);
          },
          checks: {
            pluginTimings: false,
          },
        },
      },
    },
  }),
});
