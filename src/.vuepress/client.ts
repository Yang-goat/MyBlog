import { defineClientConfig } from "vuepress/client";
import Blog from "./layouts/Main.vue";
import TreasureSites from "./layouts/TreasureSites.vue";
import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
import { setupTransparentNavbar } from "vuepress-theme-hope/presets/transparentNavbar.js";

// 思维导图页的固定路径与全屏相关样式类。
const MINDMAP_PATH = "/ai-ml/optimization/MindMap.html";
const MINDMAP_FULLSCREEN_CLASS = "optimization-mindmap-fullscreen";
const MINDMAP_CONTROLS_CLASS = "optimization-mindmap-controls";
let syncTimer = 0;

// 仅在 optimization 的思维导图页上挂载额外交互。
const isMindMapPage = (): boolean =>
  typeof window !== "undefined" && window.location.pathname === MINDMAP_PATH;

// 同步按钮文案，让“全屏查看”和“浏览器全屏”始终反映当前状态。
const syncMindMapControls = (): void => {
  if (typeof document === "undefined") return;

  const toggleButton = document.querySelector<HTMLButtonElement>(
    ".optimization-mindmap-toggle",
  );
  const browserFullscreenButton = document.querySelector<HTMLButtonElement>(
    ".optimization-mindmap-browser-fullscreen",
  );

  if (toggleButton) {
    toggleButton.textContent = document.documentElement.classList.contains(
      MINDMAP_FULLSCREEN_CLASS,
    )
      ? "退出全屏"
      : "全屏查看";
  }

  if (browserFullscreenButton) {
    browserFullscreenButton.textContent = document.fullscreenElement
      ? "退出浏览器全屏"
      : "浏览器全屏";
  }
};

// 在思维导图容器右上角注入控制按钮，并绑定两种全屏行为。
const ensureMindMapControls = (): boolean => {
  if (typeof document === "undefined") return false;

  const wrapper = document.querySelector<HTMLElement>(
    "#markdown-content .markmap-wrapper",
  );
  if (!wrapper) return false;

  if (!wrapper.querySelector(`.${MINDMAP_CONTROLS_CLASS}`)) {
    const controls = document.createElement("div");
    controls.className = MINDMAP_CONTROLS_CLASS;

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "optimization-mindmap-toggle";
    toggleButton.addEventListener("click", () => {
      document.documentElement.classList.toggle(MINDMAP_FULLSCREEN_CLASS);
      syncMindMapControls();
    });

    const browserFullscreenButton = document.createElement("button");
    browserFullscreenButton.type = "button";
    browserFullscreenButton.className =
      "optimization-mindmap-browser-fullscreen";
    browserFullscreenButton.addEventListener("click", async () => {
      const target = document.querySelector<HTMLElement>(
        "#markdown-content .markmap-wrapper",
      );
      if (!target) return;

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (target.requestFullscreen) {
        await target.requestFullscreen();
      }

      syncMindMapControls();
    });

    controls.append(toggleButton, browserFullscreenButton);
    wrapper.append(controls);
  }

  syncMindMapControls();
  return true;
};

// 路由切换后延迟同步，等待 markmap 完成渲染再尝试挂载控制按钮。
const scheduleMindMapSync = (retry = 0): void => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    const root = document.documentElement;

    if (!isMindMapPage()) {
      root.classList.remove(MINDMAP_FULLSCREEN_CLASS);
      document
        .querySelectorAll(`.${MINDMAP_CONTROLS_CLASS}`)
        .forEach((node) => node.remove());
      return;
    }

    const controlsReady = ensureMindMapControls();
    if (!controlsReady && retry < 10) {
      scheduleMindMapSync(retry + 1);
      return;
    }

    syncMindMapControls();
  }, 80);
};

export default defineClientConfig({
  layouts: {
    Blog,
    TreasureSites,
  },

  // 客户端增强：监听路由与浏览器全屏状态，维持思维导图页面交互。
  enhance({ router }) {
    if (typeof window === "undefined") return;

    router.afterEach(() => {
      scheduleMindMapSync();
    });

    window.addEventListener("load", () => {
      scheduleMindMapSync();
    });

    document.addEventListener("fullscreenchange", () => {
      syncMindMapControls();
    });
  },

  // 全站初始化：保留首页透明导航和站点运行时长。
  setup() {
    setupTransparentNavbar({
      type: "homepage",
      threshold: 80,
      light: "#3c3c43",
      dark: "#ebebf5db",
    });

    setupRunningTimeFooter(
      "2025-06-18T20:44:30+08:00",
      {
        "/": "本站已运行 :day 天 :hour 时 :minute 分 :second 秒",
        "/en/": "Site has been running for :day days :hour hours :minute minutes :second seconds",
      },
      true,
    );
  },
});
