<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vuepress/client";
import { Blog } from "vuepress-theme-hope/blog";
import BingHeroBackground from "vuepress-theme-hope/presets/BingHeroBackground.js";
import HitokotoBlogHero from "vuepress-theme-hope/presets/HitokotoBlogHero.js";

const { frontmatter, siteLocale } = useData();

const heroText = computed(() =>
  frontmatter.value.heroText ?? siteLocale.value.title ?? "Hello",
);
const heroImage = computed(() =>
  frontmatter.value.heroImage ? withBase(frontmatter.value.heroImage) : null,
);
const heroImageDark = computed(() =>
  frontmatter.value.heroImageDark
    ? withBase(frontmatter.value.heroImageDark)
    : null,
);
const heroAlt = computed(() => frontmatter.value.heroAlt ?? heroText.value);
const heroImageStyle = computed(() => frontmatter.value.heroImageStyle ?? null);
</script>

<template>
  <Blog>
    <template #heroBg>
      <BingHeroBackground />
    </template>
    <template #heroLogo />
    <template #heroInfo>
      <HitokotoBlogHero
        :text="heroText"
        :image="heroImage"
        :image-dark="heroImageDark"
        :alt="heroAlt"
        :image-style="heroImageStyle"
      />
    </template>
  </Blog>
</template>
