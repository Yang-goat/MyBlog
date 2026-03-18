<script setup lang="ts">
import { computed, ref } from "vue";

import rawSites from "../data/websites.json";
import TreasureCard from "./TreasureCard.vue";
import TreasureToolbar from "./TreasureToolbar.vue";
import {
  TREASURE_ALL_TAG,
  buildTreasureSections,
  compareText,
  normalizeTreasureSite,
  sortTreasureSites,
  type RawTreasureSite,
} from "./siteData";

const searchQuery = ref("");
const activeTag = ref(TREASURE_ALL_TAG);

const sites = computed(() =>
  sortTreasureSites((rawSites as RawTreasureSite[]).map(normalizeTreasureSite)),
);

const totalSections = computed(
  () => new Set(sites.value.map((site) => site.primaryTag)).size,
);

const tagOptions = computed(() => {
  const counts = new Map<string, number>();

  for (const site of sites.value) {
    counts.set(site.primaryTag, (counts.get(site.primaryTag) ?? 0) + 1);
  }

  return [
    { label: TREASURE_ALL_TAG, count: sites.value.length },
    ...Array.from(counts.entries())
      .sort(([firstTag], [secondTag]) => compareText(firstTag, secondTag))
      .map(([label, count]) => ({ label, count })),
  ];
});

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase());

const filteredSites = computed(() =>
  sites.value.filter((site) => {
    const matchesTag =
      activeTag.value === TREASURE_ALL_TAG || site.primaryTag === activeTag.value;
    const matchesQuery =
      normalizedQuery.value.length === 0 ||
      site.searchText.includes(normalizedQuery.value);

    return matchesTag && matchesQuery;
  }),
);

const sections = computed(() => buildTreasureSections(filteredSites.value));

const hasActiveFilters = computed(
  () =>
    normalizedQuery.value.length > 0 || activeTag.value !== TREASURE_ALL_TAG,
);

const resetFilters = (): void => {
  searchQuery.value = "";
  activeTag.value = TREASURE_ALL_TAG;
};
</script>

<template>
  <div class="treasure-page">
    <div class="treasure-shell">
      <header class="treasure-hero">
        <div class="treasure-hero__copy">
          <p class="treasure-hero__eyebrow">Resource Atlas</p>
          <h1 class="treasure-hero__title">宝藏站点</h1>
          <p class="treasure-hero__desc">
            把常用的开发、学习、工具和资料站点收成一张稳定的导航页，便于快速检索和回访。
          </p>
        </div>

        <div class="treasure-hero__stats" aria-label="站点统计">
          <article class="treasure-stat">
            <strong>{{ sites.length }}</strong>
            <span>站点总数</span>
          </article>
          <article class="treasure-stat">
            <strong>{{ totalSections }}</strong>
            <span>主分类</span>
          </article>
          <article class="treasure-stat">
            <strong>{{ filteredSites.length }}</strong>
            <span>当前结果</span>
          </article>
        </div>
      </header>

      <TreasureToolbar
        :query="searchQuery"
        :selected-tag="activeTag"
        :tag-options="tagOptions"
        :total-sites="sites.length"
        :filtered-count="filteredSites.length"
        :total-sections="totalSections"
        @update:query="searchQuery = $event"
        @update:selected-tag="activeTag = $event"
        @reset="resetFilters"
      />

      <div v-if="sections.length" class="treasure-sections">
        <section
          v-for="section in sections"
          :key="section.tag"
          class="treasure-section"
        >
          <header class="treasure-section__header">
            <div>
              <h2 class="treasure-section__title">{{ section.tag }}</h2>
              <p class="treasure-section__count">{{ section.items.length }} 个站点</p>
            </div>
          </header>

          <div class="treasure-grid">
            <TreasureCard
              v-for="site in section.items"
              :key="site.url"
              :site="site"
            />
          </div>
        </section>
      </div>

      <section v-else class="treasure-empty">
        <h2 class="treasure-empty__title">没有匹配的站点</h2>
        <p class="treasure-empty__desc">
          可以缩短关键词，或者切换回“全部”分类重新浏览。
        </p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="treasure-empty__action"
          @click="resetFilters"
        >
          清空筛选
        </button>
      </section>
    </div>
  </div>
</template>

