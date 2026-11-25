import type { DeliveryDefinition, RecipeDefinition } from '../game/types';

export const RECIPES: RecipeDefinition[] = [
  { id:'worklight', inputs:['alloy-plate','insulation-roll'], output:'folding-worklight', hours:1.5, fee:16 },
  { id:'sensor', inputs:['alloy-plate','data-chip'], output:'industrial-sensor', hours:2, fee:24 },
  { id:'circulator', inputs:['three-way-valve','insulation-roll'], output:'air-circulator', hours:2.5, fee:32 },
];

export const FABRICATION_MILESTONE = 'community-fabricator';
export const FABRICATION_COMMISSIONS: DeliveryDefinition[] = [
  {
    id:'fab-lockers', title:'夜班检修灯', characterId:'he-jin', category:'electronics', chapter:1,
    itemIds:['folding-worklight'], quantity:1, days:8, reward:600, xp:48, condition:74,
    functional:true, fabricated:'worklight',
    description:'公共工坊的值夜队缺一盏折叠灯，想要一件有你的工坊批次记录的新装灯具。',
    thanks:'灯扣装得很稳，折起来就能放进值守包。明早我把你介绍给管货梯的人。',
  },
  {
    id:'fab-lift', title:'货梯的第二道眼睛', characterId:'lu-che', category:'electronics', chapter:1,
    itemIds:['industrial-sensor'], quantity:1, days:9, reward:1320, xp:96, condition:82,
    functional:true, fabricated:'sensor',
    description:'旧货梯需要一枚信号稳定的新传感器。我们要把这批材料的工坊记录留给下一班检修员。',
    thanks:'货梯到站时终于能慢慢减速了。地下工坊等你来做最后一单。',
  },
  {
    id:'fab-vent', title:'地下工坊换气', characterId:'he-jin', category:'electronics', chapter:1,
    itemIds:['air-circulator'], quantity:2, days:11, reward:8600, xp:180, condition:94,
    functional:true, fabricated:'circulator',
    description:'给地下工坊的两条风道各做一台循环机。精装批次才能满足连续运行验收。',
    thanks:'地下两间工坊开门了。工造联合会已经签好你的经营权推荐。',
  },
];

export const FABRICATION_RESTOCK: DeliveryDefinition = {
  id:'fab-restock', title:'货运站传感器备件', characterId:'lu-che', category:'electronics', chapter:1,
  itemIds:['industrial-sensor'], quantity:2, days:9, reward:2520, xp:56, condition:80,
  functional:true, fabricated:'sensor',
  description:'货运站要两枚有工坊记录的传感器，用来替换下一批货梯的旧件。',
  thanks:'备件已入库。下一轮检修交接时会继续来找你。',
};
