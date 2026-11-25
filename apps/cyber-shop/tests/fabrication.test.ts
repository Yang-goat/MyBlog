import { describe, expect, it } from 'vitest';
import { FABRICATION_COMMISSIONS, FABRICATION_MILESTONE, FABRICATION_RESTOCK } from '../src/content/fabrication';
import { deliveryDefinition, deliverySourcePlan, fabricationProgress, nextFabricationCommission } from '../src/game/deliveries';
import { fabricationPlan, fabricationRecipe, materialInStock, materialReading } from '../src/game/fabrication';
import { applyAction, createGame, professionVictory, rootCapacity } from '../src/game/engine';
import { firstObjectPlace } from '../src/game/containers';
import { journey } from '../src/game/journey';
import { exportSave, importSave } from '../src/persistence/storage';
import type { FabricationMethod, GameState } from '../src/game/types';
import { act } from './helpers';

function start() {
  const focused = act(createGame(20261105),{type:'focusCareer',career:'fabricator'});
  expect(journey(focused).next.id).toBe('fabrication-scanner');
  return act(focused,{type:'buyEquipment',equipmentId:'scanner'});
}

function startCommission(state: GameState) {
  const offer=nextFabricationCommission(state)!;
  const request=deliveryDefinition(offer);
  let s=act(state,{type:'acceptDelivery',jobId:offer.id});
  const materials=deliverySourcePlan(s,s.deliveries!.find(job=>job.id===offer.id)!).materials!;
  if(materials.length){
    s=importSave(exportSave(act(s,{type:'sourceDelivery',jobId:offer.id})));
    expect(s.deliverySource?.materials).toEqual(materials);
    s=act(act(s,{type:'closeDay'}),{type:'openDay'});
    expect(journey(s).next.id).toBe('fabrication-supplier');
    s=act(s,{type:'callVisitor'});
    s=act(s,{type:'reject',visitorId:s.visitors[s.visitorIndex]!.id});
    s=act(s,{type:'callVisitor'});
    const seller=s.visitors[s.visitorIndex]!;
    const incoming=seller.goods!.slice(0,materials.length);
    expect(incoming.map(item=>item.definitionId)).toEqual(materials);
    const itemIds=incoming.map(item=>item.id);
    s=act(s,{type:'tradeBatch',visitorId:seller.id,itemIds});
    expect(journey(s).next.id).toBe('fabrication-store');
    for(const itemId of itemIds){
      const item=s.items.find(item=>item.id===itemId)!;
      s=act(s,{type:'moveStock',itemId,...firstObjectPlace(s,rootCapacity(s),item)!});
    }
  }
  return {state:s,offer,request};
}

function assemble(s:GameState,recipeId:string,method:FabricationMethod){
  const itemIds=fabricationRecipe(recipeId)!.inputs.map(id=>s.items.filter(item=>item.definitionId===id&&materialInStock(s,item))
    .sort((a,b)=>(materialReading(b)??-1)-(materialReading(a)??-1))[0]!.id);
  const plan=fabricationPlan(s,recipeId,method,itemIds,rootCapacity(s));
  expect(plan.ok).toBe(true);
  if(!('recipe' in plan))throw Error(plan.reason);
  const produced=act(s,{type:'fabricate',recipeId,method,itemIds});
  const output=produced.items.at(-1)!;
  expect(produced.items.every(item=>!itemIds.includes(item.id))).toBe(true);
  expect(output).toMatchObject({condition:plan.quality,location:'stock',cost:plan.materialCost+plan.fee,grid:plan.placement});
  expect(produced.cash).toBe(s.cash-plan.fee);
  expect(produced.hours).toBe(s.hours-plan.hours);
  return {state:produced,itemId:output.id};
}

function commission(s:GameState,method:FabricationMethod) {
  const batch=startCommission(s);
  const outputs:string[]=[];
  s=batch.state;
  for(let n=0;n<batch.request.quantity;n++){
    expect(journey(s).next.id).toBe('fabrication-work');
    const result=assemble(s,batch.request.fabricated!,method);
    s=result.state;
    outputs.push(result.itemId);
  }
  expect(journey(s).next).toMatchObject({id:'fabrication-deliver',jobId:batch.offer.id});
  const cash=s.cash;
  s=act(s,{type:'deliverGoods',jobId:batch.offer.id,itemIds:outputs});
  expect(s.cash).toBe(cash+batch.request.reward);
  expect(s.deliveries!.find(job=>job.id===batch.offer.id)?.goods).toEqual(
    outputs.map(itemId=>expect.objectContaining({itemId,fabricatedQuality:expect.any(Number)})),
  );
  return importSave(exportSave(s));
}

describe('fabricator career',()=>{
  it('manufactures, delivers and earns independent permanent ownership from a normal opening',()=>{
    let s=start();
    for(const [index,request] of FABRICATION_COMMISSIONS.entries()){
      expect(nextFabricationCommission(s)?.templateId).toBe(request.id);
      s=commission(s,index===0?'standard':'fine');
      expect(fabricationProgress(s)).toBe(index+1);
    }
    expect(s.professionMilestones).toEqual([FABRICATION_MILESTONE]);
    expect(professionVictory(s,'restorer').ready).toBe(false);
    expect(professionVictory(s,'energy-tech').ready).toBe(false);
    expect(nextFabricationCommission(s)?.templateId).toBe(FABRICATION_RESTOCK.id);
    for(let round=0;s.cash<12000&&round<10;round++)s=commission(s,'fine');
    expect(journey(s).next.id).toBe('fabrication-ownership');
    s=importSave(exportSave(act(s,{type:'buyShop'})));
    expect(s).toMatchObject({victory:true,victoryCareer:'fabricator',chapter:1,records:{repairs:0}});
    s=act(act(s,{type:'continueEndless'}),{type:'openDay'});
    expect(s.endless).toBe(true);
  });

  it('keeps reserved or unread inputs, rejects stock failures atomically and requires a real assembly record',()=>{
    const batch=startCommission(start());
    const s=batch.state,recipe=fabricationRecipe(batch.request.fabricated!)!;
    const materials=recipe.inputs.map(id=>s.items.find(item=>item.definitionId===id)!);
    const action={type:'fabricate' as const,recipeId:recipe.id,method:'standard' as const,itemIds:materials.map(i=>i.id)};
    const reserved=act(s,{type:'reserveItem',itemId:materials[0]!.id,reserved:true});
    expect(applyAction(reserved,action)).toMatchObject({ok:false,state:reserved});
    const unread=structuredClone(s);
    unread.items.find(item=>item.id===materials[0]!.id)!.known=['basic'];
    expect(applyAction(unread,action)).toMatchObject({ok:false,state:unread});
    expect(fabricationPlan(s,recipe.id,'standard',action.itemIds,1)).toMatchObject({ok:false,reason:expect.stringContaining('连续空位')});
    const made=assemble(s,recipe.id,'standard');
    const ordinary=structuredClone(made.state);
    delete ordinary.items.at(-1)!.fabrication;
    const handover={type:'deliverGoods' as const,jobId:batch.offer.id,itemIds:[made.itemId]};
    expect(applyAction(ordinary,handover)).toMatchObject({ok:false,state:ordinary});
    const forged=structuredClone(made.state);
    forged.items.at(-1)!.fabrication!.fee=0;
    expect(()=>exportSave(forged)).toThrow('装配成本');
    forged.professionMilestones=[FABRICATION_MILESTONE];
    expect(()=>exportSave({...s,professionMilestones:forged.professionMilestones})).toThrow('职业里程碑');
  });
});
