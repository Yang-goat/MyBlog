<script setup lang="ts">
import HandbookArt from '../scenes/HandbookArt.vue';
import {openGuide} from './store';
</script>
<template><button class="handbook-prop" aria-label="翻开店长手册" @click="openGuide('contents')"><HandbookArt/><span>店长手册</span></button></template>
<style scoped>
.handbook-prop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:9px 5px;background:linear-gradient(150deg,#263a36,#101e22);border:1px solid #68867b6b;min-width:44px;width:100%;color:#b4cfc1;box-shadow:inset 0 0 16px #040d1399;cursor:pointer}.handbook-prop img{width:100%;height:86px;object-fit:contain;filter:drop-shadow(2px 5px 3px #0008);transition:transform .18s}.handbook-prop span{font-size:9px;white-space:nowrap}.handbook-prop:hover img,.handbook-prop:focus-visible img{transform:translateY(-3px) rotate(-3deg)}.handbook-prop:hover{border-color:#74c6c2;background:#243f3c}@media(max-height:500px){.handbook-prop{padding:5px 2px;gap:3px}.handbook-prop img{height:43px}.handbook-prop span{font-size:8px}}@media(prefers-reduced-motion:reduce){.handbook-prop img{transition:none}}
</style>
