import type { CertificateDefinition, EquipmentDefinition, FaultDefinition, ProfessionDefinition, RecipeDefinition, SkillDefinition } from '../game/types';

export const FAULTS: FaultDefinition[] = [
  { id: 'oxidized-contact', name: '触点氧化', symptom: '轻压接口时能短暂通电，接点电阻偏高。', operation: 'clean', module: 'contacts', target: 0, material: 'cleaner', hours: 1, certificate: 'civil' },
  { id: 'broken-power', name: '供电板断路', symptom: '输入侧有电，供电板输出始终为零。', operation: 'replace', module: 'power', target: 0, material: 'electronic-parts', hours: 2, certificate: 'civil' },
  { id: 'clock-drift', name: '时钟失准', symptom: '响应周期忽快忽慢，时钟参考值应为 50。', operation: 'calibrate', module: 'clock', target: 50, material: 'electronic-parts', hours: 1, certificate: 'civil' },
  { id: 'jammed-bearing', name: '轴承积尘', symptom: '驱动单元有负载电流，转轴阻力明显偏高。', operation: 'clean', module: 'drive', target: 0, material: 'cleaner', hours: 1, certificate: 'industrial' },
  { id: 'burnt-driver', name: '驱动模块烧损', symptom: '驱动控制信号正常，功率模块发热且不能动作。', operation: 'replace', module: 'drive', target: 0, material: 'mechanical-parts', hours: 2, certificate: 'industrial' },
  { id: 'insulation-leak', name: '绝缘层漏电', symptom: '外壳漏电读数超出范围，绝缘套出现裂纹。', operation: 'replace', module: 'insulation', target: 0, material: 'insulation', hours: 2, certificate: 'industrial' },
  { id: 'neural-noise', name: '神经接口污染', symptom: '输入稳定，接插件处出现散乱噪声尖峰。', operation: 'clean', module: 'neural', target: 0, material: 'neural-supplies', hours: 1, certificate: 'neural' },
  { id: 'sensor-drift', name: '光学零点漂移', symptom: '暗场读数不归零，光学参考通道要求校准到 65。', operation: 'calibrate', module: 'optic', target: 65, material: 'neural-supplies', hours: 2, certificate: 'neural' },
  { id: 'feedback-loop', name: '反馈回路振荡', symptom: '阶跃输入后反复振荡，阻尼基准要求设为 40。', operation: 'calibrate', module: 'feedback', target: 40, material: 'neural-supplies', hours: 2, certificate: 'neural' },
  { id: 'old-grease', name: '旧润滑脂固化', symptom: '原始传动结构完整，固化油脂让机械动作迟缓。', operation: 'clean', module: 'mechanism', target: 0, material: 'cleaner', hours: 1, certificate: 'antique' },
  { id: 'worn-gear', name: '原始齿轮磨损', symptom: '齿轮缺口导致传动跳齿；更换会牺牲部分原貌。', operation: 'replace', module: 'mechanism', target: 0, material: 'mechanical-parts', hours: 2, certificate: 'antique' },
  { id: 'analog-drift', name: '模拟振荡偏移', symptom: '老式模拟回路仍有输出，参考刻度应回到 60。', operation: 'calibrate', module: 'oscillator', target: 60, material: 'electronic-parts', hours: 2, certificate: 'antique' },
];

