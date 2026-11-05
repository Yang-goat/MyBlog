import { pathToFileURL } from 'node:url';
const runtime = await import(pathToFileURL(process.env.CYBER_PLAYWRIGHT_PATH).href);
const chromium = runtime.chromium;
const originalLaunch = chromium.launch.bind(chromium);
chromium.launch = options => originalLaunch({ ...options, ...(process.env.CYBER_CHROMIUM_PATH ? { executablePath: process.env.CYBER_CHROMIUM_PATH } : {}) });
export { chromium };
