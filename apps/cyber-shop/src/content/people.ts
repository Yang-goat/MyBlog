import type { CharacterDefinition, CollectionTheme, EventDefinition, QuestDefinition } from '../game/types';

export const CHARACTERS: CharacterDefinition[] = [
  { id: 'lin-qiao', name: '林桥', role: '街区互助社联络员', group: 'neighborhood', preferences: ['electronics', 'food'], patience: 4, bargain: '更在意可靠和街坊价；愿意听完检查依据。', intro: '门总算开了。先别急着换招牌，邻里有几件旧东西等人修。', returning: '上回送来的设备还好用，今天又有人托我带东西来。', endless: false, image: 'lin-qiao.webp' },
  { id: 'lu-che', name: '陆澈', role: '穿巷快递员', group: 'neighborhood', preferences: ['electronics', 'data'], patience: 2, bargain: '出价直接，能接受小幅让步，不愿耗掉半天路线。', intro: '我跑完整个下层。通讯器如果能撑过雨季，什么牌子都行。', returning: '你修的那台又跑完了一整圈。顺路给你留了点新消息。', endless: false, image: 'lu-che.webp' },
  { id: 'song-yi', name: '宋宜', role: '夜班诊所器械师', group: 'neighborhood', preferences: ['neural', 'food'], patience: 3, bargain: '接受有记录的合理成本，对来源不明的器械保持距离。', intro: '诊所不缺亮闪闪的设备，缺的是每天都能给出同一个读数的设备。', returning: '复检单我留着。下次若换了模块，也请写清楚。', endless: false, image: 'song-yi.webp' },
  { id: 'wen-zhu', name: '温竹', role: '旧城声音档案员', group: 'neighborhood', preferences: ['data', 'antique'], patience: 4, bargain: '珍视完整内容与可追溯出处，不按金属重量评估记忆。', intro: '我要找的东西也许不贵。里面有一段旧车站的广播声。', returning: '放映社又听到了那段报站声。今天想把旁边的空缺也补起来。', endless: false, image: 'wen-zhu.webp' },
  { id: 'he-jin', name: '贺津', role: '工造联合会检修员', group: 'union', preferences: ['electronics', 'energy'], patience: 3, bargain: '讲工序、批次与工时；报出实测值比夸外观有效。', intro: '会换零件还不够。能把故障原因讲清楚，工坊的单子才交给你。', returning: '这次带来的不是训练件，街区的机器开始认你的手艺了。', endless: false, image: 'he-jin.webp' },
  { id: 'a-miao', name: '阿苗', role: '屋顶食堂经营者', group: 'neighborhood', preferences: ['food', 'energy'], patience: 3, bargain: '看保质期和实用价值，临期货只接受清楚的折价。', intro: '锅每天都得开，食材每天都得看日期。能保住新鲜就有回头客。', returning: '上一批没有浪费。今晚食堂多留了一盏灯给晚归的人。', endless: false, image: 'a-miao.webp' },
  { id: 'qi-lan', name: '祁岚', role: '灰线商团货运协调员', group: 'grayline', preferences: ['energy', 'electronics'], patience: 2, bargain: '批次清楚就快谈；来路含糊的便宜货需要额外核对。', intro: '货路有很多条。你要什么，我可以找；但每条路都有自己的价。', returning: '你上次查的批次号让人记住了。今天这批单据齐全。', endless: false, image: 'qi-lan.webp' },
  { id: 'bai-heng', name: '白衡', role: '旧物巡回商', group: 'grayline', preferences: ['antique', 'data'], patience: 4, bargain: '愿意讨论出处，真伪未明时不会承担全部风险。', intro: '听说这里的招牌终于属于店主了。我带来一些比招牌年纪还大的东西。', returning: '路又走了一圈。看见合适的旧物，我会想起你这扇门。', endless: true, image: 'bai-heng.webp' },
  { id: 'luo-jin', name: '罗槿', role: '私人生活史收藏家', group: 'neighborhood', preferences: ['antique', 'data'], patience: 4, bargain: '看展柜的故事与完整主题，对重复堆放没有额外兴趣。', intro: '我收藏的是人怎样生活，不只是哪年造了什么。先让我看看你的展柜。', returning: '上次那组陈列我还记得。这次又有了什么新的联系？', endless: true, image: 'luo-jin.webp' },
  { id: 'shen-wu', name: '沈雾', role: '轨道检修队精密设备主管', group: 'union', preferences: ['neural', 'electronics'], patience: 3, bargain: '为可靠工序付费，要求交付前可复核的读数。', intro: '联络中枢的复检记录传到了轨道层。我们有更细、更难的工单。', returning: '设备在列车上运行稳定。下一批仍按你的工序单来。', endless: true, image: 'shen-wu.webp' },
];

