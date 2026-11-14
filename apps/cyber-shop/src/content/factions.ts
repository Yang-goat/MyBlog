import type {CategoryId} from '../game/types';
export type FactionId='neighborhood'|'union'|'grayline'|'uppercity'|'contractors'|'watch'|'freewave';
export interface FactionDefinition {id:FactionId;name:string;shortName:string;stratum:string;color:string;contact:string;categories:CategoryId[];seller:number;buyer:number;budget:number;description:string;tradeNote:string;perk:string}
export const FACTIONS:FactionDefinition[]=[
 {id:'neighborhood',name:'九街互助社',shortName:'街坊',stratum:'下层居民',color:'#b7cb8b',contact:'lin-qiao',categories:['food','electronics'],seller:1,buyer:1,budget:1,description:'快递员、食堂、诊所和住户凑成的互助网络。旧设备每天都要继续工作。',tradeNote:'日常补给与实用旧物',perk:'信任 16：每日维护费减 ₡10。'},
 {id:'union',name:'工造联合会',shortName:'工造',stratum:'工人和独立工坊',color:'#dfae70',contact:'he-jin',categories:['electronics','energy'],seller:1,buyer:1,budget:1.2,description:'靠工序、批次和交付记录建立信用的工坊联盟。',tradeNote:'工业器材与材料，预算较充足',perk:'信任 16：工具商店耗材九折，可叠加技能优惠。'},
 {id:'grayline',name:'灰线黑市',shortName:'灰线',stratum:'地下货运网络',color:'#b99cda',contact:'qi-lan',categories:['energy','electronics','data'],seller:.9,buyer:.95,budget:1,description:'绕开正规货路的旧货商。价格低，磨损和缺失的批次凭据需要店主自己判断。',tradeNote:'进货便宜，成色较低、部分批次不全',perk:'信任 16：灰线卖家的箱包价格再减 15%。'},
 {id:'uppercity',name:'云阶采购圈',shortName:'云阶',stratum:'上层企业与私人买家',color:'#c6d7ee',contact:'ji-yan',categories:['data','antique','neural'],seller:1.12,buyer:1.1,budget:1.6,description:'从高层办公区下来的采购人。预算宽裕，重视可直接使用的高品相货物。',tradeNote:'完好且品相 ≥85 的货物另加价 15%',perk:'信任 16：云阶买家的完好高品相加价由 15% 升至 20%。'},
 {id:'contractors',name:'铁隼合约团',shortName:'铁隼',stratum:'独立佣兵',color:'#d18b84',contact:'han-qiao',categories:['electronics','energy','neural'],seller:.96,buyer:1.04,budget:1.15,description:'按合同工作的护送员和外勤佣兵。装备要能用，外壳上的伤痕可以留下。',tradeNote:'无功能故障的设备另加价 8%',perk:'信任 16：铁隼客户新接维修工单报酬增加 15%。'},
 {id:'watch',name:'九区巡务署',shortName:'巡务',stratum:'辖区警务',color:'#8fbcdf',contact:'xu-zheng',categories:['electronics','data','neural'],seller:1,buyer:1,budget:1.1,description:'负责街区秩序和流转登记的警务部门。可查验的来源比口头保证更有效。',tradeNote:'已核验且可追溯的货物另加价 10%',perk:'信任 16：通用交易许可费用减 25%。'},
 {id:'freewave',name:'自由频段',shortName:'频段',stratum:'地下反抗组织',color:'#78c9bd',contact:'yan-que',categories:['data','energy','electronics'],seller:.96,buyer:1,budget:.9,description:'用地下电台连接各个下层街区，反对上层企业垄断通信。成员靠回收器材维持广播。',tradeNote:'数据载体与能源材料另加价 8%',perk:'信任 16：数据货物的来源核验免工时，仍需序列检索终端。'},
];
export const faction=(id:string)=>FACTIONS.find(f=>f.id===id);
