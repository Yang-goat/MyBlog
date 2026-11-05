import type { CategoryDefinition, CategoryId, CertificateId, ItemDefinition } from '../game/types';

export const CATEGORIES: CategoryDefinition[] = [
  { id: 'electronics', name: '民用与工业机电', description: '从掌心终端到街区的机械关节。', tradeRule: '功能故障与磨损降低报价；修复需要对应证书，体积影响仓储。' },
  { id: 'energy', name: '能源与工业材料', description: '维持下层城市运转的电与材料。', tradeRule: '有效容量、纯度与每日行情改变价格；原材料不能按电子故障维修。' },
  { id: 'food', name: '食品与生物制品', description: '人们每天仍要喝水、吃饭、照顾伤口。', tradeRule: '到期后失去售卖价值，临期折价；冷藏与保鲜包延长可售时间。' },
  { id: 'neural', name: '神经与医疗器件', description: '接在人身上的精密技术。', tradeRule: '型号兼容影响买家接受度；部分器件买卖需交易许可，维修另需证书。' },
  { id: 'data', name: '数据与娱乐载体', description: '一段影像、一首歌，也可能是一座城市的记忆。', tradeRule: '完整度、可读性和授权来源影响价值；修复硬件不会解密内容。' },
  { id: 'antique', name: '古董与奢品', description: '旧城留下的、仍有人在意的东西。', tradeRule: '真伪、出处、原貌和品相共同计价；更换部件可能损伤原貌价值。' },
];

