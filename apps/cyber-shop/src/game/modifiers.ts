import type {GameState} from './types';
export const START_MODIFIERS=[
 {id:'extra-cash',name:'备用金',positive:true,group:'capital',description:'初始现金 +₡600',cash:600,cells:0,rent:0},
 {id:'roomy-stock',name:'宽敞库房',positive:true,group:'warehouse',description:'基础仓库 +48 格',cash:0,cells:48,rent:0},
 {id:'tight-cash',name:'本金吃紧',positive:false,group:'capital',description:'初始现金 −₡600',cash:-600,cells:0,rent:0},
 {id:'cramped-stock',name:'狭小仓库',positive:false,group:'warehouse',description:'基础仓库 −72 格',cash:0,cells:-72,rent:0},
 {id:'high-rent',name:'高额房租',positive:false,group:'rent',description:'拥有经营权前，每日租金 +₡50',cash:0,cells:0,rent:50},
] as const;
export const modifierEffect=(s:Pick<GameState,'modifiers'>,effect:'cash'|'cells'|'rent')=>START_MODIFIERS.filter(m=>s.modifiers?.includes(m.id)).reduce((n,m)=>n+m[effect],0);
export function validModifiers(ids:unknown):ids is string[]{return Array.isArray(ids)&&ids.every(id=>typeof id==='string'&&START_MODIFIERS.some(m=>m.id===id))&&new Set(ids).size===ids.length&&new Set(ids.map(id=>START_MODIFIERS.find(m=>m.id===id)!.group)).size===ids.length;}
