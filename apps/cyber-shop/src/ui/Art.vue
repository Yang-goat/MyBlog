<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps<{ id: string; label?: string; eager?: boolean }>();
const failed = ref(false);
watch(() => props.id, () => failed.value = false);
</script>

<template>
  <img v-if="!failed" :src="`/cyber-shop/art/${id}.webp`" :alt="label ?? ''" :loading="eager ? 'eager' : 'lazy'" draggable="false" @error="failed = true" />
  <span v-else class="art-failed"><span>图像载入失败</span><button @click.stop="failed = false">重试</button></span>
</template>
