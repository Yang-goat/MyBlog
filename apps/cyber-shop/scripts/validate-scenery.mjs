import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { inspectWebP } from './validate-art.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function validateScenery({distRoot}={}) {
 const errors=[],manifest=JSON.parse(fs.readFileSync(path.join(root,'scenery-manifest.json'),'utf8'));
 const seen=new Set(),sceneRoot=path.join(root,'src/scenes');
 const source=fs.readdirSync(sceneRoot).filter(file=>/\.(vue|ts)$/.test(file)).map(file=>fs.readFileSync(path.join(sceneRoot,file),'utf8')).join('\n');
 const expected=[...new Set([...source.matchAll(/\/cyber-shop\/(scenery\/[a-z0-9-]+\.webp)/g)].map(m=>m[1]))];
 for(const a of manifest.assets){
  try{
   if(!/^scenery\/[a-z0-9-]+\.webp$/.test(a.path)||seen.has(a.path)||!expected.includes(a.path))throw Error('duplicate, invalid or unused path');seen.add(a.path);
   if(a.tool!=='image_gen'||!a.prompt||!a.generation)throw Error('missing generation provenance');
   if(!fs.readdirSync(path.join(root,'public/scenery')).includes(path.basename(a.path)))throw Error('missing file or case mismatch');
   const b=fs.readFileSync(path.join(root,'public',a.path));
   const shape=inspectWebP(b);
   if(shape.width!==a.width||shape.height!==a.height||shape.alpha!==a.alpha||b.length!==a.bytes||createHash('sha256').update(b).digest('hex')!==a.sha256)throw Error('file differs from registered image');
   if(!/^docs\/art-revisions\/living-shop\/[a-z0-9-]+\.png$/.test(a.source)||createHash('sha256').update(fs.readFileSync(path.join(root,a.source))).digest('hex')!==a.sourceSha256)throw Error('generated source archive missing or differs');
   if(distRoot){const target=path.join(distRoot,'cyber-shop',a.path);if(!fs.existsSync(target)||!fs.readFileSync(target).equals(b))throw Error('published image missing or differs');}
  }catch(e){errors.push(`${a.id}: ${e.message}`);}
 }
 for(const file of expected)if(!seen.has(file))errors.push(`Unregistered scene layer: ${file}`);
 for(const file of fs.readdirSync(path.join(root,'public/scenery')))if(!seen.has('scenery/'+file))errors.push(`Unregistered scenery file: ${file}`);
 for(const a of manifest.archivedAssets||[]){
  try{
   if(!/^docs\/art-revisions\/living-shop\/[a-z0-9-]+\.webp$/.test(a.path)||!a.retired||!a.reason)throw Error('invalid archive metadata');
   const b=fs.readFileSync(path.join(root,a.path));
   if(b.length!==a.bytes||createHash('sha256').update(b).digest('hex')!==a.sha256)throw Error('archived image differs');
   if(!/^docs\/art-revisions\/living-shop\/[a-z0-9-]+\.png$/.test(a.source)||createHash('sha256').update(fs.readFileSync(path.join(root,a.source))).digest('hex')!==a.sourceSha256)throw Error('archived original differs');
   const oldPath=path.join('scenery',path.basename(a.path));
   if(fs.existsSync(path.join(root,'public',oldPath))||(distRoot&&fs.existsSync(path.join(distRoot,'cyber-shop',oldPath))))throw Error('retired image still published');
  }catch(e){errors.push(`${a.id} (archive): ${e.message}`);}
 }
 return {layers:seen.size,errors};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const report=validateScenery();console.log(JSON.stringify(report,null,2));if(report.errors.length)process.exitCode=1;}
