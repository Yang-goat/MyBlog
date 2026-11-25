import { ITEMS } from '../content/items';
import { RECIPES } from '../content/fabrication';
import { firstObjectPlace, itemAccessible } from './containers';
import type { FabricationMethod, GameState, ItemInstance } from './types';

export const fabricationRecipe = (id: string) => RECIPES.find(recipe => recipe.id === id);
export const FABRICATION_METHODS = {
  standard: { name: '标准装配', extraHours: 0, extraFee: 0, base: 44, limit: 88 },
  fine: { name: '精密装配', extraHours: 1, extraFee: 18, base: 60, limit: 98 },
} satisfies Record<FabricationMethod, {name:string;extraHours:number;extraFee:number;base:number;limit:number}>;
export const isFabricationMethod = (value: unknown): value is FabricationMethod => value === 'standard' || value === 'fine';

export function materialReading(item: ItemInstance) {
  if (!item.known.some(value => value === 'basic' || value === 'diagnosed')) return null;
  if (ITEMS.find(d => d.id === item.definitionId)?.valueMetric !== 'purity') return item.condition;
  return item.known.some(value => value === 'scan' || value === 'batch') ? item.purity : null;
}

export function materialInStock(s: GameState, item: ItemInstance) {
  return item.owner === 'player' && item.location === 'stock' && !item.reserved
    && !s.orders.some(order => !order.delivered && order.itemId === item.id) && itemAccessible(s,item);
}

export function fabricationQuality(reading: number, method: FabricationMethod) {
  const setup = FABRICATION_METHODS[method];
  return Math.min(setup.limit, Math.round(setup.base + reading / 2));
}

export function fabricationPlan(s: GameState, recipeId: string, methodId: FabricationMethod, itemIds: string[], capacity: number) {
  const recipe = fabricationRecipe(recipeId);
  const method = isFabricationMethod(methodId) ? FABRICATION_METHODS[methodId] : undefined;
  const reject = (reason: string) => ({ok:false as const,reason});
  if (!recipe || !method) return reject('请选择有效的配方和装配方式。');
  if (s.phase !== 'open') return reject('开门后才能加工。');
  if (!s.equipment.scanner) return reject('先购置多谱扫描仪。');
  if (!Array.isArray(itemIds) || itemIds.length !== recipe.inputs.length || new Set(itemIds).size !== recipe.inputs.length) return reject('为每个原料位选择一件货物。');
  const materials = itemIds.map(id => s.items.find(item => item.id === id));
  const readings: number[] = [];
  let materialCost = 0;
  for (const [index, item] of materials.entries()) {
    if (!item || item.definitionId !== recipe.inputs[index] || !materialInStock(s,item)) return reject('原料须为货架上可取用的自有货品。');
    const reading = materialReading(item);
    if (reading === null) return reject('先核对全部原料读数。');
    readings.push(reading);
    materialCost += item.cost;
  }
  const quality = fabricationQuality(Math.min(...readings),methodId);
  const fee = recipe.fee + method.extraFee;
  const hours = recipe.hours + method.extraHours;
  const trial = {...s,items:s.items.filter(item => !itemIds.includes(item.id))};
  const placement = firstObjectPlace(trial,capacity,{...materials[0]!,definitionId:recipe.output});
  const reason = s.hours < hours ? '今日剩余工时不足。' : s.cash < fee ? '现金不足以支付加工费。'
    : !placement ? '消耗原料后，主仓仍没有能放下成品的连续空位。' : '';
  return {ok:!reason,reason,recipe,quality,fee,hours,materialCost,placement};
}
