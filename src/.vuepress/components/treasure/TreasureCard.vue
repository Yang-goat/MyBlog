<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { TreasureSite } from "./siteData";

const props = defineProps<{
  site: TreasureSite;
}>();

const iconIndex = ref(0);

const currentIcon = computed(
  () => props.site.iconCandidates[iconIndex.value] ?? "/websites/default.svg",
);

const isExternalIcon = (icon: string): boolean => /^(https?:)?\/\//.test(icon);

const handleIconError = (): void => {
  if (iconIndex.value < props.site.iconCandidates.length - 1) {
    iconIndex.value += 1;
  }
};

watch(
  () => props.site.url,
  () => {
    iconIndex.value = 0;
  },
  { immediate: true },
);
</script>

<template>
  <a
    :href="site.url"
    class="treasure-card"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="treasure-card__icon-wrap">
      <img
        :src="isExternalIcon(currentIcon) ? currentIcon : $withBase(currentIcon)"
        :alt="`${site.name} 图标`"
        class="treasure-card__icon"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        @error="handleIconError"
      />
    </div>

    <div class="treasure-card__content">
      <div class="treasure-card__top">
        <h3 class="treasure-card__title">{{ site.name }}</h3>
        <p class="treasure-card__hostname">{{ site.hostname || "外部站点" }}</p>
      </div>

      <p class="treasure-card__desc">{{ site.desc }}</p>
    </div>
  </a>
</template>

<style scoped>
.treasure-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 0.85rem;
  height: 75%;
  overflow: hidden;
  padding: 0.95rem;
  border: 1px solid var(--treasure-card-border);
  border-radius: 1.15rem;
  background: var(--treasure-card-bg);
  color: var(--treasure-text);
  text-decoration: none;
  box-shadow: var(--treasure-card-shadow);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.treasure-card:hover,
.treasure-card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--treasure-card-border-hover);
  background: var(--treasure-card-bg-hover);
  box-shadow: var(--treasure-card-shadow-hover);
  outline: none;
}

.treasure-card__icon-wrap {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.9rem;
  background: var(--treasure-icon-wrap-bg);
  box-shadow: inset 0 0 0 1px var(--treasure-icon-wrap-border);
}

.treasure-card__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.7rem;
  object-fit: contain;
  background: var(--treasure-icon-bg);
  padding: 0.18rem;
}

.treasure-card__content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.4rem;
  min-width: 0;
}

.treasure-card__top {
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
  min-width: 0;
}

.treasure-card__title {
  margin: 0;
  color: var(--treasure-text-strong);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.32;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  max-height: calc(1.32em * 2);
  overflow-wrap: anywhere;
}

.treasure-card__hostname {
  margin: 0;
  color: var(--treasure-text-soft);
  overflow: hidden;
  font-size: 0.8rem;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.treasure-card__desc {
  margin: 0;
  color: var(--treasure-text-muted);
  font-size: 0.88rem;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  max-height: calc(1.5em * 2);
}

@media (max-width: 719px) {
  .treasure-card {
    gap: 0.75rem;
    padding: 0.9rem;
    border-radius: 1rem;
  }

  .treasure-card__icon-wrap {
    width: 2.8rem;
    height: 2.8rem;
  }
}
</style>
