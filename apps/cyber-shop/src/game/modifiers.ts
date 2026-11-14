import type {GameState} from './types';
import {BALANCE} from './balance';
type Effect='cash'|'cells'|'rent'|'hours'|'freshDays';
interface StartModifier extends Partial<Record<Effect,number>> {id:string;name:string;positive:boolean;group:string;description:string}
export const START_MODIFIERS:readonly StartModifier[]=[
 {id:'extra-cash',name:'备用金',positive:true,group:'capital',description:'初始现金 +₡600',cash:600,cells:0,rent:0},
 {id:'tight-cash',name:'本金吃紧',positive:false,group:'capital',description:'初始现金 −₡600',cash:-600,cells:0,rent:0},
 {id:'roomy-stock',name:'宽敞库房',positive:true,group:'warehouse',description:'基础仓库 +48 格',cash:0,cells:48,rent:0},
 {id:'cramped-stock',name:'狭小仓库',positive:false,group:'warehouse',description:'基础仓库 −72 格',cash:0,cells:-72,rent:0},
 {id:'long-shift',name:'长班营业',positive:true,group:'hours',description:'每日可用工时 14（+2）',hours:2},
 {id:'short-shift',name:'短班营业',positive:false,group:'hours',description:'每日可用工时 10（−2）',hours:-2},
 {id:'small-wholesale',name:'批发熟客',positive:true,group:'wholesale',description:'同次进货 2 件起九折'},
 {id:'no-wholesale',name:'零售货源',positive:false,group:'wholesale',description:'进货取消批发折扣，仍可议价'},
 {id:'fresh-supply',name:'鲜货直送',positive:true,group:'freshness',description:'食品起始保质期 +2 日',freshDays:2},
 {id:'short-dated',name:'临期货源',positive:false,group:'freshness',description:'食品起始保质期为 1 日，可保鲜'},
 {id:'high-rent',name:'高额房租',positive:false,group:'rent',description:'拥有经营权前，每日租金 +₡50',rent:50},
];
type Run=Pick<GameState,'modifiers'>;
export const modifierEffect=(s:Run,effect:Effect)=>START_MODIFIERS.filter(m=>s.modifiers?.includes(m.id)).reduce((n,m)=>n+(m[effect]??0),0);
export const dailyHours=(s:Run)=>BALANCE.hours+modifierEffect(s,'hours');
export const wholesaleMinimum=(s:Run)=>s.modifiers?.includes('no-wholesale')?null:s.modifiers?.includes('small-wholesale')?2:3;
export const wholesaleFactor=(s:Run,count:number)=>{const min=wholesaleMinimum(s);return min!==null && count>=min ? .9 : 1;};
export const foodShelfLife=(s:Run,base:number)=>s.modifiers?.includes('short-dated')?1:base+modifierEffect(s,'freshDays');
export function validModifiers(ids:unknown):ids is string[]{return Array.isArray(ids)&&ids.every(id=>typeof id==='string'&&START_MODIFIERS.some(m=>m.id===id))&&new Set(ids).size===ids.length&&new Set(ids.map(id=>START_MODIFIERS.find(m=>m.id===id)!.group)).size===ids.length;}
