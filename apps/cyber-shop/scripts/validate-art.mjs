import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = path.join(appRoot, 'src/content');
const sceneIds = ['scene-city', 'scene-shop', 'scene-workbench', 'scene-ending'];
const EXPECTED_COUNT = 66;
// User-authorized exceptions after recorded image-generation failures; all other assets stay AI-generated.
const originalDrawingIds = new Set(['electronic-parts', 'insulation']);

export function artProvenanceErrors(asset) {
  const errors = [];
  if (typeof asset.prompt !== 'string' || asset.prompt.trim().length <= 20) errors.push(`Missing art prompt/design brief: ${asset.id}`);
  if (asset.status === 'original-drawn') {
    if (!originalDrawingIds.has(asset.id)) errors.push(`Original drawing is not authorized for asset: ${asset.id}`);
    if (asset.tool !== 'original-drawing') errors.push(`Missing original-drawing tool provenance: ${asset.id}`);
    if (typeof asset.sourceDescription !== 'string' || !asset.sourceDescription.includes('原创绘制')) errors.push(`Missing explicit original-drawing source description: ${asset.id}`);
    if (!Array.isArray(asset.attempts) || !asset.attempts.some(attempt => attempt.status === 'failed' && typeof attempt.error === 'string' && attempt.error.length > 0)) errors.push(`Missing retained generation failure history: ${asset.id}`);
  } else {
    if (asset.status !== 'generated') errors.push(`Asset is not complete: ${asset.id} (${asset.status ?? 'missing status'})`);
    if (asset.tool !== 'image_gen') errors.push(`Missing generation tool provenance: ${asset.id}`);
  }
  return errors;
}

// Read the real TypeScript registry without writing generated files or using a second ID list.
function contentModuleUrl(file, cache = new Map(), visiting = new Set()) {
  const resolved = path.resolve(file);
  if (!resolved.startsWith(contentRoot + path.sep)) throw new Error('Content import escaped src/content');
  if (cache.has(resolved)) return cache.get(resolved);
  if (visiting.has(resolved)) throw new Error('Circular content imports are unsupported by the art validator');
  visiting.add(resolved);
  const result = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), {
    fileName: resolved,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  const diagnostics = result.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error) ?? [];
  if (diagnostics.length) throw new Error(ts.flattenDiagnosticMessageText(diagnostics[0].messageText, '\n'));
  const code = result.outputText.replace(/(\bfrom\s*['"])(\.[^'"]+)(['"])/g, (_match, before, specifier, after) => {
    const base = path.resolve(path.dirname(resolved), specifier.replace(/\.js$/, ''));
    const dependency = fs.existsSync(base + '.ts') ? base + '.ts' : path.join(base, 'index.ts');
    return before + contentModuleUrl(dependency, cache, visiting) + after;
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
  visiting.delete(resolved); cache.set(resolved, url); return url;
}

function exactFile(root, relative) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.startsWith('/') || relative.split('/').some(part => !part || part === '.' || part === '..')) return false;
  let current = root;
  for (const part of relative.split('/')) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory() || !fs.readdirSync(current).includes(part)) return false;
    current = path.join(current, part);
  }
  return fs.statSync(current).isFile();
}

/** Validate static WebP RIFF structure, image headers, dimensions and alpha flags.
 * Full pixel decoding and visual quality are additionally checked in browser/art review.
 * Container specification: https://developers.google.com/speed/webp/docs/riff_container
 */