type SkillRow = [name: string, effect: string, amount: number, description: string];
const branches: { id: string; tree: 'general' | 'repair'; name: string; nodes: SkillRow[] }[] = [
  { id: 'trade', tree: 'general', name: '交易', nodes: [
    ['行情判断', 'marketInsight', 1, '查看当前商品的估价区间，结合已知信息判断报价。'],
    ['议价技巧', 'bargain', .08, '争取更有利的成交边界；耐心仍然有限。'],
    ['熟客成交优势', 'loyalty', .08, '重复来访的客户愿意给出更好的交易条件。'],
  ] },
  { id: 'supply', tree: 'general', name: '货源', nodes: [
    ['供货预告', 'supplyPreview', 1, '提前查看当天待来访的货源类别，安排工时和现金。'],
    ['批次信息', 'batchInfo', 1, '检查能源材料时获得有效容量、纯度与批次线索。'],
    ['定向采购', 'targetSupply', 1, '预约目标品类，让下一营业日的货源更贴合经营方向。'],
  ] },
  { id: 'business', tree: 'general', name: '经营', nodes: [
    ['库存规划', 'stockCapacity', 6, '库存增加 24 格；重配失去加成时保留已有物品。'],
    ['保存效率', 'preservation', 2, '保鲜处理多延长 2 个营业日，减少临期损耗。'],
    ['快捷整理与补货', 'restock', .15, '解锁高效整理，购买耗材享有 15% 补货优惠。'],
  ] },
  { id: 'collection', tree: 'general', name: '收藏', nodes: [
    ['藏品编目', 'catalog', 1, '编目让已鉴定藏品的展示更有吸引力。'],
    ['展示组合', 'themeBonus', .5, '完整收藏主题的吸引力加成提高 50%。'],
    ['定向吸引藏家', 'collector', .15, '提升藏家来访与珍品需求的机会，不增加每日来访上限。'],
  ] },
  { id: 'precision', tree: 'repair', name: '精准维修', nodes: [
    ['故障定位', 'diagnosis', 1, '诊断节省半点工时，更快获得可执行的故障读数。'],
    ['安全复测', 'verification', 1, '复检节省半点工时；交付仍需实际通过复检。'],
    ['精密校准', 'calibration', 4, '校准允许的读数误差范围扩大 4。'],
    ['精修大师', 'precisionMaster', .35, '高阶精密服务报酬提高，具备承接职业最终委托的能力。'],
  ] },
  { id: 'workshop', tree: 'repair', name: '效率工坊', nodes: [
    ['耗材管理', 'materials', .25, '合理分配耗材，降低维修材料成本。'],
    ['快拆装配', 'assembly', 1, '熟悉装配后，拆装工序节省半点工时。'],
    ['标准工序', 'standard', 1, '熟练处理的重复故障可使用快捷工序，仍结算正常成本。'],
    ['工坊大师', 'workshopMaster', .3, '服务报酬提高 30%，工序再省半点工时，可承接职业最终委托。'],
  ] },
  { id: 'restoration', tree: 'repair', name: '翻新收藏', nodes: [
    ['残值判断', 'salvageValue', 1, '收购时更清楚地判断故障旧货的翻新空间。'],
    ['部件回收', 'recycle', 1, '更换自有物品模块时回收可用部件，客户送修件不进入回收收益。'],
    ['品相复原', 'restoration', 12, '修复自有旧货时额外恢复 12 品相，原貌价值仍单独计算。'],
    ['再造大师', 'rebirthMaster', .25, '翻新旧货交易价值提高，具备承接职业最终委托的能力。'],
  ] },
];
export const SKILLS: SkillDefinition[] = branches.flatMap(branch => branch.nodes.map(([name, effect, amount, description], index) => ({
  id: `${branch.id}-${index + 1}`, name, tree: branch.tree, branch: branch.name, tier: index + 1,
  cost: index === 3 ? 2 : 1, requires: index ? [`${branch.id}-${index}`] : [], effect, amount, description,
})));

