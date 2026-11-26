<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<template>
  <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'crayon'"><path d="m4 18 1.3-5L15.6 2.8a1.8 1.8 0 0 1 2.5 0l3 3a1.8 1.8 0 0 1 0 2.5L10.8 18.6 6 20.1 3.5 21z"/><path d="m13.4 5 5.5 5.5M5.9 13.1l5 5M7.9 15.4l7.6-7.6M4.8 17.5l1.5 1.6"/></template>
    <template v-else-if="name === 'cross'"><path d="m5.2 4.7 14.2 14.5M18.7 4.4 4.6 18.8" stroke-width="2.5"/></template>
    <template v-else-if="name === 'album'"><path d="M4.5 4.5h13a2 2 0 0 1 2 2v13h-14a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2zM7 4.5v15M2.1 8h3.2m-3.2 5h3.2"/><path d="m13.4 8.1 1.1 2.1 2.3.3-1.6 1.7.4 2.3-2.2-1.1-2.1 1.1.4-2.3-1.7-1.7 2.4-.3z" stroke-width="1.3"/></template>
    <template v-else-if="name === 'desk'"><rect x="3.5" y="3.5" width="16.9" height="16.9" rx="3"/><path d="M9.2 3.7v16.5M14.9 9.2v11M4 9.2h16M4 14.8h16"/><path d="M10 4.3h9.5V9H10z" stroke="none" fill="currentColor" opacity=".24"/></template>
    <template v-else-if="name === 'book'"><path d="M2.8 5.8c3.1-1.7 5.9-1.6 9.2.2 3.1-1.8 5.9-1.9 9.2-.2v13c-3.2-1.2-6.2-1.2-9.2.6-3-1.8-6-1.8-9.2-.6zM12 6.2v13"/></template>
    <template v-else-if="name === 'arrow'"><path d="M4.5 12.2h14m-5.4-5.7 5.7 5.7-5.7 5.5"/></template>
    <template v-else-if="name === 'external'"><path d="M5.5 18.5 18.2 5.8M8.5 5.5h10v10"/></template>
    <template v-else-if="name === 'down'"><path d="m6 9 6 6 6-6"/></template>
    <template v-else-if="name === 'heart'"><path d="M12 20s-8.4-5.3-8.4-11C3.6 3.6 9.5 3 12 7c2.6-4 8.5-3.4 8.5 2 0 5.4-8.5 11-8.5 11z"/></template>
    <template v-else-if="name === 'coin'"><circle cx="12" cy="12" r="9"/><path d="m12 6.6 1.5 3.2 3.6.4-2.7 2.4.7 3.6-3.1-1.7-3.1 1.7.6-3.6L7 10.2l3.6-.4z" stroke-width="1.35"/></template>
    <template v-else-if="name === 'spark'"><path d="M13 3c.2 5.3 2.4 7.5 7.7 8-5.4.7-7.5 2.7-8.2 8.4-.6-5.6-2.6-7.8-7.8-8.4 5.4-.6 7.5-2.5 8.3-8zM4 1.8v3.8M2 3.7h4"/></template>
    <template v-else-if="name === 'paw'"><path d="M5.8 16.2c.2-2.2 2.9-3 4-5.1 1.3-1.8 3.1-1.8 4.5.2 1.2 1.9 3.6 2.8 3.9 5.1.4 2.5-1.5 3.8-3.6 3.2-1.8-.6-3.6-1-5.4-.1-1.9.7-3.8-.6-3.4-3.3z" fill="currentColor" stroke="none"/><g fill="currentColor" stroke="none"><ellipse cx="4.8" cy="10.2" rx="2.1" ry="2.8" transform="rotate(-22 4.8 10.2)"/><ellipse cx="9.4" cy="6.8" rx="2" ry="2.9"/><ellipse cx="15.1" cy="6.7" rx="2" ry="2.9"/><ellipse cx="19.4" cy="10.5" rx="2" ry="2.7" transform="rotate(20 19.4 10.5)"/></g></template>
    <template v-else-if="name === 'sound' || name === 'mute'"><path d="M3.5 9.1h4.2l5.1-4.2v14.2l-5.1-4.2H3.5z"/><path v-if="name === 'sound'" d="M16 8.3c2 1.9 2 5.4 0 7.4m2.7-10.1c3.6 3.7 3.6 9.2 0 12.9"/><path v-else d="m16 9.1 5.4 5.5m-.1-5.5-5.4 5.5"/></template>
    <template v-else-if="name === 'motion'"><path d="M3 6h7m-8.2 5h5.5M4 16h3m6.8-12 6.4 5a1.7 1.7 0 0 1 .2 2.5l-6.9 7.2a2.1 2.1 0 0 1-3.5-1.7l1.1-11.6a1.7 1.7 0 0 1 2.7-1.4z"/></template>
    <template v-else-if="name === 'zoom' || name === 'unzoom'"><circle cx="10" cy="10" r="6.2"/><path d="m14.8 14.8 5.5 5.5M7.3 10h5.4"/><path v-if="name === 'zoom'" d="M10 7.4v5.2"/></template>
    <template v-else-if="name === 'locate'"><circle cx="12" cy="12" r="6.8"/><circle cx="12" cy="12" r="1.4"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></template>
    <template v-else-if="name === 'lock'"><rect x="5.7" y="10" width="12.6" height="10.5" rx="2.2"/><path d="M8.5 10V7.4a3.5 3.5 0 0 1 7 0V10M12 14.1v2.1"/></template>
    <template v-else-if="name === 'retry'"><path d="M4.3 9.1a8.2 8.2 0 1 1-.3 5.1M4.3 4.3v4.9h5"/></template>
    <template v-else-if="name === 'help'"><path d="M9 8.8a3.2 3.2 0 1 1 5.1 2.7c-1.3.9-2.1 1.4-2.1 3"/><circle cx="12" cy="12" r="9"/><circle cx="12" cy="17.2" r=".8" stroke="none" fill="currentColor"/></template>
    <template v-else-if="name === 'check'"><path d="m4.5 12.2 4.9 4.9 10.1-10" stroke-width="2.2"/></template>
    <template v-else-if="name === 'close'"><path d="m6 6 12 12M18 6 6 18"/></template>
    <template v-else-if="name === 'tag'"><path d="M4 5h9l7 7-7.5 7.5-8.5-8.1z"/><circle cx="8.9" cy="9" r="1.3"/></template>
    <template v-else-if="name === 'leaf'"><path d="M4 18C3 7 11 4 20.1 4.8c0 10.6-5.5 15.9-13.6 12.1M3.3 21 15.5 9"/></template>
    <template v-else-if="name === 'warn'"><path d="m10.2 4.6-8 13.9a1.6 1.6 0 0 0 1.5 2.3h16.6a1.6 1.6 0 0 0 1.4-2.3L13.6 4.6a1.9 1.9 0 0 0-3.4 0zM12 9v5m0 2.7v.1"/></template>
  </svg>
</template>
