<!-- docs/.vuepress/layouts/TreasureSites.vue -->
<script setup lang="ts">
import { Layout } from "vuepress-theme-hope/client";
import Websites from "../components/Websites.vue";
</script>

<template>
  <Layout>
    <template #default>
      <div class="treasure-fullscreen-wrapper">
        <Websites />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.treasure-fullscreen-wrapper {
  width: 100vw;
  max-width: 100vw;
  /* ✅ 顶部留白 + 左右 4vw 自适应留白 */
  padding: 4rem 4vw 4rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
