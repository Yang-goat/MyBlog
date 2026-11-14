<script setup lang="ts">
defineProps<{kind:'backpack'|'crate'|'labeler'|'pouch'|'freight'}>();
const images = {pouch:'/cyber-shop/scenery/storage-pouch.webp',freight:'/cyber-shop/scenery/storage-freight.webp',backpack:'/cyber-shop/scenery/storage-backpack.webp',crate:'/cyber-shop/scenery/storage-crate.webp',labeler:'/cyber-shop/scenery/storage-labeler.webp'};
</script>
<template><img :src="images[kind]" alt="" draggable="false" class="storage-art"/></template>
<style scoped>.storage-art{object-fit:contain;display:block;pointer-events:none;filter:drop-shadow(0 5px 5px #0006)}</style>
