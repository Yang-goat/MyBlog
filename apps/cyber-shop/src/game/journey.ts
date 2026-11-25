import type { DeliveryJob, GameState } from './types';
import { BALANCE } from './balance';
import { CERTIFICATES, EQUIPMENT, ITEMS, QUESTS, SKILLS } from '../content';
import { ENERGY_COMMISSIONS } from '../content/deliveries';
import { FABRICATION_COMMISSIONS } from '../content/fabrication';
import { isMaster, professionVictory, questProgress, operatingFees, debtClosingChances } from './engine';
import { itemAccessible } from './containers';
import { canPrepareForCommission, deliveryDefinition, deliveryItemCheck, deliveryReadyCount, deliverySourcePlan, DELIVERY_HOURS, energyCommissionProgress, fabricationProgress, nextEnergyCommission, nextFabricationCommission } from './deliveries';
import { energyPlan, ENERGY_PROFILES } from './energy';
import { fabricationQuality, fabricationRecipe, materialInStock, materialReading } from './fabrication';

export const CHAPTERS = [
  { title: '重新开门', story: '林桥把钥匙留给了你。让第一批旧物重新运转，也让这条街记住店门里的灯。', target: 5 },
  { title: '街区口碑', story: '街坊开始介绍新的客人。取得工业维修资质，把小修理铺变成靠得住的工坊。', target: 14 },
  { title: '高价与代价', story: '精密设备背后，是更重要的托付。学习神经器件维修，准备接手街区的联络中枢。', target: 28 },
  { title: '自己的招牌', story: '停摆的联络中枢还有三个模块需要修复。等信号再次亮起，就把这间店写进自己的未来。', target: 28 },
] as const;
export interface JourneyTask { id: string; title: string; detail: string; current: number; target: number; done: boolean; panel: string; label: string; jobId?:string; itemId?:string }
const task=(id:string,title:string,detail:string,current:number,target:number,panel:string,label:string):JourneyTask=>({id,title,detail,current,target,done:current>=target,panel,label});
const ownershipTask=(s:GameState,id:string)=>({...task(id,'买下永久经营权',
  `带经营权推荐到街区手记办理，收购款 ₡${BALANCE.shopPrice.toLocaleString()}。`,
  s.victory?BALANCE.shopPrice:Math.max(0,s.cash-s.debt),BALANCE.shopPrice,'journal','办理经营权'),done:s.victory});

