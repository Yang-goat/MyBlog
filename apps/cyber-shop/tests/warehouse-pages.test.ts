import {describe,it,expect} from 'vitest';
import {createReadyGame,act} from './helpers';
import {applyAction,rootCapacity} from '../src/game/engine';
import {rootLayout,firstObjectPlace,containerLayout} from '../src/game/containers';
import {footprint,WAREHOUSE_PAGE_ROWS} from '../src/game/warehouse';
import {exportSave,importSave} from '../src/persistence/storage';
function shop(){const s=createReadyGame(7);s.equipment['stock-rack']=3;return s;}
describe('warehouse expansion pages',()=>{
 it('keeps the original 144 cells and adds capacity without allowing an object to cross pages',()=>{
  let s=shop();const item=s.items.find(i=>i.definitionId==='purified-water')??s.items.find(i=>footprint(i).height>1)!;
  const before=structuredClone(s),bad=applyAction(s,{type:'moveStock',itemId:item.id,x:20,y:5,rotated:false});expect(bad.ok).toBe(false);expect(bad.state).toEqual(before);
  s=act(s,{type:'moveStock',itemId:item.id,x:20,y:6,rotated:false});expect(rootLayout(s,rootCapacity(s)).positions[item.id]).toEqual({x:20,y:6,rotated:false});expect(rootCapacity(s)*4).toBe(240);expect(importSave(exportSave(s))).toEqual(s);
 });
 it('fills later pages with whole objects and never places into the last partial row beyond capacity',()=>{
  const s=shop(),base=s.items.find(i=>i.definitionId==='data-chip')!;s.items=[];
  for(let n=0;n<240;n++)s.items.push({...base,id:`item-${1000+n}`,grid:{x:n%24,y:Math.floor(n/24),rotated:false}});
  const layout=rootLayout(s,rootCapacity(s));expect(Object.keys(layout.positions)).toHaveLength(240);expect(layout.overflow).toEqual([]);
  expect(firstObjectPlace(s,rootCapacity(s),{...base,id:'extra'})).toBeUndefined();
  s.items=s.items.filter(i=>i.grid!.y!==6);const bottle={...base,id:'large',definitionId:'purified-water'};const place=firstObjectPlace(s,rootCapacity(s),bottle);
  if(place){const f=footprint(bottle,place.rotated);expect(Math.floor(place.y/6)).toBe(Math.floor((place.y+f.height-1)/6));}
  s.equipment['stock-rack']=1;const partial=rootLayout(s,rootCapacity(s));for(const [id,p] of Object.entries(partial.positions)){const o=s.items.find(i=>i.id===id)!;expect(p.y*24+p.x).toBeLessThan(176);expect(footprint(o).height).toBe(1);}
 });
 it('repositions an old boundary-crossing object without dropping it or disturbing valid saved positions',()=>{
  const s=shop(),bottle=s.items.find(i=>i.definitionId==='purified-water')!,chip=s.items.find(i=>i.definitionId==='data-chip')!;bottle.grid={x:20,y:5,rotated:false};chip.grid={x:23,y:8,rotated:false};
  const original=structuredClone(s),layout=rootLayout(s,rootCapacity(s)),p=layout.positions[bottle.id]!;expect(layout.overflow).toEqual([]);expect(layout.positions[chip.id]).toEqual(chip.grid);expect(p).not.toEqual(bottle.grid);expect(Math.floor(p.y/6)).toBe(Math.floor((p.y+footprint(bottle,p.rotated).height-1)/6));expect(s).toEqual(original);expect(importSave(exportSave(s)).items).toEqual(s.items);
 });
 it('keeps an 8-row container continuous while root storage has six-row page boundaries',()=>{
  const s=shop(),bottle=s.items.find(i=>i.definitionId==='purified-water')!;s.containers=[{id:'container-999',styleId:'freight-case',owner:'player',location:'stock',cost:900,acquiredDay:1,label:'大箱',color:'ivory',grid:{x:16,y:6,rotated:false}}];bottle.containerId='container-999';bottle.grid={x:0,y:5,rotated:false};
  expect(WAREHOUSE_PAGE_ROWS).toBe(6);expect(containerLayout(s,s.containers[0]!).positions[bottle.id]).toEqual(bottle.grid);expect(rootLayout(s,rootCapacity(s)).positions['container-999']?.y).toBe(6);
 });
});
