<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { withBase } from "vuepress/client";
import KineticKnot from "./portfolio/KineticKnot.vue";

const projects = [
  {
    slug: "hex-mahjong",
    title: "海克斯麻将",
    type: "桌游工具",
    action: "打开主持台",
    alt: "三张海克斯卡牌在深蓝色桌垫上展开，中央是棱彩卡背",
    intro: "给四人实体麻将加一副电子牌。用主持台抽强化、签契约、翻开世界事件，让 192 张卡牌改变八局牌桌的走向。",
  },
  {
    slug: "cyber-shop",
    title: "赛博杂货铺",
    type: "模拟经营 · 试玩版",
    action: "进入小店",
    alt: "雨夜的港口街道上，杂货铺亮着暖黄色的灯",
    intro: "在雨夜街角接手一间小店。和街坊议价、翻新旧设备，选一门手艺做下去，攒够钱买下自己的铺面。",
  },
  {
    slug: "color-sudoku",
    title: "涂色数独",
    type: "逻辑解谜 · 数织",
    action: "翻开贴纸册",
    alt: "《涂色数独》实机画面：奶团的贴纸工坊、数织棋盘和道具袋",
    intro: "和小山羊奶团一起解开 36 道数织，从 5×5 小院走到 20×20 山谷，把找到的贴纸收进册子。",
  },
];

const knot = ref<InstanceType<typeof KineticKnot> | null>(null);
const knotActive = ref(false);
let cardFrame = 0;
let pointerCard: HTMLElement | null = null;
let cardArt: HTMLElement | null = null;
let cardBounds: DOMRect | null = null;
let clientX = 0;
let clientY = 0;

onMounted(() => {
  window.addEventListener("scroll", invalidateCardBounds, { passive: true, capture: true });
  window.addEventListener("resize", invalidateCardBounds);
});
onUnmounted(() => {
  window.removeEventListener("scroll", invalidateCardBounds, true);
  window.removeEventListener("resize", invalidateCardBounds);
  leaveCard();
});

function invalidateCardBounds() {
  cardBounds = null;
}

function paintCard() {
  cardFrame = 0;
  if (!pointerCard || !cardArt) return;
  const bounds = cardBounds ??= pointerCard.getBoundingClientRect();
  const x = (clientX - bounds.left) / bounds.width * 2 - 1;
  const y = (clientY - bounds.top) / bounds.height * 2 - 1;
  cardArt.style.setProperty("--pointer-x", x.toFixed(3));
  cardArt.style.setProperty("--pointer-y", y.toFixed(3));
}

function trackCard(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  const target = event.currentTarget as HTMLElement;
  if (pointerCard !== target) {
    leaveCard();
    pointerCard = target;
    cardArt = target.querySelector<HTMLElement>(".card-art");
  }
  clientX = event.clientX;
  clientY = event.clientY;
  if (!cardFrame) cardFrame = requestAnimationFrame(paintCard);
}

function leaveCard() {
  if (cardFrame) cancelAnimationFrame(cardFrame);
  cardFrame = 0;
  cardArt?.style.removeProperty("--pointer-x");
  cardArt?.style.removeProperty("--pointer-y");
  cardBounds = null;
  pointerCard = null;
  cardArt = null;
}
</script>

<template>
  <div id="studio-top" class="portfolio-shell"
    @pointermove="knot?.movePointer($event)" @pointerleave="knot?.centerPointer()">
    <a class="studio-skip" href="#works">跳到作品索引</a>
    <header class="studio-header studio-width">
      <div class="studio-brand" aria-label="Goat_Yang Studio">
        <span class="studio-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <b>Goat_Yang</b><span class="studio-wordmark">Studio</span>
      </div>
      <a class="back-link" :href="withBase('/')">返回博客 <span aria-hidden="true">↗</span></a>
    </header>

    <main>
      <section class="portfolio-hero studio-width" aria-labelledby="portfolio-title">
        <div class="hero-copy">
          <span class="hero-kicker" lang="en">Creative coding</span>
          <h1 id="portfolio-title"><span class="hero-author">Goat_Yang</span> <em>AI</em> 作品集<span class="title-period" aria-hidden="true">.</span></h1>
          <p>我和 AI 一起，把日常的想法做成可以亲手体验的作品。</p>
          <a class="browse-link" href="#works">浏览作品 <span aria-hidden="true">↓</span></a>
        </div>
        <div class="knot-stage" :class="{ 'is-active': knotActive }">
          <div class="stage-grid" aria-hidden="true"></div>
          <div class="stage-orbit" aria-hidden="true"></div>
          <div class="stage-object" aria-hidden="true">
            <KineticKnot ref="knot" @active-change="knotActive = $event" />
          </div>
        </div>
      </section>

      <section id="works" class="work-section studio-width" aria-labelledby="works-title" tabindex="-1">
        <div class="works-heading">
          <h2 id="works-title">作品索引</h2>
          <span class="works-count">{{ projects.length }} 件作品</span>
        </div>
        <div class="work-grid">
          <a
            v-for="work in projects"
            :key="work.slug"
            class="project-card"
            :href="withBase('/' + work.slug + '/')"
            :aria-label="work.title + '，' + work.action"
            @pointermove="trackCard" @pointerleave="leaveCard"
          >
            <div class="card-art">
              <img
                :src="withBase('/assets/ai-portfolio/' + work.slug + '.webp')"
                :alt="work.alt" width="1200" height="675" decoding="async"
              >
              <span class="card-open">{{ work.action }} <span aria-hidden="true">↗</span></span>
            </div>
            <div class="card-heading">
              <h3>{{ work.title }}</h3>
              <span class="card-type">{{ work.type }}</span>
            </div>
            <p>{{ work.intro }}</p>
          </a>
        </div>
      </section>
    </main>
    <footer class="studio-footer studio-width">
      <span lang="en">Goat_Yang <b>/</b> Studio</span>
      <a href="#studio-top">回到顶部 <span aria-hidden="true">↑</span></a>
    </footer>
  </div>
</template>

<style scoped src="./portfolio/portfolio.css"></style>
