<script setup lang="ts">
import { computed } from 'vue';
import type { Sticker } from '../contracts';
const props = withDefaults(defineProps<{ sticker: Sticker; animate?: boolean; inset?: boolean }>(), { animate: false, inset: true });
const squares = computed(() => props.sticker.colors.flatMap((color, at) => color === null ? [] : [{ color, at, x: at % props.sticker.size, y: Math.floor(at / props.sticker.size) }]));
// Trace only exposed edges, not the interior edges between coloured tiles. A slim keyline leaves one-cell gaps open.
const edge = computed(() => {
  const { size, colors } = props.sticker;
  return squares.value.flatMap(({ x, y, at }) => [
    (!y || colors[at - size] === null) && `M${x} ${y}h1`,
    (x === size - 1 || colors[at + 1] === null) && `M${x + 1} ${y}v1`,
    (y === size - 1 || colors[at + size] === null) && `M${x + 1} ${y + 1}h-1`,
    (!x || colors[at - 1] === null) && `M${x} ${y + 1}v-1`,
  ].filter(Boolean)).join('');
});
const box = computed(() => props.inset ? `-.55 -.55 ${props.sticker.size + 1.1} ${props.sticker.size + 1.1}` : `0 0 ${props.sticker.size} ${props.sticker.size}`);
</script>

<template>
  <svg class="sticker-print" :class="{ 'ink-to-color': animate }" data-sticker="" :viewBox="box" :aria-label="sticker.name" role="img" overflow="visible">
    <g class="sticker-edge" fill="none" stroke-linecap="round" stroke-linejoin="round"><path :d="edge" stroke="#9c816b" stroke-width=".29"/><path :d="edge" stroke="#fffdf8" stroke-width=".25"/></g>
    <g shape-rendering="crispEdges"><rect v-for="pixel in squares" :key="pixel.at" :data-pixel="pixel.at" :x="pixel.x" :y="pixel.y" width="1" height="1" :fill="pixel.color"/></g>
    <g v-if="animate" class="sticker-underprint" fill="#745b4d" shape-rendering="crispEdges"><rect v-for="pixel in squares" :key="pixel.at" :x="pixel.x" :y="pixel.y" width="1" height="1"/></g>
  </svg>
</template>
