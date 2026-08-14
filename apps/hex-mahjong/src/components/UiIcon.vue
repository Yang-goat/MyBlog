<script setup lang="ts">
defineProps<{
  name: "bolt" | "cards" | "check" | "close" | "gear" | "undo" | "book" | "play" | "score" | "spark" | "plus";
  size?: number;
}>();
</script>

<template>
  <svg
    class="ui-icon"
    :width="size ?? 24"
    :height="size ?? 24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path v-if="name === 'bolt'" d="M13.5 2 5 13h6l-.5 9L19 10h-6l.5-8Z" />
    <g v-else-if="name === 'cards'">
      <path d="m7 4 10-2 2.4 13.2-10 1.8L7 4Z" />
      <path d="M4 7h3l2 11h9v3H6L4 7Z" />
    </g>
    <path v-else-if="name === 'check'" d="m5 12 4.2 4.2L19 6.5" />
    <path v-else-if="name === 'close'" d="m6 6 12 12M18 6 6 18" />
    <path v-else-if="name === 'gear'" d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm0-5.2 1 2.2 2.4.6 2-1.3 2.1 2.1-1.3 2 .6 2.4 2.2 1v3l-2.2 1-.6 2.4 1.3 2-2.1 2.1-2-1.3-2.4.6-1 2.2h-3l-1-2.2-2.4-.6-2 1.3-2.1-2.1 1.3-2-.6-2.4-2.2-1v-3l2.2-1 .6-2.4-1.3-2 2.1-2.1 2 1.3 2.4-.6 1-2.2h3Z" />
    <path v-else-if="name === 'undo'" d="M8 7H3v-5M3.6 6.4A9 9 0 1 1 4 18" />
    <path v-else-if="name === 'book'" d="M4 4.5A3.5 3.5 0 0 1 7.5 1H11v18H7.5A3.5 3.5 0 0 0 4 22.5v-18Zm16 0A3.5 3.5 0 0 0 16.5 1H13v18h3.5a3.5 3.5 0 0 1 3.5 3.5v-18Z" />
    <path v-else-if="name === 'play'" d="m8 5 11 7-11 7V5Z" />
    <path v-else-if="name === 'score'" d="M5 3h14v18H5V3Zm3 4h8M8 11h2m4 0h2m-8 4h2m4 0h2" />
    <path v-else-if="name === 'spark'" d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Zm7 14 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    <path v-else d="M12 5v14M5 12h14" />
  </svg>
</template>

<style scoped>
.ui-icon {
  display: block;
  flex: none;
  overflow: visible;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
