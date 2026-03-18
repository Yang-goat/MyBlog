<script setup lang="ts">
import { Layout } from "vuepress-theme-hope/client";

import TreasureSitesPage from "../components/treasure/TreasureSitesPage.vue";
</script>

<template>
  <Layout>
    <template #default>
      <div class="treasure-layout">
        <TreasureSitesPage />
      </div>
    </template>
  </Layout>
</template>

<style>
.treasure-sites-layout .vp-page {
  padding-bottom: 3rem;
}

.treasure-layout {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  overflow-x: clip;
  padding: clamp(2rem, 1.2rem + 2vw, 4rem) 1.25rem 4rem;
}

.treasure-layout::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(circle at top left, rgb(61 139 253 / 0.08), transparent 34%),
    radial-gradient(circle at top right, rgb(15 118 110 / 0.08), transparent 30%),
    linear-gradient(180deg, rgb(248 250 252 / 0.95), transparent 28rem);
}

html.dark .treasure-layout::before,
html[data-theme="dark"] .treasure-layout::before {
  background:
    radial-gradient(circle at top left, rgb(96 165 250 / 0.15), transparent 34%),
    radial-gradient(circle at top right, rgb(45 212 191 / 0.1), transparent 30%),
    linear-gradient(180deg, rgb(2 6 23 / 0.96), rgb(15 23 42 / 0.7) 22rem, transparent 34rem);
}

@media (max-width: 719px) {
  .treasure-layout {
    padding-inline: 0.9rem;
    padding-top: 1.5rem;
  }
}
</style>