type EquipmentRow = [id: string, name: string, type: EquipmentDefinition['type'], price: number, effect: string, amount: number, description: string];
const equipmentRows: EquipmentRow[] = [
  ['scanner', '多谱扫描仪', 'tool', 240, 'scan', 1, '扫描功能状态与故障线索，降低收购未知旧货的风险。'],
  ['market-recorder', '行情记录器', 'tool', 150, 'market', 1, '记录六类商品的行情，辅助检查时的价格判断。'],
  ['serial-terminal', '序列检索终端', 'tool', 280, 'serial', 1, '核对来源、序列及真伪信息，为陈列提供鉴定依据。'],
  ['micro-solder', '微焊工具', 'tool', 160, 'solder', 1, '处理电子模块接点与替换工序，民用入门工序的基础工具。'],
  ['assembly-jig', '装配夹具', 'tool', 240, 'assemblyTool', 1, '固定工业模块，支持更复杂的拆装操作。'],
  ['calibrator', '精密校准仪', 'tool', 360, 'calibrationTool', 1, '提供神经与医疗工序所需的稳定参考读数。'],
  ['cleaner', '清洁剂', 'material', 16, 'cleaner', 1, '去除氧化与旧油脂；每次清洁按工单实际结算。'],
  ['electronic-parts', '电子备件', 'material', 32, 'parts', 1, '替换供电板、时钟与老式模拟回路所需的通用备件。'],
  ['mechanical-parts', '机电组件', 'material', 48, 'mechanical', 1, '用于驱动模块与机械传动结构，不能凭空回收出更高价值。'],
  ['insulation', '绝缘材料', 'material', 28, 'insulation', 1, '修复破损绝缘套，恢复可复检的隔离状态。'],
  ['neural-supplies', '神经检测耗材', 'material', 55, 'neuralSupply', 1, '神经接口清洁与精密校准使用的专用耗材。'],
  ['preserve-pack', '保鲜包', 'material', 22, 'preserveSupply', 1, '延长一件食品的有效保存时间；过期食品不能重新变鲜。'],
  ['workbench', '工作台', 'facility', 300, 'bench', 1, '升级工位与夹持空间，提高维修作业效率。'],
  ['stock-rack', '库存架', 'facility', 260, 'storage', 8, '增加 32 格库存容量；自有物品与客户工单分开管理。'],
  ['cold-storage', '冷藏柜', 'facility', 380, 'cold', 2, '为食品提供稳定冷藏，延长日结时的保存期限。'],
  ['display-case', '收藏展示柜', 'facility', 450, 'showcase', 3, '展示位从 3 格扩展到 6 格，展品退出普通售卖。'],
];
export const EQUIPMENT: EquipmentDefinition[] = equipmentRows.map(([id, name, type, price, effect, amount, description]) => ({ id, name, type, price, effect, amount, description, image: `${id}.webp` }));

export const CERTIFICATES: CertificateDefinition[] = [
  { id: 'civil', name: '民用电子', cases: 0, fee: 0, chapter: 1, tools: ['micro-solder'], examItem: 'pocket-com', examFaults: ['oxidized-contact'], description: '开局资质：通讯器、终端和普通数据载体硬件。' },
  { id: 'industrial', name: '工业设备', cases: 5, fee: 180, chapter: 2, tools: ['assembly-jig'], examItem: 'industrial-sensor', examFaults: ['jammed-bearing', 'insulation-leak'], description: '完成案例积累、培训与实际工序考核，扩展到机电和供能设备。' },
  { id: 'neural', name: '神经接口', cases: 14, fee: 420, chapter: 3, tools: ['calibrator'], examItem: 'diagnostic-unit', examFaults: ['neural-noise', 'sensor-drift'], description: '扩展精密医疗与神经设备维修；不代替受管制商品交易许可。' },
  { id: 'antique', name: '古董科技', cases: 28, fee: 700, chapter: 4, tools: ['serial-terminal'], examItem: 'mechanical-watch', examFaults: ['old-grease', 'analog-drift'], description: '通关后开放；考核兼顾功能恢复与原始部件保存。' },
];

export const PROFESSIONS: ProfessionDefinition[] = [
  { id: 'restorer', name: '修复师', implemented: true, masterySkills: ['precision-4', 'workshop-4', 'restoration-4'], finalMilestone: 'relay-restored', description: '诊断、工序、复检与交付；首版完整职业。' },
  { id: 'fabricator', name: '合成工匠', implemented: false, masterySkills: [], finalMilestone: 'community-fabricator', description: '规划方向：拆解材料、制造配方与设备定制；当前对应商品可交易。' },
  { id: 'energy-tech', name: '能源技师', implemented: false, masterySkills: [], finalMilestone: 'microgrid-stable', description: '规划方向：充能、提纯、供能设备加工；当前容量和纯度影响交易。' },
  { id: 'cultivator', name: '生态培育者', implemented: false, masterySkills: [], finalMilestone: 'roof-garden', description: '规划方向：培养、性状筛选和批量生产；当前保鲜与食品交易可用。' },
  { id: 'data-broker', name: '数据经纪人', implemented: false, masterySkills: [], finalMilestone: 'archive-recovered', description: '规划方向：授权数据恢复、解密与信息委托；当前载体买卖和硬件维修可用。' },
  { id: 'curator', name: '遗物策展人', implemented: false, masterySkills: [], finalMilestone: 'district-exhibition', description: '规划方向：深度考据、主题展览和私人拍卖；当前收藏陈列可用。' },
];

// Reserved registry: recipes become playable only with an implemented profession capability.
export const RECIPES: RecipeDefinition[] = [];
