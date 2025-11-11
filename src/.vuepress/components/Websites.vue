<script setup lang="ts">
import { ref, computed } from "vue";
import siteData from "./data/websites.json";

// ✅ 搜索状态
const searchQuery = ref("");
const activeTag = ref("全部");

// ✅ 先对数据进行排序（支持中文拼音 + 英文字典序）
const sortedData = computed(() => {
  return [...siteData].sort((a, b) =>
    a.name.localeCompare(b.name, "zh-CN", { sensitivity: "base" })
  );
});

// ✅ 生成标签列表（同样基于排序后的数据）
const tags = computed(() => {
  const set = new Set<string>();
  sortedData.value.forEach((item) => item.tags.forEach((t) => set.add(t)));
  return Array.from(set);
});

// ✅ 再进行过滤
const filtered = computed(() =>
  sortedData.value.filter((item) => {
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const tagMatch =
      activeTag.value === "全部" || item.tags.includes(activeTag.value);
    return nameMatch && tagMatch;
  })
);

// ✅ 限制描述长度
function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}
</script>

<template>
  <div class="websites-container">
    <!-- ✅ 渐变大标题 -->
    <h1 class="treasure-title">宝藏站点</h1>

    <!-- ✅ 搜索框 -->
    <div class="search-wrapper">
      <input
        v-model="searchQuery"
        class="search-input"
        type="text"
        placeholder="输入关键词搜索站点..."
      />
    </div>

    <!-- ✅ Tailwind 胶囊标签栏 -->
    <div class="tag-bar">
      <button
        :class="['tag-pill', activeTag === '全部' ? 'active' : '']"
        @click="activeTag = '全部'"
      >全部</button>
      <button
        v-for="tag in tags"
        :key="tag"
        :class="['tag-pill', activeTag === tag ? 'active' : '']"
        @click="activeTag = tag"
      >{{ tag }}</button>
    </div>

    <!-- ✅ 网格卡片，自适应且不足一行时自动居中 -->
    <div class="cards-grid">
      <a
        v-for="item in filtered"
        :key="item.url"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="website-card"
      >
        <img :src="$withBase(item.icon)" class="icon" :alt="item.name" />
        <div class="info">
          <h3>{{ item.name }}</h3>
          <p>{{ truncate(item.desc, 60) }}</p>
        </div>
      </a>

      <p v-if="filtered.length === 0" class="empty-hint">没有匹配的站点</p>
    </div>
  </div>
</template>

<style scoped>
.websites-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ✅ 渐变标题（配合 index.scss 中的 clip-text 渐变增强） */
.treasure-title {
  font-size: 2.6rem;
  font-weight: 800;
  text-align: center;
  padding-bottom: 0.8rem;
  margin-top: 1rem; /* 轻微视觉提升 */
  position: relative;
  color: var(--vp-c-text);
}

/* ✅ 渐变下划线（保留） */
.treasure-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 140px;
  height: 4px;
  transform: translateX(-50%);
  background: linear-gradient(
    90deg,
    var(--vp-c-accent) 0%,
    var(--vp-c-accent-hover) 100%
  );
  border-radius: 2px;
}

/* ✅ 搜索框 */
.search-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.search-input {
  width: 40%;
  padding: 0.6rem 1rem;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text);
  border-radius: 10px;
  transition: all 0.2s;
}
.search-input:focus {
  border-color: var(--vp-c-accent);
  outline: none;
  box-shadow: 0 0 6px var(--vp-c-accent-soft);
}

/* ✅ 胶囊标签样式 */
.tag-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
}
.tag-pill {
  padding: 0.4rem 1rem;
  border-radius: 999px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.25s ease;
}
.tag-pill:hover {
  transform: translateY(-2px);
  background: var(--vp-c-bg-elv);
}
.tag-pill.active {
  background: var(--vp-c-accent-soft);
  color: var(--vp-c-accent);
  border-color: var(--vp-c-accent);
}

/* ✅ 卡片容器 - 使用 Flex 自动居中布局 */
.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: center; /* ⭐ 不足一行时自动居中 */
  width: 100%;
}

/* ✅ 卡片本体 - 固定宽度，避免被拉伸或碰撞 */
.website-card {
  flex: 0 0 300px; /* ⭐ 固定 300px 宽 */
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  color: var(--vp-c-text);
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 2px 6px var(--vp-c-shadow);
}
.website-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px var(--vp-c-shadow);
}

.icon {
  width: 55px;
  height: 48px;
  border-radius: 8px;
}
.info h3 {
  margin: 0;
  font-size: 1.1rem;
}
.info p {
  margin: 0.2rem 0 0;
  color: var(--vp-c-text-subtle);
}

/* ✅ 空列表提示 */
.empty-hint {
  text-align: center;
  margin-top: 1rem;
  color: var(--vp-c-text-mute);
}
</style>
