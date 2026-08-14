/// <reference types="vitest/config" />
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/hex-mahjong/",
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["art/**/*"],
      manifest: {
        id: "/hex-mahjong/",
        name: "海克斯麻将主持台",
        short_name: "海克斯麻将",
        description: "配合实体麻将使用的电子卡牌主持台",
        lang: "zh-CN",
        start_url: "/hex-mahjong/",
        scope: "/hex-mahjong/",
        display: "fullscreen",
        orientation: "landscape",
        background_color: "#04101b",
        theme_color: "#061421",
        icons: [
          { src: "art/app-icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "art/app-icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "art/app-icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        navigateFallback: "/hex-mahjong/index.html",
        navigateFallbackAllowlist: [/^\/hex-mahjong\/?$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        globPatterns: ["**/*.{html,js,css,json,png,webp,svg,woff2}"]
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    outDir: "../../src/.vuepress/dist/hex-mahjong",
    emptyOutDir: false,
    sourcemap: true
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"]
  }
});
