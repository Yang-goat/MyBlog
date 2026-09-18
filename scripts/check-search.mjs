import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { markRaw, readonly, ref } from "vue";

const root = fileURLToPath(new URL("../", import.meta.url));
const client = readFileSync(path.join(root, "src/.vuepress/client.ts"), "utf8");
const expression = client.match(/defineSearchConfig\([\s\S]*?\n\}\)\);/);
assert.ok(expression, "Cannot locate the site's search configuration");
let config;
vm.runInNewContext(expression[0], { markRaw, defineSearchConfig: (value) => { config = value; } });
// Reproduce the plugin's ref -> readonly -> locale-options spread before postMessage.
const { locales = {}, ...options } = readonly(ref(config)).value;
assert.doesNotThrow(() => structuredClone(options));
const dist = path.join(root, "src/.vuepress/dist");
const workers = readdirSync(dist).filter((name) => /^slimsearch\.worker\..+\.js$/.test(name));
assert.equal(workers.length, 1, "Run a clean docs:build before testing");
const worker = new Worker(`
  const { parentPort, workerData } = require('node:worker_threads');
  globalThis.self = {
    addEventListener: (_, listener) => parentPort.on('message', data => listener({ data })),
    postMessage: data => parentPort.postMessage(data),
  };
  require('node:vm').runInThisContext(require('node:fs').readFileSync(workerData, 'utf8'));
`, { eval: true, workerData: path.join(dist, workers[0]) });
let requestId = 0;
const query = (text, type = "search") => new Promise((resolve, reject) => {
  const id = ++requestId;
  const timer = setTimeout(() => { cleanup(); reject(new Error(`Search timed out: ${text}`)); }, 10000);
  const cleanup = () => { clearTimeout(timer); worker.off("message", onMessage); worker.off("error", onError); };
  const onMessage = ([responseType, responseId, result]) => {
    if (responseType === type && responseId === id) { cleanup(); resolve(result); }
  };
  const onError = (error) => { cleanup(); reject(error); };
  worker.on("message", onMessage);
  worker.on("error", onError);
  try { worker.postMessage({ type, id, query: text, locale: "/", options }); }
  catch (error) { cleanup(); reject(error); }
});
const zotero = "Zotero：论文管理与参考文献引用工具";
const wavelet = "小波分析基础：从傅里叶变换到 CWT 与 DWT";
try {
  for (const [text, title, contentType] of [
    ["Zotero", zotero],
    ["Zot", zotero],
    ["Zoteroa", zotero],
    ["元数据", zotero, "text"],
    ["小波", wavelet],
    ["小波分析", wavelet],
    ["小波分析 CWT", wavelet],
  ]) {
    const results = await query(text);
    const match = results.find((result) => result.title === title);
    assert.ok(match, `Missing ${title} for ${text}`);
    if (contentType) assert.ok(match.contents.some((item) => item.type === contentType));
    console.log(`PASS ${text}: ${results.length} matching pages`);
  }
  assert.ok((await query("Zot", "suggest")).length > 0);
  assert.equal((await query("zzzz_no_such_article_987654321")).length, 0);
  console.log("PASS suggestions, empty results, and Worker structured cloning");
} finally {
  await worker.terminate();
}
