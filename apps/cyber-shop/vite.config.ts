/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/cyber-shop/',
  plugins: [vue()],
  build: {
    outDir: '../../src/.vuepress/dist/cyber-shop',
    emptyOutDir: false,
    rollupOptions: { output: { manualChunks: (id: string) => id.includes('/phaser/') ? 'phaser' : undefined } },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