type EventRow = [id: string, name: string, text: string, category: EventDefinition['category'], multiplier: number, choices: EventDefinition['choices']];
const eventRows: EventRow[] = [
  ['rain-grid', '雨季跳闸', '下层配电箱接连跳闸，街坊开始寻找可靠的备用电源。', 'energy', 1.25, [
    { label: '提供应急联络', cash: 0, reputation: 2, group: 'neighborhood', relation: 2, description: '互助社记下这份支持；能源行情今日上扬。' },
    { label: '优先核对批次', cash: 0, reputation: 1, group: 'union', relation: 2, description: '工造联合会认可谨慎的进货方式。' },
  ]],
  ['night-meal', '夜班加餐', '食堂收到了临时夜班订单，保质期充足的补给更受欢迎。', 'food', 1.18, [
    { label: '赞助加餐', cash: -60, reputation: 3, group: 'neighborhood', relation: 3, description: '付出 60 信用点，帮助夜班工人吃上热饭。' },
    { label: '交换供货消息', cash: 0, reputation: 1, group: 'grayline', relation: 1, description: '记下新一批补给的到货路线。' },
  ]],
  ['factory-clearance', '工坊换代', '工造联合会更换设备，旧型机电进入流通。行情下降，翻新空间扩大。', 'electronics', .82, [
    { label: '协助设备登记', cash: 40, reputation: 1, group: 'union', relation: 2, description: '登记服务结算 40 信用点。' },
    { label: '保留零售工时', cash: 0, reputation: 0, group: 'neighborhood', relation: 1, description: '把今天留给街坊的小件维修。' },
  ]],
  ['film-night', '巷口放映夜', '放映社要在停用的站台举办一场老电影之夜。', 'data', 1.22, [
    { label: '承担场地电费', cash: -80, reputation: 3, group: 'neighborhood', relation: 3, description: '支付 80 信用点，让公共放映如期举行。' },
    { label: '帮忙核对授权', cash: 20, reputation: 1, group: 'union', relation: 1, description: '授权核对获得 20 信用点服务费。' },
  ]],
  ['cold-chain', '冷链延误', '冷藏运输车晚到了两班，附近店主开始清理临期存货。', 'food', .84, [
    { label: '与食堂共享消息', cash: 0, reputation: 2, group: 'neighborhood', relation: 2, description: '公开日期信息，减少街区浪费。' },
    { label: '帮货队重排路线', cash: 35, reputation: 0, group: 'grayline', relation: 2, description: '路线整理结算 35 信用点。' },
  ]],
  ['permit-desk', '临时许可咨询点', '管理处在街口设了咨询桌，说明受管制器件的流转要求。', 'neural', 1.05, [
    { label: '公开交易须知', cash: 0, reputation: 2, group: 'union', relation: 2, description: '受管制商品仍须单独办理交易许可。' },
    { label: '协助街坊登记', cash: 30, reputation: 1, group: 'neighborhood', relation: 1, description: '登记服务费 30 信用点。' },
  ]],
  ['serial-dispute', '重复的序列号', '灰线货单里出现两个相同序列号。登记可能有误，也可能另有原因。', 'neural', .9, [
    { label: '交联合会核验', cash: 0, reputation: 3, group: 'union', relation: 3, description: '保留证据并交叉核对，不把疑点当成结论。' },
    { label: '要求货队补证', cash: 0, reputation: 1, group: 'grayline', relation: 1, description: '让供货方补齐来源单据。' },
  ]],
  ['anniversary', '旧城纪念日', '街坊在曾经的车站遗址挂起小灯，旧城纪念品重新有人询问。', 'antique', 1.28, [
    { label: '支持公共陈列', cash: -70, reputation: 3, group: 'neighborhood', relation: 3, description: '支付 70 信用点制作公共陈列说明。' },
    { label: '登记口述出处', cash: 0, reputation: 2, group: 'neighborhood', relation: 2, description: '让旧物的故事有机会被核对和保留。' },
  ]],
  ['alloy-surplus', '合金集中到货', '新货运线送来一整批合金，材料价格暂时回落。', 'energy', .8, [
    { label: '帮忙对照批号', cash: 40, reputation: 1, group: 'grayline', relation: 2, description: '清点工作获得 40 信用点。' },
    { label: '转告小型工坊', cash: 0, reputation: 2, group: 'union', relation: 2, description: '独立工坊也能赶上这一批货。' },
  ]],
  ['clinic-shift', '诊所扩充夜班', '诊所加开夜班，兼容旧接口的可靠器械需求增加。', 'neural', 1.2, [
    { label: '补贴检修记录耗材', cash: -60, reputation: 3, group: 'neighborhood', relation: 3, description: '支付 60 信用点帮助诊所维护记录。' },
    { label: '公开兼容型号表', cash: 0, reputation: 1, group: 'union', relation: 2, description: '减少买错代际的器件。' },
  ]],
  ['archive-copy', '声音档案征集', '温竹正在整理即将拆除的下层广播站，完整介质更受重视。', 'data', 1.16, [
    { label: '支持公共备份', cash: -50, reputation: 2, group: 'neighborhood', relation: 3, description: '支付 50 信用点，帮助档案增加备份。' },
    { label: '登记捐赠授权', cash: 25, reputation: 1, group: 'union', relation: 1, description: '整理授权获得 25 信用点服务费。' },
  ]],
  ['cargo-detour', '货路绕行', '维修施工封住了近路，小批次机电货物短时稀缺。', 'electronics', 1.18, [
    { label: '提供绕行指引', cash: 0, reputation: 2, group: 'grayline', relation: 2, description: '货队记下这间愿意共享消息的小店。' },
    { label: '协助街坊预约', cash: 20, reputation: 1, group: 'neighborhood', relation: 1, description: '预约登记获得 20 信用点。' },
  ]],
  ['replica-wave', '纪念品复刻热', '廉价复刻徽章挤满了摊位，藏家更看重可靠出处。', 'antique', .88, [
    { label: '公开辨识记录', cash: 0, reputation: 2, group: 'union', relation: 2, description: '让真品与复刻品都获得清楚标注。' },
    { label: '向旧城居民求证', cash: -35, reputation: 3, group: 'neighborhood', relation: 2, description: '支付 35 信用点补贴走访，保留出处线索。' },
  ]],
  ['roof-harvest', '屋顶丰收', '种植箱收成不错，补给需求放缓，食堂邀请街坊分享新菜。', 'food', .9, [
    { label: '支援公共餐桌', cash: -40, reputation: 3, group: 'neighborhood', relation: 3, description: '支付 40 信用点，给晚归的人留一份饭。' },
    { label: '协助配送', cash: 35, reputation: 1, group: 'grayline', relation: 1, description: '协调配送获得 35 信用点。' },
  ]],
  ['signal-trouble', '联络网杂音', '街区呼叫网出现断续杂音；联合会开始寻找能负责整套修复的人。', 'electronics', 1.12, [
    { label: '保留故障记录', cash: 0, reputation: 2, group: 'union', relation: 3, description: '为未来联络中枢综合工单积累可复核记录。' },
    { label: '组织临时接力', cash: -50, reputation: 3, group: 'neighborhood', relation: 3, description: '支付 50 信用点支持临时联络。' },
  ]],
  ['open-street', '小店开放日', '街坊沿着巷道看店，展柜里的旧物比广告更容易留下印象。', 'antique', 1.15, [
    { label: '参与街区导览', cash: -45, reputation: 3, group: 'neighborhood', relation: 3, description: '支付 45 信用点制作巷道导览。' },
    { label: '交换工坊名录', cash: 0, reputation: 1, group: 'union', relation: 2, description: '把各自擅长的工序介绍给同行。' },
  ]],
];
export const EVENTS: EventDefinition[] = eventRows.map(([id, name, text, category, multiplier, choices]) => ({ id, name, text, category, multiplier, choices }));