<style>
.treasure-page {
  --treasure-accent-strong: rgb(37 99 235);
  --treasure-accent-soft: rgb(59 130 246 / 0.14);
  --treasure-accent-border: rgb(37 99 235 / 0.34);
  --treasure-accent-text: rgb(30 64 175);
  --treasure-text: rgb(15 23 42);
  --treasure-text-strong: rgb(2 6 23);
  --treasure-text-soft: rgb(71 85 105);
  --treasure-text-muted: rgb(100 116 139);
  --treasure-panel-bg: rgb(255 255 255 / 0.88);
  --treasure-panel-border: rgb(148 163 184 / 0.2);
  --treasure-panel-divider: rgb(148 163 184 / 0.16);
  --treasure-panel-shadow: 0 16px 36px rgb(15 23 42 / 0.08);
  --treasure-input-bg: rgb(255 255 255 / 0.94);
  --treasure-input-border: rgb(148 163 184 / 0.28);
  --treasure-toggle-bg: rgb(15 23 42 / 0.06);
  --treasure-clear-bg: rgb(15 23 42 / 0.06);
  --treasure-clear-bg-hover: rgb(37 99 235 / 0.12);
  --treasure-tag-border: rgb(148 163 184 / 0.2);
  --treasure-tag-bg-hover: rgb(37 99 235 / 0.08);
  --treasure-tag-bg-active: linear-gradient(
    135deg,
    rgb(37 99 235 / 0.16),
    rgb(13 148 136 / 0.12)
  );
  --treasure-tag-count-bg: rgb(15 23 42 / 0.08);
  --treasure-card-bg: rgb(255 255 255 / 0.88);
  --treasure-card-bg-hover: rgb(255 255 255 / 0.98);
  --treasure-card-border: rgb(148 163 184 / 0.18);
  --treasure-card-border-hover: rgb(37 99 235 / 0.26);
  --treasure-card-shadow: 0 14px 30px rgb(15 23 42 / 0.06);
  --treasure-card-shadow-hover: 0 18px 38px rgb(15 23 42 / 0.1);
  --treasure-hero-bg:
    linear-gradient(135deg, rgb(255 255 255 / 0.98), rgb(248 250 252 / 0.92)),
    linear-gradient(120deg, rgb(37 99 235 / 0.08), transparent 44%);
  --treasure-icon-wrap-bg: linear-gradient(
    135deg,
    rgb(37 99 235 / 0.1),
    rgb(13 148 136 / 0.08)
  );
  --treasure-icon-wrap-border: rgb(148 163 184 / 0.12);
  --treasure-icon-bg: rgb(255 255 255 / 0.94);
  width: 100%;
  color: var(--treasure-text);
}

html.dark .treasure-page,
html[data-theme="dark"] .treasure-page {
  --treasure-accent-strong: rgb(96 165 250);
  --treasure-accent-soft: rgb(96 165 250 / 0.18);
  --treasure-accent-border: rgb(96 165 250 / 0.4);
  --treasure-accent-text: rgb(219 234 254);
  --treasure-text: rgb(226 232 240);
  --treasure-text-strong: rgb(248 250 252);
  --treasure-text-soft: rgb(148 163 184);
  --treasure-text-muted: rgb(148 163 184);
  --treasure-panel-bg: rgb(15 23 42 / 0.88);
  --treasure-panel-border: rgb(148 163 184 / 0.16);
  --treasure-panel-divider: rgb(148 163 184 / 0.14);
  --treasure-panel-shadow: 0 18px 42px rgb(2 6 23 / 0.3);
  --treasure-input-bg: rgb(15 23 42 / 0.94);
  --treasure-input-border: rgb(71 85 105 / 0.7);
  --treasure-toggle-bg: rgb(148 163 184 / 0.12);
  --treasure-clear-bg: rgb(148 163 184 / 0.12);
  --treasure-clear-bg-hover: rgb(96 165 250 / 0.2);
  --treasure-tag-border: rgb(71 85 105 / 0.9);
  --treasure-tag-bg-hover: rgb(96 165 250 / 0.14);
  --treasure-tag-bg-active: linear-gradient(
    135deg,
    rgb(59 130 246 / 0.24),
    rgb(20 184 166 / 0.18)
  );
  --treasure-tag-count-bg: rgb(148 163 184 / 0.12);
  --treasure-card-bg: rgb(15 23 42 / 0.88);
  --treasure-card-bg-hover: rgb(15 23 42 / 0.96);
  --treasure-card-border: rgb(71 85 105 / 0.62);
  --treasure-card-border-hover: rgb(96 165 250 / 0.34);
  --treasure-card-shadow: 0 18px 40px rgb(2 6 23 / 0.28);
  --treasure-card-shadow-hover: 0 22px 48px rgb(2 6 23 / 0.34);
  --treasure-hero-bg:
    linear-gradient(135deg, rgb(15 23 42 / 0.96), rgb(15 23 42 / 0.92)),
    linear-gradient(120deg, rgb(96 165 250 / 0.12), transparent 42%);
  --treasure-icon-wrap-bg: linear-gradient(
    135deg,
    rgb(30 41 59 / 0.96),
    rgb(15 23 42 / 0.98)
  );
  --treasure-icon-wrap-border: rgb(71 85 105 / 0.55);
  --treasure-icon-bg: rgb(30 41 59 / 0.94);
}
</style>

