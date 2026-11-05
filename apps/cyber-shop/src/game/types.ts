export type CategoryId = 'electronics' | 'energy' | 'food' | 'neural' | 'data' | 'antique';
export type CertificateId = 'civil' | 'industrial' | 'neural' | 'antique';
export type Operation = 'clean' | 'replace' | 'calibrate';
export interface CategoryDefinition { id: CategoryId; name: string; description: string; tradeRule: string }
export interface ItemDefinition {
  footprint: { width: number; height: number };
  id: string; name: string; category: CategoryId; price: number; size: number; chapter: number;
  certificate?: CertificateId; regulated?: boolean; shelfLife?: number; rarity: number; valueMetric?: 'capacity' | 'purity';
  description: string; states: string[]; actions: string[]; preferences: string[]; image: string;
}
export interface FaultDefinition { id: string; name: string; symptom: string; operation: Operation; module: string; target: number; material: string; hours: number; certificate: CertificateId }
export interface ItemInstance {
  id: string; definitionId: string; owner: 'player' | 'customer'; location: 'stock' | 'display' | 'workshop' | 'counter';
  grid?: { x: number; y: number; rotated: boolean };
  counterGrid?: { x: number; y: number; rotated: boolean };
  condition: number; integrity: number; capacity: number; purity: number; authentic: boolean; originality: number;
  provenance: string; compatibility: string; expiresDay: number | null; faults: string[]; known: string[];
  cost: number; acquiredDay: number; preservedUntil: number;
}
export interface CharacterDefinition { id: string; name: string; role: string; group: string; preferences: CategoryId[]; patience: number; bargain: string; intro: string; returning: string; endless: boolean; image: string }
export interface SkillDefinition { id: string; name: string; tree: 'general' | 'repair'; branch: string; tier: number; cost: number; requires: string[]; effect: string; amount: number; description: string }
export interface EquipmentDefinition { id: string; name: string; type: 'tool' | 'material' | 'facility'; price: number; effect: string; amount: number; description: string; image: string }
export interface CertificateDefinition { id: CertificateId; name: string; cases: number; fee: number; chapter: number; tools: string[]; examItem: string; examFaults: string[]; description: string }
export interface EventDefinition { id: string; name: string; text: string; category: CategoryId; multiplier: number; choices: { label: string; cash: number; reputation: number; group: string; relation: number; description: string }[] }
export interface QuestStage { text: string; requirement: 'repairs' | 'trades' | 'display' | 'certificate' | 'master' | 'final'; count: number; reward: number; xp: number }
export interface QuestDefinition { id: string; name: string; character: string; stages: QuestStage[] }
export interface CollectionTheme { id: string; name: string; description: string; items: string[]; bonus: number }
export interface ProfessionDefinition { id: string; name: string; implemented: boolean; masterySkills: string[]; finalMilestone: string; description: string }
export interface RecipeDefinition { id: string; profession: string; input: Record<string, number>; output: string; enabled: boolean }
export interface Visitor { id: string; characterId: string; kind: 'seller' | 'buyer' | 'repair'; item?: ItemInstance; goods?: ItemInstance[]; budget?: number; category: CategoryId; quote: number; limit: number; rounds: number; patience: number; resolved: boolean; request: string }
export interface RepairOrder { id: string; itemId: string; characterId: string; description: string; diagnosed: boolean; verified: boolean; delivered: boolean; escrow: number; reward: number; completedOps: number; kind: 'client' | 'exam' | 'final' | 'own'; certificate?: CertificateId; finalStage?: number; preserveOriginal: boolean }
export interface LedgerEntry { id: number; day: number; kind: string; amount: number; itemId?: string; note: string }
export interface GameState {
  visitorArrived?: boolean;
  storageUpgrades?: { backpack: number; crate: number };
  tutorial?: { step: number; skipped: boolean };
  conversations?: Record<string, number>;
  version: number; contentVersion: string; balanceVersion: string; seed: number; rng: number; serial: number;
  day: number; chapter: number; phase: 'open' | 'closed' | 'won' | 'ended' | 'failed'; cash: number; hours: number; debt: number; grace: number;
  xp: number; level: number; points: number; skills: string[]; certificates: CertificateId[]; trained: CertificateId[]; licenses: string[];
  equipment: Record<string, number>; equipmentCosts: Record<string, number>; items: ItemInstance[]; visitors: Visitor[]; visitorIndex: number; orders: RepairOrder[];
  reputation: number; relations: Record<string, number>; questStages: Record<string, number>; eventId: string; eventResolved: boolean;
  discovered: string[]; met: string[]; records: { trades: number; repairs: number; revenue: number; repairIncome: number; days: number; faults: Record<string, number> };
  finalStage: number; finalComplete: boolean; professionMilestones: string[]; victory: boolean; endless: boolean; freeRespec: boolean;
  ledger: LedgerEntry[]; messages: string[]; appointments: CategoryId | null; challenge: { id: string; goal: number; progress: number; deadline: number; reward: number } | null;
}
export type Action =
 | { type: 'callVisitor' }
 | { type: 'buyStorage'; kind: 'backpack' | 'crate' }
 | { type: 'tradeBatch'; visitorId: string; itemIds: string[]; amount?: number; placements?: Record<string, {x:number;y:number;rotated:boolean}> }
 | { type: 'moveCounter'; itemId: string; x: number; y: number; rotated: boolean }
 | { type: 'moveStock'; itemId: string; x: number; y: number; rotated: boolean }
 | { type: 'talk'; visitorId: string }
 | { type: 'tutorial'; step: number; skipped?: boolean }
 | { type: 'inspect'; itemId?: string; visitorId?: string; method?: 'basic' | 'scan' | 'serial' }
 | { type: 'offer'; visitorId: string; amount: number; itemId?: string }
 | { type: 'acceptTrade'; visitorId: string; itemId?: string }
 | { type: 'reject'; visitorId: string }
 | { type: 'nextVisitor' }
 | { type: 'acceptRepair'; visitorId?: string }
 | { type: 'startRepair'; itemId: string }
 | { type: 'diagnose'; orderId: string }
 | { type: 'repair'; orderId: string; operation: Operation; module?: string; value?: number; quick?: boolean; preserve?: boolean }
 | { type: 'verify'; orderId: string }
 | { type: 'deliver'; orderId: string }
 | { type: 'train'; certificate: CertificateId }
 | { type: 'exam'; certificate: CertificateId }
 | { type: 'learn'; skillId: string }
 | { type: 'respec'; skills: string[] }
 | { type: 'license' }
 | { type: 'buyEquipment'; equipmentId: string; count?: number }
 | { type: 'display'; itemId: string }
 | { type: 'withdraw'; itemId: string }
 | { type: 'preserve'; itemId: string }
 | { type: 'liquidate'; itemId: string }
 | { type: 'sort' }
 | { type: 'appoint'; category: CategoryId | null }
 | { type: 'eventChoice'; index: number }
 | { type: 'claimQuest'; questId: string }
 | { type: 'startFinal' }
 | { type: 'buyShop' }
 | { type: 'continueEndless' }
 | { type: 'endGame' }
 | { type: 'challenge'; id: string }
 | { type: 'closeDay' }
 | { type: 'openDay' };
export interface PresentationEvent { type: 'trade' | 'repair' | 'arrival' | 'display' | 'success' | 'error' | 'day'; text: string }
export interface ActionResult { state: GameState; events: PresentationEvent[]; ok: boolean }
