<script setup lang="ts">
import { computed, ref } from "vue";

interface TagOption {
  label: string;
  count: number;
}

const props = defineProps<{
  query: string;
  selectedTag: string;
  tagOptions: TagOption[];
  totalSites: number;
  filteredCount: number;
  totalSections: number;
}>();

const emit = defineEmits<{
  "update:query": [value: string];
  "update:selectedTag": [value: string];
  reset: [];
}>();

const isMobileFiltersOpen = ref(false);

const hasFilters = computed(
  () => props.query.trim().length > 0 || props.selectedTag !== "全部",
);

const updateQuery = (event: Event): void => {
  emit("update:query", (event.target as HTMLInputElement).value);
};

const toggleMobileFilters = (): void => {
  isMobileFiltersOpen.value = !isMobileFiltersOpen.value;
};

const selectTag = (tag: string): void => {
  emit("update:selectedTag", tag);
};

const resetFilters = (): void => {
  emit("reset");
  isMobileFiltersOpen.value = false;
};
</script>

<template>
  <section class="treasure-toolbar" aria-label="站点筛选">
    <div class="treasure-toolbar__search">
      <label class="treasure-toolbar__label" for="treasure-search">搜索站点</label>
      <input
        id="treasure-search"
        :value="query"
        class="treasure-toolbar__input"
        type="search"
        placeholder="搜索名称、描述、标签或域名"
        @input="updateQuery"
      />
    </div>

    <div class="treasure-toolbar__meta">
      <p class="treasure-toolbar__summary">
        共 {{ totalSites }} 个站点，{{ totalSections }} 个分类，当前匹配
        {{ filteredCount }} 个结果
      </p>

      <div class="treasure-toolbar__actions">
        <button
          type="button"
          class="treasure-toolbar__toggle"
          :aria-expanded="isMobileFiltersOpen"
          @click="toggleMobileFilters"
        >
          {{ isMobileFiltersOpen ? "收起筛选" : "筛选分类" }}
        </button>

        <button
          v-if="hasFilters"
          type="button"
          class="treasure-toolbar__clear treasure-toolbar__clear--desktop"
          @click="resetFilters"
        >
          清空筛选
        </button>
      </div>
    </div>

    <div
      :class="[
        'treasure-toolbar__panel',
        isMobileFiltersOpen && 'is-mobile-open',
      ]"
    >
      <div class="treasure-toolbar__tags">
        <button
          v-for="option in tagOptions"
          :key="option.label"
          type="button"
          :class="[
            'treasure-toolbar__tag',
            option.label === selectedTag && 'is-active',
          ]"
          @click="selectTag(option.label)"
        >
          <span>{{ option.label }}</span>
          <span class="treasure-toolbar__tag-count">{{ option.count }}</span>
        </button>
      </div>

      <button
        v-if="hasFilters"
        type="button"
        class="treasure-toolbar__clear treasure-toolbar__clear--mobile"
        @click="resetFilters"
      >
        清空筛选
      </button>
    </div>
  </section>
</template>

<style scoped>
.treasure-toolbar {
  position: sticky;
  top: calc(var(--navbar-height, 3.75rem) + 0.9rem);
  z-index: 10;
  display: grid;
  gap: 1rem;
  padding: 1.1rem;
  border: 1px solid var(--treasure-panel-border);
  border-radius: 1.25rem;
  background: var(--treasure-panel-bg);
  backdrop-filter: blur(14px);
  box-shadow: var(--treasure-panel-shadow);
}

.treasure-toolbar__search {
  display: grid;
  gap: 0.55rem;
}

.treasure-toolbar__label {
  color: var(--treasure-text-soft);
  font-size: 0.9rem;
  font-weight: 600;
}

.treasure-toolbar__input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--treasure-input-border);
  border-radius: 0.95rem;
  background: var(--treasure-input-bg);
  color: var(--treasure-text);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.treasure-toolbar__input::placeholder {
  color: var(--treasure-text-soft);
}

.treasure-toolbar__input:focus {
  border-color: var(--treasure-accent-strong);
  outline: none;
  box-shadow: 0 0 0 4px var(--treasure-accent-soft);
}

.treasure-toolbar__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.treasure-toolbar__summary {
  margin: 0;
  color: var(--treasure-text-muted);
  font-size: 0.94rem;
  line-height: 1.5;
}

.treasure-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.treasure-toolbar__toggle,
.treasure-toolbar__clear {
  border: 0;
  border-radius: 999px;
  padding: 0.55rem 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.treasure-toolbar__toggle {
  display: none;
  background: var(--treasure-toggle-bg);
  color: var(--treasure-text-strong);
}

.treasure-toolbar__clear {
  background: var(--treasure-clear-bg);
  color: var(--treasure-text-strong);
}

.treasure-toolbar__toggle:hover,
.treasure-toolbar__toggle:focus-visible,
.treasure-toolbar__clear:hover,
.treasure-toolbar__clear:focus-visible {
  transform: translateY(-1px);
  background: var(--treasure-clear-bg-hover);
  outline: none;
}

.treasure-toolbar__panel {
  display: grid;
  gap: 0.9rem;
}

.treasure-toolbar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.treasure-toolbar__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--treasure-tag-border);
  border-radius: 999px;
  padding: 0.55rem 0.85rem;
  background: transparent;
  color: var(--treasure-text);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.treasure-toolbar__tag:hover,
.treasure-toolbar__tag:focus-visible {
  transform: translateY(-1px);
  border-color: var(--treasure-accent-border);
  background: var(--treasure-tag-bg-hover);
  outline: none;
}

.treasure-toolbar__tag.is-active {
  border-color: var(--treasure-accent-border);
  background: var(--treasure-tag-bg-active);
  color: var(--treasure-accent-text);
}

.treasure-toolbar__tag-count {
  display: inline-grid;
  place-items: center;
  min-width: 1.5rem;
  min-height: 1.5rem;
  border-radius: 999px;
  padding-inline: 0.35rem;
  background: var(--treasure-tag-count-bg);
  font-size: 0.8rem;
  line-height: 1;
}

.treasure-toolbar__clear--mobile {
  display: none;
  justify-self: start;
}

@media (max-width: 719px) {
  .treasure-toolbar {
    position: static;
    gap: 0.8rem;
    padding: 0.95rem;
    border-radius: 1rem;
    backdrop-filter: none;
  }

  .treasure-toolbar__meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .treasure-toolbar__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .treasure-toolbar__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .treasure-toolbar__clear--desktop {
    display: none;
  }

  .treasure-toolbar__panel {
    display: none;
    border-top: 1px solid var(--treasure-panel-divider);
    padding-top: 0.8rem;
  }

  .treasure-toolbar__panel.is-mobile-open {
    display: grid;
  }

  .treasure-toolbar__clear--mobile {
    display: inline-flex;
  }

  .treasure-toolbar__tag {
    min-height: 2.25rem;
    padding-inline: 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
