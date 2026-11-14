import {describe,it,expect} from 'vitest';
import {createGame,applyAction,preservationPlan,nextOpeningExpiry} from '../src/game/engine';
import {foodFreshness,foodOverview} from '../src/game/freshness';
import {act,starterItem} from './helpers';

describe('food decisions use known dates and actual preservation costs',()=>{
 it('does not reveal an unchecked date through forecasts or preservation rejection',()=>{
  const s=createGame(42),food=starterItem(s,'food');food.known=[];food.expiresDay=s.day-1;
  const unknown=foodOverview(s);expect(unknown).toEqual({unknown:1,expired:0,expiresOvernight:0,cooled:0});
  expect(foodFreshness(s,food)).toEqual({status:'unknown',text:'日期待检查'});
  expect(preservationPlan(s,food)).toMatchObject({ok:false,expiresDay:null,reason:'先检查食品日期。'});
  const before=structuredClone(s),r=applyAction(s,{type:'preserve',itemId:food.id});expect(r.ok).toBe(false);expect(r.state).toEqual(before);
  food.expiresDay=s.day+20;s.equipment['cold-storage']=1;expect(foodOverview(s)).toEqual(unknown);
 });
 it('previews the exact acquired pack cost and skill benefit once, including nested food',()=>{
  let s=createGame(42);s.skills=['business-1','business-2','business-3'];s.equipment['preserve-pack']=0;
  s=act(s,{type:'buyEquipment',equipmentId:'preserve-pack',count:5});const food=starterItem(s,'food');
  s.containers=[{id:'food-bag',styleId:'courier-pack',label:'食材',owner:'player',color:'ivory',cost:300,acquiredDay:1,location:'stock'}];food.containerId='food-bag';
  const plan=preservationPlan(s,food),before=structuredClone(s);expect(plan.ok).toBe(true);expect(plan.days).toBe(4);
  expect(plan.materialCost).toBe(Math.floor(s.equipmentCosts['preserve-pack']!/5));
  const result=act(s,{type:'preserve',itemId:food.id}),after=result.items.find(i=>i.id===food.id)!;
  expect(after.expiresDay).toBe(plan.expiresDay);expect(after.cost-food.cost).toBe(plan.materialCost);expect(result.cash).toBe(before.cash);expect(result.hours).toBe(before.hours);
  expect(result.equipment['preserve-pack']).toBe(plan.stock-1);expect(result.equipmentCosts['preserve-pack']).toBe(before.equipmentCosts['preserve-pack']!-plan.materialCost);
  const again=applyAction(result,{type:'preserve',itemId:food.id});expect(again.ok).toBe(false);expect(again.state).toEqual(result);
 });
 it('predicts the same next-opening expiry as the real day transition',()=>{
  for(const day of [1,2,3,4])for(const cold of [0,1])for(const offset of [-1,0,1,5]){
   let s=createGame(42);s.day=day;s.equipment['cold-storage']=cold;const food=starterItem(s,'food');food.expiresDay=day+offset;
   const expiry=nextOpeningExpiry(s,food),forecast=foodOverview(s),before=structuredClone(s);
   expect(forecast.expiresOvernight).toBe(Number(offset>=0&&expiry!<day+1));expect(forecast.expired).toBe(Number(offset<0));expect(s).toEqual(before);
   s=act(act(s,{type:'closeDay'}),{type:'openDay'});expect(starterItem(s,'food').expiresDay).toBe(expiry);
   if(offset<0)expect(expiry).toBe(day+offset);
  }
 });
 it('counts food in bags and displays, excluding customers and nonfood',()=>{
  const s=createGame(42),food=starterItem(s,'food');food.expiresDay=s.day;food.containerId='inner';
  s.items.push({...food,id:'display-food',location:'display'},{...food,id:'customer-food',owner:'customer'});
  expect(foodOverview(s)).toEqual({unknown:0,expired:0,expiresOvernight:2,cooled:0});
  s.equipment['cold-storage']=1;expect(foodOverview(s)).toEqual({unknown:0,expired:0,expiresOvernight:0,cooled:2});
 });
 it('distinguishes today, tomorrow and expired food, and rejects unavailable preservation',()=>{
  const s=createGame(42),food=starterItem(s,'food');
  for(const [offset,text] of [[-1,'已过期'],[0,'今日到期'],[1,'明日到期']] as const){food.expiresDay=s.day+offset;expect(foodFreshness(s,food)?.text).toBe(text);}
  food.expiresDay=s.day-1;expect(preservationPlan(s,food).reason).toContain('已经过期');
  food.expiresDay=s.day;s.equipment['preserve-pack']=0;expect(preservationPlan(s,food).reason).toBe('没有保鲜包。');
  s.phase='closed';expect(preservationPlan(s,food).reason).toContain('开店后');
  expect(foodFreshness(s,starterItem(s,'data'))).toBe(null);
 });
});