function energyGoal(s:GameState, job:DeliveryJob):JourneyTask {
  const request=deliveryDefinition(job);
  const stock=s.items.filter(item=>item.owner==='player'&&request.itemIds.includes(item.definitionId)&&!item.reserved);
  const ready=stock.filter(item=>deliveryItemCheck(s,request,item).ready).length;
  const step=(id:string,title:string,detail:string,panel:string,label:string):JourneyTask=>({
    ...task(id,title,detail,ready,request.quantity,panel,label),done:false,
  });
  const letter=(id:string,title:string,detail:string,label='查看委托'):JourneyTask=>({
    ...step(id,title,detail,'deliveries',label),jobId:job.id,
  });
  const close=(detail:string)=>step('energy-close','核对日结',detail,'close-day','查看闭店确认');
  if (job.status==='offered') return letter('energy-accept',request.title,request.description,'查看能源委托');
  if (ready>=request.quantity) return s.hours>=DELIVERY_HOURS
    ?letter('energy-deliver','货品可交付',`「${request.title}」的货已经备齐，须在第 ${job.deadline} 日闭店前交货。`,'去交货')
    :close('今天的交货工时已用完。请核对这份委托的交期。');
  if (stock.some(item=>item.location==='counter')) return step('energy-store','先把来货入库','刚买下的货在谈判台，入库后才能整备。','','返回店铺');
  const supplier=s.visitors.slice(s.visitorIndex).find(visitor=>!visitor.resolved&&visitor.sourceDeliveryId===job.id
    &&visitor.goods?.some(item=>request.itemIds.includes(item.definitionId)&&item.known.includes('serial')));
  if (supplier) return step('energy-supplier','接待找货商人','商人今天带来了指定型号。叫号后查看来货和实际报价。','','返回柜台');
  if (s.energyWork) return step('energy-resume',s.energyWork.verified?'把成品收回货架':'复核已装夹货物',
    s.energyWork.verified?'腾出连续仓位，再把工位上的货收回。':'按铭牌选择负载和读数，完成这件货的复核。','energy','返回能源工位');
  const candidates=stock.filter(item=>canPrepareForCommission(s,request,item)).map(item=>{
    const plans=ENERGY_PROFILES.map(profile=>energyPlan(s,item,profile.id))
      .filter(plan=>plan.delta>0&&plan.target!==null&&plan.target>=(request.capacity??100));
    return {item,plans};
  });
  const actionable=candidates.find(candidate=>candidate.plans.some(plan=>plan.ok));
  if (actionable) {
    return {
      ...step('energy-prepare','整备货架上的旧货',`选择可达到 ${request.capacity}% 的方案，复核后把货收回。`,'energy','去整备'),
      itemId:actionable.item.id,
    };
  }
  const blocked=candidates[0];
  if (blocked) {
    const {item,plans}=blocked;
    if (plans.some(plan=>plan.profile?.tool&&!s.equipment[plan.profile.tool])) {
      return step('energy-tool','添置精密校准台','这份委托要求更高容量，精密整备需要这件工具。','equipment','查看工具采购');
    }
    if (plans.length&&plans.every(plan=>s.hours<plan.hours)) return close('今天的整备工时不足。请核对交期，明天继续。');
    return {...step('energy-prepare','核对整备投入',plans[0]?.reason??'比较可用的整备方案。','energy','查看整备方案'),itemId:item.id};
  }
  const unchecked=stock.find(item=>deliveryItemCheck(s,request,item).inspect&&itemAccessible(s,item));
  if (unchecked) return {...step('energy-inspect','检查已有货品','先核对已有旧货的品相、功能和容量。','inventory','查看待检货品'),itemId:unchecked.id};
  if (s.deliverySource?.jobId===job.id) return close('已经约好次日来货。核对租金与其余待办，再结束营业。');
  return letter('energy-source','给委托备货',`核对「${request.title}」的型号与交期，再请商人找货或从来货中挑选。`,'查看备货方式');
}

function energyRoute(s: GameState){
  const progress=energyCommissionProgress(s);
  const title=ENERGY_COMMISSIONS[progress]?.title??'自己的招牌';
  const story=ENERGY_COMMISSIONS[progress]?.description??'微电网稳定运行。街坊已经为你签好经营权推荐。';
  const ownership=ownershipTask(s,'energy-ownership');
  const job=nextEnergyCommission(s);
  let next:JourneyTask;
  if (s.victory || (professionVictory(s,'energy-tech').ready&&ownership.current>=ownership.target)) next=ownership;
  else if (s.phase==='closed') next=task('energy-open','打开今天的店门','恢复工时后继续委托。',0,1,'day-report','迎接下一营业日');
  else if (!s.equipment.scanner) next=task('energy-scanner','准备多谱扫描仪','用它检查旧货的容量，也用它在能源工位进行整备。',0,1,'equipment','查看工具采购');
  else if (job) next=energyGoal(s,job);
  else next=task('energy-next-day','等待下一份委托','今天的这份来信已结算。可以趁还有工时继续营业。',0,1,'close-day','查看闭店确认');
  return {title,story,tasks:[next,...(next===ownership||progress<ENERGY_COMMISSIONS.length?[]:[ownership])]};
}