export function inspectWebP(buffer) {
  const require = (condition, message) => { if (!condition) throw new Error(message); };
  require(buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP', 'not a WebP RIFF file');
  require(buffer.readUInt32LE(4) + 8 === buffer.length, 'RIFF length mismatch or trailing bytes');
  let width = 0; let height = 0; let alpha = false; let extendedWidth = 0; let extendedHeight = 0; let images = 0;
  const chunks = [];
  for (let offset = 12; offset < buffer.length;) {
    require(offset + 8 <= buffer.length, 'truncated chunk header');
    const kind = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4); const start = offset + 8; const end = start + size;
    require(end <= buffer.length, `truncated ${kind} payload`);
    if (size % 2) require(end < buffer.length && buffer[end] === 0, `invalid ${kind} padding`);
    chunks.push(kind);
    if (kind === 'VP8X') {
      require(size === 10 && chunks.length === 1, 'invalid extended header');
      require((buffer[start] & 2) === 0, 'animated WebP is not a static base asset');
      extendedWidth = buffer.readUIntLE(start + 4, 3) + 1; extendedHeight = buffer.readUIntLE(start + 7, 3) + 1;
      alpha = !!(buffer[start] & 16);
    } else if (kind === 'VP8 ') {
      require(size > 10 && (buffer[start] & 1) === 0 && buffer.subarray(start + 3, start + 6).equals(Buffer.from([0x9d, 0x01, 0x2a])), 'invalid VP8 key frame');
      width = buffer.readUInt16LE(start + 6) & 0x3fff; height = buffer.readUInt16LE(start + 8) & 0x3fff; images++;
    } else if (kind === 'VP8L') {
      require(size > 5 && buffer[start] === 0x2f, 'invalid lossless frame');
      const bits = buffer.readUInt32LE(start + 1);
      require((bits >>> 29) === 0, 'unsupported VP8L version');
      width = (bits & 0x3fff) + 1; height = ((bits >>> 14) & 0x3fff) + 1; alpha ||= !!(bits & 0x10000000); images++;
    } else if (kind === 'ALPH') {
      require(size > 1 && images === 0, 'invalid alpha payload or order'); alpha = true;
    } else require(kind !== 'ANIM' && kind !== 'ANMF', 'animated image supplied for a static asset');
    offset = end + (size % 2);
  }
  require(images === 1 && width > 0 && height > 0, 'missing or duplicate image bitstream');
  require(!extendedWidth || (extendedWidth === width && extendedHeight === height), 'canvas and image dimensions disagree');
  return { width, height, alpha, bytes: buffer.length };
}

