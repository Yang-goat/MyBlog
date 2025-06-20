<template>
  <section class="link-div">
    <div class="link-nav">
      <h1>宝藏站点</h1>

      <div class="tabs">
        <button
          v-for="category in categories"
          :key="category"
          :class="{ active: category === activeCategory }"
          @click="switchCategory(category)"
        >
          {{ category }}
        </button>
      </div>

      <input
        type="text"
        v-model="searchText"
        placeholder="搜索网址名称..."
        class="search-box"
        @input="filterLinks"
      />

      <div class="links-container"></div>
    </div>
  </section>
</template>

<script setup>
import { useLinkNavigator } from "./LinkNavigator.js"
import "./LinkNavigator.css"

const {
  categories,
  activeCategory,
  searchText,
  switchCategory,
  filterLinks,
} = useLinkNavigator()
</script>
