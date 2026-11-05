import { ITEMS, FAULTS, SKILLS, CERTIFICATES, EQUIPMENT, CHARACTERS, EVENTS, QUESTS, CATEGORIES, PROFESSIONS } from '../content';
import { BALANCE, CONTENT_VERSION, SAVE_VERSION } from '../game/balance';
import type { GameState, ItemInstance } from '../game/types';

export const SAVE_KEY = 'cyber-shop:save:v1';
export const DAY_BACKUP_KEY = 'cyber-shop:day-start:v1';
export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export interface LoadResult { state: GameState | null; error: string | null }
export interface WriteResult { ok: boolean; error: string | null }
const errorText = (e: unknown) => e instanceof Error ? e.message : String(e);
function check(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function checksum(text: string) { let hash = 0x811c9dc5; for (let i = 0; i < text.length; i++) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 0x01000193); } return (hash >>> 0).toString(16).padStart(8, '0'); }
const object = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const number = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const integer = (v: unknown) => number(v) && Number.isSafeInteger(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(a => typeof a === 'string') && new Set(v).size === v.length;
const refs = (values: string[], ids: string[]) => values.every(v => ids.includes(v));

/** The import boundary checks structure, identifiers and ownership before replacing live state. */
export function validateState(value: unknown): asserts value is GameState {
  check(object(value), '存档状态不是有效对象。');
  const s = value as unknown as GameState;
  check(s.version === SAVE_VERSION && s.contentVersion === CONTENT_VERSION && s.balanceVersion === BALANCE.version, '存档结构、内容或数值版本不兼容，请保留原文件。');
  for (const key of ['seed', 'rng', 'serial', 'day', 'chapter', 'cash', 'debt', 'grace', 'xp', 'level', 'points', 'visitorIndex', 'finalStage'] as const) check(integer(s[key]), `存档字段 ${key} 无效。`);
  check(number(s.hours) && s.hours <= BALANCE.hours && s.hours * 2 % 1 === 0, '工时无效。');
  check(s.day >= 1 && s.chapter >= 1 && s.chapter <= 4 && s.level >= 1 && s.finalStage <= 3 && s.rng <= 0xffffffff && s.seed <= 0xffffffff, '进度字段超出范围。');
  check(['open', 'closed', 'won', 'ended', 'failed'].includes(s.phase), '营业阶段无效。');
  for (const key of ['eventResolved', 'finalComplete', 'victory', 'endless', 'freeRespec'] as const) check(typeof s[key] === 'boolean', `存档字段 ${key} 无效。`);
  check(Number.isFinite(s.reputation), '声望无效。');
  check(strings(s.skills) && refs(s.skills, SKILLS.map(a => a.id)), '技能记录无效。');
  check(strings(s.certificates) && refs(s.certificates, CERTIFICATES.map(a => a.id)) && s.certificates.includes('civil'), '证书记录无效。');
  check(strings(s.trained) && refs(s.trained, CERTIFICATES.map(a => a.id)), '培训记录无效。');
  check(strings(s.licenses) && refs(s.licenses, ['regulated-trade']), '交易许可记录无效。');
  check(strings(s.discovered) && refs(s.discovered, ITEMS.map(a => a.id)), '图鉴记录无效。');
  check(strings(s.met) && refs(s.met, CHARACTERS.map(a => a.id)), '人物记录无效。');
  check(strings(s.professionMilestones) && refs(s.professionMilestones, PROFESSIONS.map(p => p.finalMilestone)), '职业里程碑记录无效。');
  check(s.appointments === null || CATEGORIES.some(c => c.id === s.appointments), '预约分类无效。');
  check(EVENTS.some(e => e.id === s.eventId), '街区事件无效。');
  check(object(s.equipment) && Object.entries(s.equipment).every(([id, count]) => EQUIPMENT.some(e => e.id === id) && integer(count)), '道具数量无效。');
  check(object(s.equipmentCosts) && Object.entries(s.equipmentCosts).every(([id, cost]) => EQUIPMENT.some(e => e.id === id) && integer(cost)), '道具成本无效。');
  check(object(s.relations) && Object.values(s.relations).every(n => typeof n === 'number' && Number.isFinite(n)), '关系记录无效。');
  check(object(s.questStages) && Object.entries(s.questStages).every(([id, stage]) => { const q = QUESTS.find(q => q.id === id); return q && integer(stage) && stage <= q.stages.length; }), '人物委托进度无效。');
  check(object(s.records) && ['trades', 'repairs', 'revenue', 'repairIncome', 'days'].every(k => integer((s.records as unknown as Record<string, unknown>)[k])) && object(s.records.faults) && Object.entries(s.records.faults).every(([id, n]) => FAULTS.some(f => f.id === id) && integer(n)), '经营纪录无效。');
  const validateItem = (i: ItemInstance) => {
    check(object(i) && typeof i.id === 'string' && ITEMS.some(d => d.id === i.definitionId), '物品模板无效。');
    check(['player', 'customer'].includes(i.owner) && ['stock', 'display', 'workshop'].includes(i.location), '物品归属或位置无效。');
    check(i.owner !== 'customer' || i.location === 'workshop', '客户物品不能属于货架或展示柜。');
    check(['condition', 'integrity', 'capacity', 'purity', 'originality'].every(k => number((i as unknown as Record<string, unknown>)[k]) && Number((i as unknown as Record<string, unknown>)[k]) <= 100), '物品属性超出范围。');
    check(typeof i.authentic === 'boolean' && typeof i.provenance === 'string' && typeof i.compatibility === 'string', '物品来源记录无效。');
    check((i.expiresDay === null || integer(i.expiresDay)) && integer(i.cost) && integer(i.acquiredDay) && integer(i.preservedUntil), '物品成本或保质期无效。');
    check(strings(i.faults) && refs(i.faults, FAULTS.map(a => a.id)) && strings(i.known) && refs(i.known, ['basic', 'scan', 'serial', 'batch', 'diagnosed', 'restored']), '物品检测记录无效。');
    const d = ITEMS.find(d => d.id === i.definitionId)!;
    check(!i.faults.length || (d.certificate && i.faults.every(id => FAULTS.find(f => f.id === id)?.certificate === d.certificate)), '该商品含不适用的故障。');
  };
  check(Array.isArray(s.items) && s.items.length < 10000, '库存数据无效。'); s.items.forEach(validateItem);
  check(new Set(s.items.map(i => i.id)).size === s.items.length, '存档含重复物品实例。');
  check(Array.isArray(s.visitors) && s.visitors.length === BALANCE.visitors && s.visitorIndex < s.visitors.length, '客户队列无效。');
  for (const v of s.visitors) {
    check(object(v) && typeof v.id === 'string' && CHARACTERS.some(c => c.id === v.characterId) && ['seller', 'buyer', 'repair'].includes(v.kind) && CATEGORIES.some(c => c.id === v.category), '客户记录无效。');
    check(integer(v.quote) && integer(v.limit) && integer(v.rounds) && integer(v.patience) && typeof v.resolved === 'boolean' && typeof v.request === 'string', '客户报价记录无效。');
    if (v.item) validateItem(v.item);
  }
  check(Array.isArray(s.orders), '维修工单无效。');
  const activeItems = new Set<string>();
  for (const o of s.orders) {
    check(object(o) && typeof o.id === 'string' && typeof o.itemId === 'string' && typeof o.characterId === 'string' && typeof o.description === 'string' && ['client', 'exam', 'final', 'own'].includes(o.kind), '维修工单内容无效。');
    check(['diagnosed', 'verified', 'delivered', 'preserveOriginal'].every(k => typeof (o as unknown as Record<string, unknown>)[k] === 'boolean') && integer(o.escrow) && integer(o.reward) && integer(o.completedOps), '维修工单数值无效。');
    check(!o.certificate || CERTIFICATES.some(c => c.id === o.certificate), '考核证书无效。');
    if (!o.delivered) { const item = s.items.find(i => i.id === o.itemId); check(item && item.location === 'workshop' && !activeItems.has(item.id), '进行中的工单物品缺失或重复。'); check(o.kind === 'own' ? item.owner === 'player' : item.owner === 'customer', '维修工单归属冲突。'); activeItems.add(item.id); }
  }
  check(new Set(s.orders.map(o => o.id)).size === s.orders.length, '存档含重复工单。');
  check(Array.isArray(s.ledger) && s.ledger.every(e => object(e) && integer(e.id) && integer(e.day) && typeof e.kind === 'string' && Number.isFinite(e.amount) && typeof e.note === 'string'), '账本无效。');
  check(Array.isArray(s.messages) && s.messages.every(m => typeof m === 'string'), '消息记录无效。');
  if (s.challenge !== null) check(object(s.challenge) && ['batch-repair', 'exhibition', 'rare-trade'].includes(s.challenge.id) && ['goal', 'progress', 'deadline', 'reward'].every(k => integer((s.challenge as unknown as Record<string, unknown>)[k])), '挑战记录无效。');
  check(!s.endless || s.victory, '无尽模式缺少已完成的经营权结局。');
  check(!s.finalComplete || s.finalStage === 3, '最终委托阶段冲突。');
  check(s.finalComplete === s.professionMilestones.includes(PROFESSIONS.find(p => p.id === 'restorer')!.finalMilestone), '修复师最终委托与职业里程碑记录冲突。');
}
/** Pre-interface demo-2 saves only had the restorer's finalComplete flag. No other profession is inferred. */
export function migrateState(value: unknown): unknown {
  if (!object(value) || Object.hasOwn(value, 'professionMilestones') || value.version !== SAVE_VERSION || value.contentVersion !== CONTENT_VERSION || value.balanceVersion !== BALANCE.version) return value;
  const repairMilestone = PROFESSIONS.find(p => p.id === 'restorer')!.finalMilestone;
  return { ...value, professionMilestones: value.finalComplete === true && value.finalStage === 3 ? [repairMilestone] : [] };
}
export function exportSave(state: GameState) {
  validateState(state); const body = JSON.stringify(state);
  return JSON.stringify({ format: 'cyber-shop', version: SAVE_VERSION, savedAt: new Date().toISOString(), checksum: checksum(body), state }, null, 2);
}
export function importSave(text: string): GameState {
  check(text.length < 10 * 1024 * 1024, '存档文件过大。');
  let envelope: unknown;
  try { envelope = JSON.parse(text); } catch { throw new Error('存档 JSON 损坏，原文件已保留。'); }
  check(object(envelope) && envelope.format === 'cyber-shop' && envelope.version === SAVE_VERSION, '这不是兼容的《赛博杂货铺》存档。');
  check(envelope.checksum === checksum(JSON.stringify(envelope.state)), '存档完整性校验失败，原文件已保留。');
  const state = migrateState(envelope.state); validateState(state); return structuredClone(state);
}
function loadKey(key: string, storage?: StorageLike): LoadResult {
  try { const text = (storage ?? globalThis.localStorage).getItem(key); return { state: text === null ? null : importSave(text), error: null }; }
  catch (e) { return { state: null, error: errorText(e) }; }
}
export const loadSave = (storage?: StorageLike): LoadResult => loadKey(SAVE_KEY, storage);
export const restoreDayBackup = (storage?: StorageLike): LoadResult => loadKey(DAY_BACKUP_KEY, storage);
function writeKey(key: string, state: GameState, storage?: StorageLike, replace = false): WriteResult {
  try {
    const target = storage ?? globalThis.localStorage;
    const encoded = exportSave(state); const old = target.getItem(key);
    if (old !== null) {
      if (replace) {
        const prefix = `${key}:preserved:${Date.now()}`; let archiveKey = prefix; let suffix = 0;
        while (target.getItem(archiveKey) !== null) archiveKey = `${prefix}:${++suffix}`;
        target.setItem(archiveKey, old);
      }
      try { importSave(old); } catch (e) {
        if (!replace) return { ok: false, error: `现有存档损坏或不兼容，已停止自动覆盖。${errorText(e)}` };
      }
    }
    target.setItem(key, encoded); return { ok: true, error: null };
  } catch (e) { return { ok: false, error: `保存失败：${errorText(e)}。可导出文件保留进度。` }; }
}
export const saveGame = (state: GameState, storage?: StorageLike): WriteResult => writeKey(SAVE_KEY, state, storage);
export const saveDayBackup = (state: GameState, storage?: StorageLike): WriteResult => writeKey(DAY_BACKUP_KEY, state, storage);
/** Explicit new game or import resets the local recovery point, preserving previous bytes first. */
export const replaceDayBackup = (state: GameState, storage?: StorageLike): WriteResult => writeKey(DAY_BACKUP_KEY, state, storage, true);
/** Only invoke after an explicit new-game/import/restore action. Existing bytes are archived first. */
export const replaceSave = (state: GameState, storage?: StorageLike): WriteResult => writeKey(SAVE_KEY, state, storage, true);
