<script setup lang="ts">
defineProps<{open?:boolean}>();
</script>
<template><img :src="open?'/cyber-shop/scenery/handbook-spread.webp':'/cyber-shop/scenery/manager-handbook.webp'" :alt="open?'':'店长手册'" draggable="false"/></template>
