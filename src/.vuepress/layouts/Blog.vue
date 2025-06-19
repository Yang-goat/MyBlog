<script setup lang="ts">
import { Blog } from "vuepress-theme-hope/blog";
import BingHeroBackground from "vuepress-theme-hope/presets/BingHeroBackground.js";
</script>

<template>
  <Blog>
    <template #heroBg>
      <BingHeroBackground />
    </template>
  </Blog>
</template>