type ItemRow = [id: string, name: string, price: number, size: number, chapter: number, rarity: number, description: string, certificate?: CertificateId, regulated?: boolean, shelfLife?: number];
const states: Record<CategoryId, string[]> = {
  electronics: ['condition', 'faults', 'provenance'], energy: ['capacity', 'purity', 'provenance'],
  food: ['condition', 'expiresDay', 'preservedUntil'], neural: ['condition', 'faults', 'compatibility', 'provenance'],
  data: ['condition', 'integrity', 'provenance'], antique: ['condition', 'authentic', 'originality', 'provenance'],
};
const preferences: Record<CategoryId, string[]> = {
  electronics: ['lu-che', 'he-jin', 'lin-qiao'], energy: ['he-jin', 'qi-lan'], food: ['a-miao', 'lin-qiao'],
  neural: ['song-yi', 'shen-wu'], data: ['wen-zhu', 'lu-che'], antique: ['bai-heng', 'luo-jin', 'wen-zhu'],
};
const rows: Record<CategoryId, ItemRow[]> = {
  electronics: [
    ['pocket-com', '掌上通讯器', 240, 1, 1, 1, '短程呼叫仍然可靠。机壳上的胶带，往往比型号更新得勤。', 'civil'],
    ['portable-terminal', '随身终端', 380, 1, 1, 1, '折叠屏与实体键盘，收货、记账、接委托都靠它。', 'civil'],
    ['sweeper-drone', '清扫无人机', 560, 2, 2, 2, '沿着街边磁轨寻找灰尘，滚轮里常缠着旧电线。', 'industrial'],
    ['servo-arm', '伺服机械臂', 920, 3, 2, 2, '工坊淘汰的紧凑机械臂，校准后仍能稳稳夹住一颗螺母。', 'industrial'],
    ['industrial-sensor', '工业传感器', 680, 1, 2, 2, '能忍受高温与粉尘，却容不得漂移的零点。', 'industrial'],
    ['air-circulator', '便携空气循环机', 460, 2, 1, 1, '把巷道里沉闷的空气送过滤芯，宿舍和小店都需要。', 'civil'],
  ],
  energy: [
    ['battery-pack', '标准电池组', 160, 1, 1, 1, '统一接口的常用电池；铭牌容量不等于今天还剩的容量。'],
    ['capacitor-array', '微型电容阵列', 420, 1, 2, 2, '短促释放电流的密封阵列，适合应急闸门与工业脉冲。', 'industrial'],
    ['power-module', '便携电源模块', 640, 2, 2, 2, '带调压控制板的小型电源，容量衰减和控制故障需要分开判断。', 'industrial'],
    ['alloy-plate', '高导合金板', 210, 2, 1, 1, '同样一块银灰薄板，批次纯度决定它是好导体还是昂贵废料。'],
    ['insulation-roll', '绝缘纤维卷', 140, 1, 1, 1, '潮湿季最容易缺货的工业纤维，保持干燥才能发挥作用。'],
    ['catalyst-core', '稀土催化芯', 980, 1, 3, 3, '提纯设备中的细小核心，来源批次比外壳的光泽更有说服力。'],
  ],
  food: [
    ['purified-water', '净化饮水', 70, 1, 1, 1, '回收瓶封得很严，街坊喝的是净化批次与安心。', undefined, false, 5],
    ['synth-coffee', '合成咖啡', 120, 1, 1, 1, '深夜工坊的咖啡因来源，淡淡烘烤香能掩住机油味。', undefined, false, 4],
    ['algae-ration', '藻蛋白口粮', 95, 1, 1, 1, '便宜、耐饥，却经不起反复受潮；包装日期要看清。', undefined, false, 4],
    ['culture-starter', '速生菌种包', 230, 1, 2, 2, '密封袋里是仍然活着的菌种，温度和时间比花色重要。', undefined, false, 3],
    ['nutrient-fluid', '营养培养液', 190, 1, 2, 2, '屋顶种植箱常用配方；开箱后的配送速度决定最后几天价值。', undefined, false, 4],
    ['bio-gel', '医用生物凝胶', 450, 1, 3, 3, '冷链运来的密封凝胶，交易要求有效许可与可追溯来源。', undefined, true, 3],
  ],
  neural: [
    ['haptic-module', '触觉反馈模块', 310, 1, 1, 1, '外接训练器常用部件。普通接口可交易，精密调校另需资质。', 'neural'],
    ['optical-eye', '光学义眼组件', 840, 1, 3, 2, '成像阵列很亮，接口代际却可能与买家的旧机体不合。', 'neural', true],
    ['neural-bridge', '神经接口桥', 1250, 1, 3, 3, '连接感知总线的受管制器件，每枚序列号都应有来路。', 'neural', true],
    ['memory-buffer', '记忆缓存模块', 590, 1, 2, 2, '保存短时感官数据的独立模块，通电并不代表校时正确。', 'neural'],
    ['diagnostic-unit', '便携诊疗仪', 960, 2, 3, 2, '诊所出诊箱里的主机，读数必须经过可靠的复检。', 'neural', true],
    ['infusion-pump', '稳态注射泵', 760, 2, 3, 2, '微量输送器件，噪声很轻，失准的后果却不轻。', 'neural', true],
  ],
  data: [
    ['data-chip', '通用数据芯片', 150, 1, 1, 1, '通用接口的小块存储器，封装完整不保证每个扇区都可读。', 'civil'],
    ['encrypted-box', '加密档案盒', 650, 1, 3, 3, '坚固盒内保存着加密档案。修好接口，不会自动得到解密许可。', 'civil'],
    ['holo-film', '全息电影卡', 260, 1, 1, 1, '下层放映社轮番播放的影片；授权标记与完整片段影响报价。'],
    ['music-tape', '合成音乐带', 180, 1, 1, 1, '塑料带盒里录着城市各处的声音，有人只为某一首买单。'],
    ['game-cartridge', '旧式游戏卡匣', 480, 1, 2, 2, '实体触点和磨损标签让它在收藏者之间继续流转。', 'civil'],
    ['memory-crystal', '私人影像晶片', 720, 1, 3, 3, '拥有者授权转让的影像介质；每一处损坏都可能是一段生活。', 'civil'],
  ],
  antique: [
    ['mechanical-watch', '机械计时器', 520, 1, 1, 2, '不依赖城网校时的旧机芯，仍然按自己的节奏走。', 'antique'],
    ['early-core', '早期计算核心', 1280, 2, 4, 4, '陶瓷封装的第一代计算核心，修复功能与保留原件须仔细取舍。', 'antique'],
    ['film-camera', '胶片相机', 780, 2, 2, 3, '没有即时回放的取景窗，让拍摄者愿意多等一刻。', 'antique'],
    ['spectrum-jewel', '限量光谱饰品', 990, 1, 3, 3, '多层玻璃把冷光折成暖色，真正的手工批次留有微小差异。'],
    ['old-city-badge', '旧城纪念徽章', 180, 1, 1, 2, '拆迁前社区留下的金属小徽章，出处可以比金属更值钱。'],
    ['bionic-toy', '初代仿生玩具', 1100, 2, 4, 4, '旧式机械小兽会缓慢转头；有人想让它再动一次，有人只想留下原样。', 'antique'],
  ],
};

export const ITEMS: ItemDefinition[] = (Object.keys(rows) as CategoryId[]).flatMap(category => rows[category].map(row => {
  const [id, name, price, size, chapter, rarity, description, certificate, regulated, shelfLife] = row;
  const valueMetric = category === 'energy' ? (['battery-pack', 'capacitor-array', 'power-module'].includes(id) ? 'capacity' as const : 'purity' as const) : undefined;
  const actions = ['inspect', 'trade', 'display'];
  if (certificate) actions.push('repair');
  if (category === 'food') actions.push('preserve');
  return { id, name, category, price, size, chapter, rarity, description, certificate, regulated, shelfLife, valueMetric, states: states[category], actions, preferences: preferences[category], image: `${id}.webp` };
}));