function fabricationGoal(s:GameState, job:DeliveryJob):JourneyTask {
  const request=deliveryDefinition(job);
  const recipe=fabricationRecipe(request.fabricated!)!;
  const ready=deliveryReadyCount(s,job);
  const step=(id:string,title:string,detail:string,panel:string,label:string)=>({
    ...task(id,title,detail,ready,request.quantity,panel,label),done:false,
    ...(panel==='deliveries'?{jobId:job.id}:{}),
  });
  if(job.status==='offered')return step('fabrication-accept',request.title,request.description,'deliveries','查看工匠委托');
  if(ready>=request.quantity)return s.hours>=DELIVERY_HOURS
    ? step('fabrication-deliver','成品可以交付',`第 ${job.deadline} 日闭店前交货。`,'deliveries','去交货')
    : step('fabrication-close','核对日结','今天的交货工时已用完。请先核对交期。','close-day','查看闭店确认');
  const missing=deliverySourcePlan(s,job).materials??[];
  const counter=s.items.some(item=>item.owner==='player'&&item.location==='counter'&&recipe.inputs.includes(item.definitionId));
  if(counter)return step('fabrication-store','先将原料入库','入库后可以在合成工位选用。','','返回店铺');
  const supplier=s.visitors.slice(s.visitorIndex).some(visitor=>!visitor.resolved&&visitor.sourceDeliveryId===job.id
    &&visitor.goods?.some(item=>recipe.inputs.includes(item.definitionId)&&item.known.includes('serial')));
  if(missing.length&&supplier)return step('fabrication-supplier','接待找货商人','今日首位卖家带来已核对的原料。','','返回柜台');
  const canAssemble=recipe.inputs.every(id=>s.items.some(item=>{
    if(item.definitionId!==id||!materialInStock(s,item))return false;
    const reading=materialReading(item);
    return reading!==null&&fabricationQuality(reading,'fine')>=request.condition;
  }));
  if(canAssemble)return step('fabrication-work','选料并装配',`这份订单要求 ${request.condition}% 品相。先比较原料、装配费用与工时。`,'fabrication','打开合成工位');
  const unknown=s.items.some(item=>recipe.inputs.includes(item.definitionId)&&materialInStock(s,item)&&materialReading(item)===null);
  if(unknown)return step('fabrication-work','核对原料读数','工位可以检查现有原料的品相和纯度。','fabrication','检查原料');
  if(s.deliverySource?.jobId===job.id)return step('fabrication-close','等待明日原料','询货已经约好。可继续营业，闭店后记得接待首位卖家。','close-day','查看闭店确认');
  return step('fabrication-source','补齐配方原料','可以从来客手中买入，也可按当前缺口询货。','deliveries','查看备料方式');
}

