<script setup lang="ts">
import { computed, useId } from 'vue';
const props = withDefaults(defineProps<{ pose?: 'sit' | 'point' | 'press' }>(), { pose: 'sit' });
const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
const poseLabel = computed(() => ({ sit: '坐在纸边的奶团', point: '奶团用蹄尖指向线索', press: '奶团正把贴纸边角按平' })[props.pose]);
</script>

<template>
  <svg class="naituan" :data-mascot="pose" viewBox="0 0 228 182" role="img" :aria-label="poseLabel" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter :id="id+'cut'" x="-15%" y="-15%" width="135%" height="135%" color-interpolation-filters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3.1" result="cutshape"/>
        <feFlood flood-color="#fffdf5"/><feComposite in2="cutshape" operator="in" result="whiteEdge"/>
        <feDropShadow in="whiteEdge" dx=".5" dy="1.5" stdDeviation=".8" flood-color="#8a7758" flood-opacity=".46"/>
        <feMerge><feMergeNode/><feMergeNode in="whiteEdge"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient :id="id+'wool'" x1="0" x2=".32" y1="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#fffdf2"/><stop offset=".57" stop-color="#fff8e5"/><stop offset="1" stop-color="#ecd5b5"/></linearGradient>
      <linearGradient :id="id+'horn'" x1="0" x2="1" y1="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#f6d49c"/><stop offset=".52" stop-color="#dba16a"/><stop offset="1" stop-color="#b97d4f"/></linearGradient>
      <linearGradient :id="id+'apricot'" x1="0" x2=".8" y1="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#f6b082"/><stop offset="1" stop-color="#e58c63"/></linearGradient>
    </defs>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <!-- A graphite ground, not a second illustration beneath the earned sticker. -->
      <g v-if="pose !== 'press'" stroke="#b4ab8f" stroke-width="1.3" opacity=".65"><path d="M47 164.7q26 2.5 55 1.6m12.5.4q29 1.6 53-2.7M56 169q15 2 29 1.5m49-.5 18-1.2"/><path d="m49 163-4-1m124 .5 5-1.7"/></g>
      <g :filter="`url(#${id}cut)`" :transform="pose === 'press' ? 'translate(4 2) rotate(7 119 143)' : undefined" stroke="#634b3f" stroke-width="2.65">
        <!-- Tail, bean-shaped rump, woollen chest and split hooves. -->
        <path d="M153 118q11-3 17-14c4 4 5 9 3 13q5-1 8-5c0 12-8 20-24 19z" :fill="`url(#${id}wool)`"/>
        <path d="M167 120q-3.8 3.7-9.5 4.5" stroke="#c4a986" stroke-width="1.3"/>
        <path d="M93 102c-15 5-23 18-22 30q-3 5 .9 9-2 6 3.5 9.7 2 8 13 10.5c12 3 24 1.2 30.5 1.3 12 .2 25.8 1.7 36.5-5.9 10-7 11.5-19.6 6.7-31.4-4.8-12.3-14.8-20.3-29.8-24.2z" :fill="`url(#${id}wool)`"/>
        <path d="M148 128q11 5 7.2 16-2 5.5-8 8.4m-8.5.9q-2 2.6-5 3.3" stroke="#c3a47d" stroke-width="1.5"/>
        <path d="M120 151c-4-1-8.5.7-11 4.3-3.5 4.3-1.8 8.6 4.8 9.3 4.2.4 9.3.1 12.8-1.8 2.7-2 1.8-5.7-1.8-7.5" fill="#d1aa87"/><path d="M112 161q1.7-2.9 3.9-3.6" stroke-width="1.4"/>
        <path d="M86.6 149.7c-6.8-2.2-13.5-.1-17.1 4.5-3.4 4.5-1.1 8.7 6 9.7 6.5 1 12.2-.1 14.4-2.8 1.5-2.7-.2-6.6-3.3-8.1" fill="#d6b08c"/><path d="M73 160q1.1-2.8 3.2-4" stroke-width="1.4"/>
        <!-- Brushed apricot scarf and fishtail, tucked beneath the cheek. -->
        <path d="M133.2 105c6.4-1.8 13.4-.4 16 3.5-2.5 4.4-6.2 7.3-10 7.4 6.8.9 11.8 5.5 12.4 11l-8.2-2.1-3.4 4c-5-3.8-7.5-10.4-7.7-16.4" :fill="`url(#${id}apricot)`"/>
        <path d="M83.5 100.3c14.9 7 37.1 10.2 53.3 3.1l3.1 9.8-11.5 3.3c-4.2 6.6-10.6 15.6-16.3 19.2-9.1-2.9-20-9.8-25.4-16.6l-6.2-5.2z" :fill="`url(#${id}apricot)`"/>
        <path d="M87 111.6q19.4 9.6 43.7.7m-37.8 6.1q10.2 8.6 18.7 12.1 4.7-3.8 8.6-8.8" stroke="#a25f46" stroke-width="1.6"/><path d="M90.1 114.4q20 8.4 37.3.8m-10.3 9.2-4.2 3.4" stroke="#ffddaa" stroke-width="1.15" stroke-dasharray="2.4 3.6"/>
        <!-- The horns are short, caramel and ringed; the bent right ear is milk-cream. -->
        <g :transform="pose === 'point' ? 'rotate(-7 110 100)' : pose === 'press' ? 'translate(0 4) rotate(-10 105 101)' : undefined">
          <path d="M82.6 44c-7.7-4.8-15.3-15.6-14.8-26.7.1-3.8 2.9-5.4 5.2-2.4 5 6.3 12.6 9 16.7 14.4 3.5 4.7 2.5 10.1-1.2 13.6z" :fill="`url(#${id}horn)`"/>
          <path d="M128.3 41c-.2-8.3 3.7-14.7 9.2-19.7 4.1-3.8 7.3-9.5 8.2-15.5.5-3.1 3.5-3.6 5-.5 5.2 11.3 1.1 25.8-8 34.5l-7.8 5z" :fill="`url(#${id}horn)`"/>
          <g stroke="#9a674a" stroke-width="1.55"><path d="M70.9 25.7q3.1 1.9 7.6.1m-3.9 8.6q4.4.8 8.1-1.8m55.6-9.4q5.1 3.5 10.2 2.2m-14.3 5.2q4 3.3 9.1 3.2m.2-18.8q3.3 1.9 7.5 1.1"/></g>
          <path d="M78.8 55.4C67.4 47.2 55.7 47 42.2 45.1c1 8.4 7.2 19.7 15.8 25.5 7.8 5.4 16.5 4.8 22.2-.6" :fill="`url(#${id}wool)`"/>
          <path d="M49.6 51.4q15.5 2.8 21.7 12.6c-9.2.4-17.3-4.4-21.7-12.6z" fill="#edc0aa" stroke="none"/><path d="M52.6 54.1q9.6 2.5 14.6 7.1" stroke="#c58e76" stroke-width="1.2"/>
          <path d="M140.8 54c11.8-7.6 22.1-9.3 37-10.2 1.7 1.4-2.4 8.2-5.4 12.8-2.8 4.5-4.4 12.2-13.1 16.7q-10.8 4.7-17.4-2.4z" :fill="`url(#${id}wool)`"/>
          <path d="M150.6 62.3q8.5-8.2 22.4-12.1-4.5 4.7-7.4 10.5-4.6 9.2-13.6 6.6z" fill="#efc4ae" stroke="none"/><path d="M174.8 48.8c-4.6 3.3-8.2 6.3-10.3 10.1" stroke="#ad816a" stroke-width="1.3"/>
          <path d="M73.9 48.3c-5.4-.8-8.6 3.9-6.4 9.1-7 6.2-7.4 16.7-3.5 22.8-3.6 4.4-2.4 9.3 1.8 11.2-1.5 5.3 2.9 10 9.1 9.7 3.4 6.8 12.1 10.2 21.2 10.8 1.5 3 4.1 6.1 7.6 7.5l2.3-4q2.5 2.1 4.2 4c4.1-1.3 7.5-5.3 8.8-8.1 8.4.2 16.9-2.7 21.4-6.8 6.1.9 11.4-2.2 11.4-7.4 5.2-1.1 7.8-7.1 4.3-11.6 4.2-7.2 2-17.1-3.9-22.1 2.2-5.2-1.6-11.4-7.7-11.3-.1-9-8.6-15.1-16.5-13.3-3-5.1-9.3-7-15.4-5-6.6-5-15.2-3.8-19.2 2.2-5.2-2-11 .6-13.1 6.1-3.6-.5-6.1 2.2-6.4 6.2z" :fill="`url(#${id}wool)`"/>
          <!-- One cinnamon forelock, a little beard and a hidden spiral make a readable silhouette. -->
          <path d="M84.3 49.4c-3.3-3.2-1.1-9.8 4.5-10.2 2.4-6.3 8.5-8.3 13.7-5.3 3.1-5.6 11-7.7 16.6-3.4 3.1.1 5.1 2.1 5.8 5-5 0-7.7 2.2-8.3 5.8-2.4 5.1-8.7 6.6-13.1 3.7-3.2 3.6-8.2 4.7-12 2.2-2.6 2.3-5 3.3-7.2 2.2z" fill="#dfb48d" stroke="none"/>
          <path d="M84.5 50.8c1.6-2 3.3-2.6 5.5-1.6 3.7 2.6 7.1 1.1 8.4-2.3 1.9-5.4 9.1-6.7 12.3-3.4 2.3 2.9.5 6.1-2.1 5.8-2-.2-2.7-2.1-1.6-3.1m6.5-10.8q4.9-3.5 8.1-1.3" stroke="#9f785c" stroke-width="1.6"/>
          <g fill="#efb59c" stroke="none" opacity=".87"><ellipse cx="74.9" cy="86.2" rx="7.7" ry="4.2" transform="rotate(14 74.9 86.2)"/><ellipse cx="129.9" cy="86.1" rx="8.5" ry="4.6" transform="rotate(-8 129.9 86.1)"/></g>
          <g stroke="#d09079" stroke-width="1"><path d="m71.7 85.5 1 2.5m2.5-3.5 1.1 2.7m50.9-2 .9 2.3m2.6-3.2.9 2.6m2.4-3.2.8 2.4"/></g>
          <g v-if="pose !== 'press'" fill="#54413a" stroke="none"><ellipse cx="80.4" cy="76.8" rx="3.8" ry="5"/><ellipse cx="121.2" cy="77.6" rx="4.2" ry="5.4"/><g fill="#fffdf1"><circle cx="79.6" cy="75.3" r="1.1"/><circle cx="120.1" cy="76.1" r="1.2"/></g></g>
          <path v-else d="M76.6 79.1q3.1-5.5 7.1-1m32.8-.4q4.7-5.8 8.7-.1" stroke-width="2.35"/>
          <g stroke-width="1.65"><path d="M77.2 66q2.1-2.2 5.4-1.5m35.3.2q3.4-.5 6 2"/><path d="M97.1 86.2c.9 2 1.9 3.2 3.3 3.2 1.3 0 3.4-1.6 4.1-3.1-1.5-1.7-5.6-1.9-7.4-.1z" fill="#935f50"/><path d="M100.5 89.3v2.1m0-.2c-1.1 3.7-4.6 4.6-6.3 1.7m6.3-1.7c1.9 3.7 5.5 4.3 7 1.3"/><path d="m105.2 109-1 3.1m5.1-2.4-1.2 3.5" stroke="#c1a58b" stroke-width="1.1"/></g>
        </g>
        <!-- Front legs are drawn independently for three recognisable gestures. -->
        <template v-if="pose === 'point'">
          <path d="M85 119c-6.7-3-13.9-7.6-21.5-10.5l-10.1-1.7c-2.4 2.9-3.7 6.5-1.7 10.3 9.8 4.8 16.3 12.1 25.3 13.4q6.8.4 9.6-5.7" :fill="`url(#${id}wool)`"/>
          <path d="M55.4 106.7c-4.8-3.3-11.7-2.5-14.9-1.1l2 4.2-2.9 1c1.7 4.3 6.1 6.6 12 6.6z" fill="#c99d79"/><path d="m41.7 109.6 5 1.5" stroke-width="1.35"/>
          <path d="M119.6 129.3q-2.5 9.6-7.5 16.1-3.2 3.9-8.5.8-3.6-2.2-2.2-6l3-8" :fill="`url(#${id}wool)`"/>
        </template>
        <template v-else-if="pose === 'press'">
          <path d="M88 121q-7.2 1-15.2 11.8l-11.5 13.8c1.4 4.5 6.4 7.5 10.6 6.3l20.1-19.4" :fill="`url(#${id}wool)`"/><path d="M62.9 144.6q-8.6.7-11.6 7.7l4.4.7-.9 3.8q7.9 2.3 17.6-3.9z" fill="#ceaa87"/>
          <path d="M114.7 130.3q-9.7 4.6-16.2 11.5l-7.7 7.2q1.5 8.3 10.2 7.6l16.5-12.3q5.1-3.6 6.3-8.9" :fill="`url(#${id}wool)`"/><path d="M93.4 147.8c-4.2-.2-11.8 3-13.6 9.3l4.3-.6-.7 3.4q9.5 1.8 17.6-3.2z" fill="#ceaa87"/>
        </template>
        <template v-else>
          <path d="M87.6 124.4c-1.4 7.1-2.4 13.6.1 20.4 3.6 3.5 7.9 2.8 10.2-.1l2.6-10.1" :fill="`url(#${id}wool)`"/><path d="M87.4 141.4q5.3 3.5 11 .3l-.5 5.3q-4.1 5.7-9.5 1.1z" fill="#ceaa87"/><path d="m93.2 146.6-.4 2.5" stroke-width="1.2"/>
          <path d="M114 131.2c-1.9 4.5-3.9 10.6-2.4 15.4 2.7 4.4 7.5 5.2 11 1.4l5-13.6" :fill="`url(#${id}wool)`"/><path d="M111.4 143.8q5.7 4.1 12 .8l-1.2 5.2q-5.3 5.5-10.2-.4z" fill="#cda482"/><path d="m117.4 148.3-.8 2.8" stroke-width="1.2"/>
        </template>
      </g>
      <g v-if="pose === 'sit'" stroke="#8d8068" stroke-width="1.4"><path d="M35.8 147q-1.7-7.7-8.5-10.2m8.8 11.3q1.7-8.6 6.5-12.1m-6.1 13q-5.9-3.9-11.5-3.3"/><path d="M29.9 138.5q-6.1-.5-8.1-6.9c5.5.3 8.4 2.9 8.1 6.9zM38 142.8q-.7-8.1 5.3-10.3 1.7 5.3-5.3 10.3z" fill="#a5ae8b"/><path d="m181 83 2.4-5.5 2.3 5.4 5.5 2.2-5.6 2.1-2.4 5.4-2.3-5.3-5.1-2.1z" fill="#ebc57f" stroke="#ba985b" stroke-width="1.2"/><path d="m32.9 72.4 1.1-3.8 1.4 3.6 3.5 1.2-3.5 1.4-1.2 3.5-1.3-3.3-3.5-1.5z" fill="#edc88d" stroke="#bc9a68" stroke-width="1.1"/></g>
      <g v-if="pose === 'point'" stroke="#c08660" stroke-width="2.1"><path d="m33 100-6-5m4.4 12-8-.5m9 7-5.2 3.7"/></g>
      <g v-if="pose === 'press'" stroke="#b18460" stroke-width="2"><path d="m47 146-6-2m8.6 7.8-7.9 1.6m36.2 8.6-1.5 3.6"/></g>
    </g>
  </svg>
</template>
