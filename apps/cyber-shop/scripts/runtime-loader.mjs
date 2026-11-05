import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
// Optional local browser-test runtime. No production bundle depends on this path.
const runtime = process.env.CYBER_PLAYWRIGHT_PATH;
if (runtime) registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === 'playwright') return nextResolve(new URL('./playwright-runtime.mjs', import.meta.url).href, context);
  return nextResolve(specifier, context);
} });