export const QUESTS: QuestDefinition[] = [
  { id: 'neighborhood-line', name: '巷道里的声音', character: 'lin-qiao', stages: [
    { text: '林桥：先替三位街坊修好随身设备，让失联的日常重新接上。', requirement: 'repairs', count: 3, reward: 140, xp: 28 },
    { text: '林桥：累积十二次维修后，互助社愿意把更大的联络问题交给你。', requirement: 'repairs', count: 12, reward: 360, xp: 36 },
    { text: '联络中枢重新亮起，林桥把永久经营申请的邻里支持书放在柜台上。', requirement: 'final', count: 1, reward: 800, xp: 50 },
  ] },
  { id: 'workshop-trust', name: '工序单上的名字', character: 'he-jin', stages: [
    { text: '贺津：先用五次完整维修证明，每一张工序单都经得起复核。', requirement: 'repairs', count: 5, reward: 180, xp: 28 },
    { text: '取得第二张维修证书后，工造联合会把你的名字加入独立工坊名录。', requirement: 'certificate', count: 2, reward: 300, xp: 36 },
    { text: '形成一项大师能力，贺津送来刻有店名的工序铭牌。', requirement: 'master', count: 1, reward: 620, xp: 45 },
  ] },
  { id: 'archive-home', name: '把旧城带回家', character: 'wen-zhu', stages: [
    { text: '温竹：完成六笔交易，先摸清旧物在人们之间流转的路。', requirement: 'trades', count: 6, reward: 160, xp: 25 },
    { text: '将一件已鉴定的自有物品放入展柜，给它留下出处与位置。', requirement: 'display', count: 1, reward: 240, xp: 32 },
    { text: '让三件真实藏品同时展出。温竹把整理过的旧城故事留在店里。', requirement: 'display', count: 3, reward: 480, xp: 40 },
  ] },
  { id: 'clinic-promise', name: '每一次稳定读数', character: 'song-yi', stages: [
    { text: '宋宜：完成八次维修，先证明设备离开柜台以后仍然可靠。', requirement: 'repairs', count: 8, reward: 220, xp: 28 },
    { text: '取得三张维修证书，诊所便能正式委托精密器械。', requirement: 'certificate', count: 3, reward: 440, xp: 36 },
    { text: '累积二十四次完整维修。诊所的夜班清单上，终于有了固定的检修店。', requirement: 'repairs', count: 24, reward: 700, xp: 45 },
  ] },
];

export const THEMES: CollectionTheme[] = [
  { id: 'old-city-evening', name: '旧城的一个晚上', description: '听一首歌，看一场电影，最后别上回家的徽章。', items: ['music-tape', 'holo-film', 'old-city-badge'], bonus: 12 },
  { id: 'hands-at-work', name: '劳动的温度', description: '一只机械臂、一台传感器和一套电池，组成城市的日常。', items: ['servo-arm', 'industrial-sensor', 'battery-pack'], bonus: 14 },
  { id: 'slow-memory', name: '慢一点的记忆', description: '用机械计时，用胶片成像，用旧玩具陪伴成长。', items: ['mechanical-watch', 'film-camera', 'bionic-toy'], bonus: 18 },
];