export async function validateArt({ distRoot } = {}) {
  const errors = []; const check = (condition, message) => { if (!condition) errors.push(message); };
  const report = { expected: EXPECTED_COUNT, registered: 0, generated: 0, originalDrawn: 0, validatedFiles: 0, validatedDistFiles: 0, totalBytes: 0, opaqueCutouts: [], missing: [], errors };
  let content; let manifest;
  try {
    content = await import(contentModuleUrl(path.join(contentRoot, 'index.ts')));
    manifest = JSON.parse(fs.readFileSync(path.join(appRoot, 'assets-manifest.json'), 'utf8'));
  } catch (error) { errors.push(`Cannot read content/art registry: ${error.message}`); return report; }

  const expected = new Map();
  for (const [list, kind, count] of [[content.ITEMS, 'item', 36], [content.CHARACTERS, 'character', 10], [content.EQUIPMENT, 'equipment', 16]]) {
    check(Array.isArray(list) && list.length === count, `Expected ${count} ${kind} definitions`);
    for (const entry of list ?? []) {
      check(!expected.has(entry.id), `Duplicate content art ID: ${entry.id}`);
      check(entry.image === `${entry.id}.webp`, `Content image does not match its asset ID: ${entry.id}`);
      expected.set(entry.id, kind);
    }
  }
  const sceneConsumers = [path.join(appRoot, 'src/ui'), path.join(appRoot, 'src/scenes')].flatMap(dir => fs.readdirSync(dir).filter(name => /\.(?:vue|ts)$/.test(name)).map(name => fs.readFileSync(path.join(dir, name), 'utf8'))).join('\n');
  for (const id of sceneIds) { expected.set(id, 'scene'); check(sceneConsumers.includes(`'${id}'`) || sceneConsumers.includes(`"${id}"`), `Scene has no UI/Phaser reference: ${id}`); }
  check(expected.size === EXPECTED_COUNT, `Content references ${expected.size} art IDs; expected ${EXPECTED_COUNT}`);
  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
  report.registered = assets.length;
  check(manifest.version === 1 && Array.isArray(manifest.assets), 'Unsupported or invalid art manifest');
  check(assets.length === EXPECTED_COUNT, `Manifest has ${assets.length}/${EXPECTED_COUNT} assets`);
  const ids = new Set(); const paths = new Set(); const drawingSources = new Set(); const hashes = new Map();
  for (const asset of assets) {
    const id = asset.id;
    check(typeof id === 'string' && /^[a-z][a-z0-9-]+$/.test(id), `Invalid asset ID: ${id}`);
    check(!ids.has(id), `Duplicate manifest asset ID: ${id}`); ids.add(id);
    check(expected.has(id), `Unreferenced asset ID: ${id}`);
    check(expected.get(id) === asset.kind, `Wrong asset kind: ${id}`);
    errors.push(...artProvenanceErrors(asset));
    if (asset.status === 'generated') report.generated++;
    if (asset.status === 'original-drawn') {
      report.originalDrawn++;
      check(exactFile(appRoot, asset.source), `Missing project-local original drawing source or case mismatch: ${id}`);
      const sourceKey = String(asset.source).toLowerCase();
      check(!drawingSources.has(sourceKey), `Original drawings must have independent source files: ${id}`); drawingSources.add(sourceKey);
    }
    const canonical = `public/art/${id}.webp`;
    check(asset.path === canonical, `Asset path must exactly match ${canonical}`);
    const key = String(asset.path).toLowerCase(); check(!paths.has(key), `Duplicate or case-colliding asset path: ${asset.path}`); paths.add(key);
    if (!exactFile(appRoot, canonical)) { errors.push(`Missing source art or case mismatch: ${canonical}`); continue; }
    const bytes = fs.readFileSync(path.join(appRoot, canonical));
    try {
      const info = inspectWebP(bytes);
      check(info.width >= 64 && info.height >= 64, `Asset is too small to be a base illustration: ${id}`);
      const limits = asset.kind === 'scene' ? [1920, 1080] : asset.kind === 'character' ? [768, 1024] : [512, 512];
      check(info.width <= limits[0] && info.height <= limits[1], `Asset exceeds published size: ${id} ${info.width}x${info.height}`);
      if (asset.transparentRequested && !info.alpha) report.opaqueCutouts.push(id);
      report.validatedFiles++; report.totalBytes += bytes.length;
      const hash = createHash('sha256').update(bytes).digest('hex');
      check(!hashes.has(hash), `Identical base artwork reused: ${id} and ${hashes.get(hash)}`); hashes.set(hash, id);
      if (asset.width !== undefined) check(asset.width === info.width, `Manifest width differs from WebP: ${id}`);
      if (asset.height !== undefined) check(asset.height === info.height, `Manifest height differs from WebP: ${id}`);
      if (asset.bytes !== undefined) check(asset.bytes === info.bytes, `Manifest byte count differs from WebP: ${id}`);
      if (asset.sha256 !== undefined) check(asset.sha256 === hash, `Manifest SHA-256 differs from WebP: ${id}`);
      if (distRoot) {
        const relative = `cyber-shop/art/${id}.webp`;
        if (!exactFile(distRoot, relative)) errors.push(`Missing built art or case mismatch: ${relative}`);
        else { check(fs.readFileSync(path.join(distRoot, relative)).equals(bytes), `Built art differs from source: ${id}`); report.validatedDistFiles++; }
      }
    } catch (error) { errors.push(`Invalid WebP ${id}: ${error.message}`); }
  }
  report.missing = [...expected.keys()].filter(id => !ids.has(id));
  for (const id of report.missing) errors.push(`Expected asset missing from manifest: ${id}`);
  const artDir = path.join(appRoot, 'public/art');
  const files = fs.existsSync(artDir) ? fs.readdirSync(artDir).filter(name => /\.webp$/i.test(name)) : [];
  check(files.length === EXPECTED_COUNT, `Source art directory has ${files.length}/${EXPECTED_COUNT} WebP files`);
  for (const file of files) check(expected.has(file.slice(0, -5)) && file.endsWith('.webp'), `Unregistered or wrong-case WebP file: ${file}`);
  if (distRoot) {
    const builtDir = path.join(distRoot, 'cyber-shop/art');
    const built = fs.existsSync(builtDir) ? fs.readdirSync(builtDir).filter(name => /\.webp$/i.test(name)) : [];
    check(built.length === EXPECTED_COUNT, `Built art directory has ${built.length}/${EXPECTED_COUNT} WebP files`);
    for (const file of built) check(expected.has(file.slice(0, -5)) && file.endsWith('.webp'), `Unregistered or wrong-case built WebP: ${file}`);
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await validateArt();
  console.log(JSON.stringify(report, null, 2));
  if (report.errors.length) process.exitCode = 1;
}