<style scoped>
.treasure-shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.treasure-hero {
  display: grid;
  gap: 1.5rem;
  padding: clamp(1.5rem, 1.15rem + 1.5vw, 2.25rem);
  border: 1px solid var(--treasure-panel-border);
  border-radius: 1.6rem;
  background: var(--treasure-hero-bg);
  box-shadow: var(--treasure-panel-shadow);
}

.treasure-hero__copy {
  display: grid;
  gap: 0.8rem;
}

.treasure-hero__eyebrow {
  margin: 0;
  color: var(--treasure-accent-strong);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.treasure-hero__title {
  margin: 0;
  color: var(--treasure-text-strong);
  font-size: clamp(2.1rem, 1.7rem + 2vw, 3.2rem);
  line-height: 1.08;
}

.treasure-hero__desc {
  max-width: 48rem;
  margin: 0;
  color: var(--treasure-text-muted);
  font-size: 1rem;
  line-height: 1.8;
}

.treasure-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.treasure-stat {
  display: grid;
  gap: 0.3rem;
  padding: 0.95rem 1rem;
  border: 1px solid var(--treasure-panel-border);
  border-radius: 1.15rem;
  background: var(--treasure-card-bg);
}

.treasure-stat strong {
  color: var(--treasure-text-strong);
  font-size: 1.35rem;
  line-height: 1;
}

.treasure-stat span {
  color: var(--treasure-text-muted);
  font-size: 0.9rem;
}

.treasure-sections {
  display: grid;
  gap: 1.6rem;
}

.treasure-section {
  display: grid;
  gap: 1rem;
}

.treasure-section__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
}

.treasure-section__title {
  margin: 0;
  color: var(--treasure-text-strong);
  font-size: 1.25rem;
}

.treasure-section__count {
  margin: 0.35rem 0 0;
  color: var(--treasure-text-muted);
  font-size: 0.9rem;
}

.treasure-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  align-items: stretch;
  gap: 1rem;
}

.treasure-empty {
  display: grid;
  justify-items: center;
  gap: 0.8rem;
  padding: 3rem 1.5rem;
  border: 1px dashed var(--treasure-panel-border);
  border-radius: 1.5rem;
  background: var(--treasure-panel-bg);
  text-align: center;
  box-shadow: var(--treasure-panel-shadow);
}

.treasure-empty__title {
  margin: 0;
  color: var(--treasure-text-strong);
  font-size: 1.3rem;
}

.treasure-empty__desc {
  max-width: 28rem;
  margin: 0;
  color: var(--treasure-text-muted);
  line-height: 1.7;
}

.treasure-empty__action {
  border: 0;
  border-radius: 999px;
  padding: 0.75rem 1.15rem;
  background: var(--treasure-clear-bg);
  color: var(--treasure-text-strong);
  font-weight: 600;
  cursor: pointer;
}

.treasure-empty__action:hover,
.treasure-empty__action:focus-visible {
  outline: none;
  background: var(--treasure-clear-bg-hover);
}

@media (max-width: 959px) {
  .treasure-hero__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 719px) {
  .treasure-shell {
    gap: 1.2rem;
  }

  .treasure-hero {
    padding: 1.2rem;
    border-radius: 1.2rem;
  }

  .treasure-hero__stats {
    grid-template-columns: 1fr;
  }

  .treasure-grid {
    grid-template-columns: 1fr;
  }
}
</style>
