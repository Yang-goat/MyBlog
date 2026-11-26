import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { publishEdition } from './scripts/edition.ts';

const id = 'virtual:sticker-edition';
export default defineConfig({
  base: '/color-sudoku/',
  plugins: [vue(), {
    name: 'certified-sticker-pages',
    resolveId(name) { return name === id ? '\0' + id : null; },
    load(name) {
      if (name !== '\0' + id) return null;
      const edition = publishEdition();
      this.info(`Certified and replayed ${edition.length} pages and ${edition.length} reserves (${edition.filter(p => p.source === 'fallback').length} reserves selected).`);
      // The client gets a frozen-in-time edition: no solver, source archive, database, or roll on refresh.
      return `export default ${JSON.stringify(edition.map(p => p.puzzle))}`;
    },
  }],
  build: { outDir: '../../src/.vuepress/dist/color-sudoku', emptyOutDir: false },
});