function fabricationRoute(s:GameState){
  const progress=fabricationProgress(s);
  const stage=FABRICATION_COMMISSIONS[progress];
  const ownership=ownershipTask(s,'fabrication-ownership');
  const job=nextFabricationCommission(s);
  let next:JourneyTask;
  if(s.victory || (professionVictory(s,'fabricator').ready&&ownership.current>=ownership.target)) next=ownership;
  else if(s.phase==='closed')next=task('fabrication-open','迎接下一营业日','恢复工时后可以继续备料和加工。',0,1,'day-report','查看日结');
  else if(!s.equipment.scanner)next=task('fabrication-scanner','准备多谱扫描仪','它可以核对合金、绝缘纤维等原料的读数。',0,1,'equipment','查看工具采购');
  else if(job)next=fabricationGoal(s,job);
  else next=task('fabrication-next-day','等待下一份来信','今日这份委托已经结算，可以继续接待来客。',0,1,'close-day','查看闭店确认');
  return {title:stage?.title??'自己的招牌',story:stage?.description??'工造联合会已签发经营权推荐。',tasks:[next,...(next===ownership||stage?[]:[ownership])]};
}
export function financialRecovery(s:GameState){
 const fees=operatingFees(s),due=fees+s.debt,closingChances=debtClosingChances(s);
 const deadline=closingChances===null?null:s.day+(s.phase==='closed'?1:0)+Math.max(0,closingChances-1);
 return {fees,due,shortfall:Math.max(0,due-s.cash),closingChances,deadline};
}
export function journey(s: GameState) {
  const focus=s.careerFocus??'restorer';
  const specialty=s.endless?undefined:focus==='energy-tech'?energyRoute(s):focus==='fabricator'?fabricationRoute(s):undefined;
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
  if(specialty)tasks=specialty.tasks;
  if(s.debt>0&&s.phase!=='failed'){
    const recovery=financialRecovery(s),secured=recovery.shortfall===0,closed=s.phase==='closed';
    const detail=`下次日结需 ₡${recovery.due}，含欠费 ₡${s.debt} 与当日费用 ₡${recovery.fees}。${recovery.deadline===null?'永久经营权保留，赚够后可在日结补齐。':`请在第 ${recovery.deadline} 日闭店前备足费用。`}基础援助维修可零现金接单。`;
    tasks.unshift({...task('rescue',secured?'日结补缴欠费':'先补齐经营费用',detail,Math.min(s.cash,recovery.due),recovery.due,closed?'day-report':secured?'close-day':'orders',closed?'迎接下一营业日':secured?'核对费用并日结':'接基础援助维修'),done:false});
  }
  const ready=QUESTS.filter(q=>questProgress(s,q.id).ready).map(q=>({id:q.id,name:q.name,reward:q.stages[s.questStages[q.id]??0]!.reward}));
  const active=s.orders.filter(o=>!o.delivered);
  const investment=SKILLS.filter(k=>k.tree==='repair'&&s.skills.includes(k.id)).reduce((sum,k)=>sum+k.cost,0);
  return { focus, title:s.endless?'长明的店灯':specialty?.title??CHAPTERS[s.chapter-1]?.title??CHAPTERS[0].title, story:s.endless?'招牌已经属于你。继续修复、收藏，或者接一份自己喜欢的街区挑战。':specialty?.story??CHAPTERS[s.chapter-1]?.story??CHAPTERS[0].story, tasks, next:tasks.find(t=>!t.done)??tasks[tasks.length-1]!, ready, activeOrders:active.length, investment, nextLevelXp:s.level*BALANCE.xpPerLevel-s.xp };
}
export function stockTurnover(s:GameState){
 const goods=s.items.filter(i=>i.owner==='player'&&i.location!=='display');
 return {count:goods.length,cost:goods.reduce((sum,i)=>sum+i.cost,0),aged:goods.filter(i=>s.day-i.acquiredDay>=3).length};
}
/** Cash movement, not profit: purchases remain inventory and escrow is not free cash. */
export function dayReport(s:GameState) {
  const entries=s.ledger.filter(e=>e.day===s.day);
  const income=entries.filter(e=>e.amount>0).reduce((n,e)=>n+e.amount,0);
  const expenses=entries.filter(e=>e.amount<0).reduce((n,e)=>n-e.amount,0);
  const repairs=entries.filter(e=>e.kind==='repair-income');
  const sales=entries.filter(e=>e.kind==='sale'||e.kind==='clearance');
  const deliveries=entries.filter(e=>e.kind==='delivery');
  const fees=entries.filter(e=>e.kind==='daily-fee').reduce((n,e)=>n-e.amount,0);
  const pendingFees=s.phase==='open'?operatingFees(s)+s.debt:0;
  return {stock:stockTurnover(s),income,expenses,net:income-expenses,openingCash:s.cash-income+expenses,closingCash:s.cash,repairs:repairs.length,repairIncome:repairs.reduce((n,e)=>n+e.amount,0),sales:sales.length,saleIncome:sales.reduce((n,e)=>n+e.amount,0),deliveries:deliveries.length,deliveryIncome:deliveries.reduce((n,e)=>n+e.amount,0),fees,pendingFees,entries};
}
