import type { GameState } from './types';
import { BALANCE } from './balance';
import { CERTIFICATES, EQUIPMENT, ITEMS, QUESTS, SKILLS } from '../content';
import { isMaster, questProgress } from './engine';

export const CHAPTERS = [
  { title: '重新开门', story: '林桥把钥匙留给了你。让第一批旧物重新运转，也让这条街记住店门里的灯。', target: 5 },
  { title: '街区口碑', story: '街坊开始介绍新的客人。取得工业维修资质，把小修理铺变成靠得住的工坊。', target: 14 },
  { title: '高价与代价', story: '精密设备背后，是更重要的托付。学习神经器件维修，准备接手街区的联络中枢。', target: 28 },
  { title: '自己的招牌', story: '停摆的联络中枢还有三个模块需要修复。等信号再次亮起，就把这间店写进自己的未来。', target: 28 },
] as const;
export interface JourneyTask { id: string; title: string; detail: string; current: number; target: number; done: boolean; panel: string; label: string }
export function journey(s: GameState) {
  const task=(id:string,title:string,detail:string,current:number,target:number,panel:string,label:string):JourneyTask=>({id,title,detail,current,target,done:current>=target,panel,label});
  const cert=(id:'industrial'|'neural'|'antique')=>{
    const c=CERTIFICATES.find(c=>c.id===id)!;
    const tools=c.tools.map(id=>EQUIPMENT.find(e=>e.id===id)?.name??id).join('、');
    const certified=s.certificates.includes(id);
    return task(id,c.name,certified?`已取得资质，可承接对应设备。考核工具已配发：${tools}。`:`${s.trained.includes(id)?'培训完成，接下来参加实际考核':'培训费 ₡'+c.fee}；通过后获配：${tools}。`,Number(certified),1,'growth','查看资质与考核');
  };
  const repairs=task('repairs','让旧物重新运转','完成客户维修可赚取工钱和经验。工作台也有随时可接的基础援助维修。',s.records.repairs,CHAPTERS[s.chapter-1]?.target??28,'orders','前往维修工作台');
  let tasks:JourneyTask[]=[repairs];
  if(s.chapter===2)tasks=[cert('industrial'),repairs];
  if(s.chapter===3)tasks=[cert('neural'),repairs];
  if(s.chapter>=4)tasks=[
    task('master','成为维修大师','维修树先投入 6 点，再用 2 点学习任一分支的大师能力。',Number(isMaster(s)),1,'growth','查看修复师专精'),
    task('final','重启街区联络中枢','依次修复机电传动、供能和神经接口。三个阶段分别结算。',s.finalStage,3,'journal','接取中枢委托'),
    task('ownership','买下永久经营权',`收购款 ₡${BALANCE.shopPrice.toLocaleString()}${s.debt?'，另需结清欠费 ₡'+s.debt:''}。成为大师并完成中枢委托后可办理。`,s.victory?BALANCE.shopPrice:Math.max(0,s.cash-s.debt),BALANCE.shopPrice,'journal','办理经营权'),
  ];
  if(s.endless){
    tasks=[cert('antique'),
      task('display','给旧物留一盏灯','查验来源后，把三件自有真品放进展示柜。展品保留在店内，持续增加吸引力。',s.items.filter(i=>i.owner==='player'&&i.location==='display').length,3,'collection','整理收藏展示柜'),
      task('catalogue','补全旧物图鉴','不同街坊会带来不同的旧物。买入新型号就会记入图鉴，不需要一直持有。',s.discovered.length,ITEMS.length,'collection','翻开旧物图鉴'),
      task('skills','磨练自己的全部手艺','经验继续积累。主线之外，可以慢慢补齐交易、陈列和其他维修方向。',s.skills.length,SKILLS.length,'growth','查看成长与技能'),
    ];
    if(s.challenge)tasks.unshift(task('challenge','完成当前街区挑战',`截止第 ${s.challenge.deadline} 日；完成后在闭店时领取 ₡${s.challenge.reward}。`,s.challenge.progress,s.challenge.goal,'journal','查看挑战进度'));
  }
  const ready=QUESTS.filter(q=>questProgress(s,q.id).ready).map(q=>({id:q.id,name:q.name,reward:q.stages[s.questStages[q.id]??0]!.reward}));
  const active=s.orders.filter(o=>!o.delivered);
  const investment=SKILLS.filter(k=>k.tree==='repair'&&s.skills.includes(k.id)).reduce((sum,k)=>sum+k.cost,0);
  return { title:s.endless?'长明的店灯':CHAPTERS[s.chapter-1]?.title??CHAPTERS[0].title, story:s.endless?'招牌已经属于你。继续修复、收藏，或者接一份自己喜欢的街区挑战。':CHAPTERS[s.chapter-1]?.story??CHAPTERS[0].story, tasks, next:tasks.find(t=>!t.done)??tasks[tasks.length-1]!, ready, activeOrders:active.length, investment, nextLevelXp:s.level*BALANCE.xpPerLevel-s.xp };
}
/** Cash movement, not profit: purchases remain inventory and escrow is not free cash. */
export function dayReport(s:GameState) {
  const entries=s.ledger.filter(e=>e.day===s.day);
  const income=entries.filter(e=>e.amount>0).reduce((n,e)=>n+e.amount,0);
  const expenses=entries.filter(e=>e.amount<0).reduce((n,e)=>n-e.amount,0);
  const repairs=entries.filter(e=>e.kind==='repair-income');
  const sales=entries.filter(e=>e.kind==='sale'||e.kind==='clearance');
  const fees=entries.filter(e=>e.kind==='daily-fee').reduce((n,e)=>n-e.amount,0);
  const pendingFees=s.phase==='open'?BALANCE.maintenance+(s.victory?0:BALANCE.rent)+s.debt:0;
  return {income,expenses,net:income-expenses,openingCash:s.cash-income+expenses,closingCash:s.cash,repairs:repairs.length,repairIncome:repairs.reduce((n,e)=>n+e.amount,0),sales:sales.length,saleIncome:sales.reduce((n,e)=>n+e.amount,0),fees,pendingFees,entries};
}
