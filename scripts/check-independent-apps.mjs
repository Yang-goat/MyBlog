import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateArt } from "../apps/cyber-shop/scripts/validate-art.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "src/.vuepress/dist");
const errors = [];
const checked = new Set();
const apps = [
  { id: "hex-mahjong", title: "海克斯麻将主持台", namespace: "hex-mahjong" },
  { id: "cyber-shop", title: "赛博杂货铺", namespace: "cyber-shop:save:v1" },
];
const check = (condition, message) => { if (!condition) errors.push(message); };

// Walk exact directory entries even on Windows, where existsSync alone ignores case.
function exactFile(relative) {
  const normalized = relative.replaceAll("\\", "/");
  if (normalized.startsWith("/") || normalized.split("/").some(part => part === "..")) return false;
  let cursor = dist;
  for (const part of normalized.split("/").filter(Boolean)) {
    if (!fs.existsSync(cursor) || !fs.statSync(cursor).isDirectory()) return false;
    if (!fs.readdirSync(cursor).includes(part)) return false;
    cursor = path.join(cursor, part);
  }
  return fs.existsSync(cursor) && fs.statSync(cursor).isFile();
}

function checkResource(url, from, appId) {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) return;
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!clean) return;
  const relative = clean.startsWith("/") ? clean.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(from), clean));
  check(relative.startsWith(`${appId}/`), `Application asset escaped its base: ${from} -> ${url}`);
  const exists = exactFile(relative);
  check(exists, `Missing asset or case mismatch: ${from} -> ${url}`);
  if (!exists || checked.has(relative)) return;
  checked.add(relative);
  if (relative.endsWith(".css")) {
    const css = fs.readFileSync(path.join(dist, relative), "utf8");
    for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) checkResource(match[1], relative, appId);
  }
}

check(exactFile("index.html"), "Missing blog index.html; build the complete site, not an application alone.");
for (const app of apps) {
  const entry = `${app.id}/index.html`;
  if (!exactFile(entry)) { errors.push(`Missing application entry: ${entry}`); continue; }
  const html = fs.readFileSync(path.join(dist, entry), "utf8");
  check(html.includes(app.title), `Wrong application title: ${entry}`);
  check(!html.includes("/src/main.ts"), `Unbuilt source entry remains: ${entry}`);
  const resources = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]);
  const scripts = resources.filter(url => /\.js(?:[?#]|$)/.test(url));
  check(scripts.length > 0, `No built JavaScript found: ${entry}`);
  for (const url of resources) checkResource(url, entry, app.id);
  const assetDir = path.join(dist, app.id, "assets");
  const bundles = fs.existsSync(assetDir) ? fs.readdirSync(assetDir).filter(file => file.endsWith(".js")).map(file => fs.readFileSync(path.join(assetDir, file), "utf8")).join("\n") : "";
  check(bundles.includes(app.namespace), `Save namespace missing from emitted ${app.id} JavaScript`);
  check(exactFile(`notes/${app.id}/index.html`), `Missing blog introduction: notes/${app.id}/`);
}

const art = await validateArt({ distRoot: dist });
errors.push(...art.errors);

console.log(JSON.stringify({ applications: apps.map(app => app.id), checkedResources: checked.size, art: { expected: art.expected, generated: art.generated, originalDrawn: art.originalDrawn, validatedFiles: art.validatedFiles, validatedDistFiles: art.validatedDistFiles, opaqueCutouts: art.opaqueCutouts }, errors }, null, 2));
assert.equal(errors.length, 0, "Independent application artifact checks failed");
