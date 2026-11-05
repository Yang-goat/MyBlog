/** Playtest values: all money is integer credits, all work is discrete half-hours. */
export const BALANCE = {
  version: 'demo-2', initialCash: 1200, shopPrice: 12000, hours: 12, visitors: 7,
  stock: 36, showcase: 3, maxShowcase: 6, workstations: 2,
  rent: 65, maintenance: 20, graceDays: 3, xpPerLevel: 180, initialPoints: 0,
  tradeXp: 8, repairXp: 24, examXp: 45, dayXp: 5, inspectionHours: .5,
  diagnosisHours: 1, verificationHours: 1, minimumOperationHours: .5,
  basicRepairReward: 310, advancedRepairReward: 460, neuralRepairReward: 620, antiqueRepairReward: 790,
  finalRewards: [650, 850, 1400], respecPrice: 350, licensePrice: 450,
  chapterRepairs: [0, 5, 14, 28], masterInvestment: 6,
  sellerFactor: .65, sellerFloor: .48, buyerFactor: 1.12, buyerCeiling: 1.3,
  liquidateFactor: .52, maxOrders: 6, maximumPurchaseCount: 99,
  challengeGoal: 6, challengeDays: 4, challengeReward: 1500,
} as const;
export const SAVE_VERSION = 1;
export const CONTENT_VERSION = 'demo-1';
export const CHALLENGES = [
  { id: 'batch-repair', name: '批量维修', goal: 6, days: 4, fee: 0, reward: 1500, description: '在期限内交付 6 件客户维修工单。' },
  { id: 'exhibition', name: '陈列工程', goal: 60, days: 4, fee: 0, reward: 1500, description: '闭店时展示柜吸引力达到 60。' },
  { id: 'rare-trade', name: '珍品订单', goal: 2, days: 5, fee: 150, reward: 2200, description: '支付 150 登记费用，在期限内向买家售出 2 件稀有度至少 3 的真实藏品；清货不计。' },
] as const;
