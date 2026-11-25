import { describe, expect, it } from 'vitest';
import { ENERGY_COMMISSIONS, GRID_MAINTENANCE, GRID_MILESTONE } from '../src/content/deliveries';
import { deliveryDefinition, deliveryItemCheck, deliverySourcePlan, energyCommissionProgress, nextEnergyCommission } from '../src/game/deliveries';
import { energyTest, energyTolerance } from '../src/game/energy';
import { applyAction, createGame, professionVictory, rootCapacity } from '../src/game/engine';
import { firstObjectPlace } from '../src/game/containers';
import { journey } from '../src/game/journey';
import { exportSave, importSave } from '../src/persistence/storage';
import type { EnergyProfileId, GameState } from '../src/game/types';
import { act } from './helpers';

function advance(state: GameState) {
  return act(act(state, { type: 'closeDay' }), { type: 'openDay' });
}

function commission(state: GameState, profileId: EnergyProfileId) {
  const offer = nextEnergyCommission(state)!;
  const request = deliveryDefinition(offer);
  expect(journey(state).next).toMatchObject({id:'energy-accept',jobId:offer.id});
  let s = act(state, { type: 'acceptDelivery', jobId: offer.id });
  expect(journey(s).next).toMatchObject({id:'energy-source',jobId:offer.id});
  s = act(s, { type: 'sourceDelivery', jobId: offer.id });
  s = importSave(exportSave(s));
  expect(journey(s).next).toMatchObject({id:'energy-close',panel:'close-day'});
  s = importSave(exportSave(advance(s)));
  expect(journey(s).next).toMatchObject({id:'energy-supplier',panel:''});
  s = act(s, { type: 'callVisitor' });
  s = act(s, { type: 'reject', visitorId: s.visitors[s.visitorIndex]!.id });
  s = act(s, { type: 'callVisitor' });
  const ids = s.visitors[s.visitorIndex]!.goods!.slice(0, request.quantity).map(item => item.id);
  expect(s.visitors[s.visitorIndex]!.goods!.slice(0, request.quantity).map(item => item.capacity)).toEqual(
    Array(request.quantity).fill(request.capacity! - 15),
  );
  s = act(s, { type: 'tradeBatch', visitorId: s.visitors[s.visitorIndex]!.id, itemIds: ids });
  expect(journey(s).next.id).toBe('energy-store');
  for (const itemId of ids) {
    const raw = s.items.find(item => item.id === itemId)!;
    s = act(s, { type: 'moveStock', itemId, ...firstObjectPlace(s, rootCapacity(s), raw)! });
  }
  for (const itemId of ids) {
    const raw = s.items.find(item => item.id === itemId)!;
    expect(journey(s).next).toMatchObject({id:'energy-prepare',itemId,panel:'energy'});
    expect(deliveryItemCheck(s, request, s.items.find(item => item.id === itemId)!).ready).toBe(false);
    expect(applyAction(s, { type: 'deliverGoods', itemIds: ids, jobId: offer.id }).ok).toBe(false);
    if (request.id === 'grid-relay' && itemId === ids[0]) {
      const active = s.deliveries!.find(job => job.id === offer.id)!;
      expect(deliverySourcePlan(s, active).count).toBe(0);
      const wrongProfile = act(s, { type: 'startEnergy', itemId, profileId: 'balanced' });
      expect(deliverySourcePlan(wrongProfile, active).count).toBe(1);
    }
    s = act(s, { type: 'startEnergy', itemId, profileId });
    expect(journey(s).next).toMatchObject({id:'energy-resume',panel:'energy'});
    const { load, value } = energyTest(raw)!;
    s = act(s, { type: 'verifyEnergy', load, value: value + energyTolerance(s) });
    s = act(s, { type: 'finishEnergy' });
  }
  expect(journey(s).next).toMatchObject({id:'energy-deliver',jobId:offer.id,current:request.quantity,done:false});
  const cash = s.cash;
  s = act(s, { type: 'deliverGoods', jobId: offer.id, itemIds: ids });
  expect(s.cash).toBe(cash + request.reward);
  expect(s.items.some(item => ids.includes(item.id))).toBe(false);
  expect(applyAction(s, { type: 'deliverGoods', jobId: offer.id, itemIds: ids }).ok).toBe(false);
  return importSave(exportSave(s));
}

describe('energy technician career', () => {
  it('earns the shop through ordinary purchases, commissioned preparation and repeat service without repair mastery', () => {
    let s = act(createGame(20261105),{type:'focusCareer',career:'energy-tech'});
    expect(nextEnergyCommission(s)?.templateId).toBe(ENERGY_COMMISSIONS[0]!.id);
    s = act(s, { type: 'buyEquipment', equipmentId: 'scanner' });
    s = commission(s, 'economy');
    expect(energyTolerance(s)).toBe(2);
    s = commission(s, 'balanced');
    expect(energyTolerance(s)).toBe(4);
    expect(professionVictory(s, 'energy-tech')).toMatchObject({ mastered: true, ready: false });
    s = act(s, { type: 'buyEquipment', equipmentId: 'calibrator' });
    s = commission(s, 'precision');
    expect(professionVictory(s, 'energy-tech').ready).toBe(true);
    expect(professionVictory(s, 'restorer').ready).toBe(false);
    expect(s.professionMilestones).toEqual([GRID_MILESTONE]);
    expect(s.chapter).toBe(1);
    expect(s.records.repairs).toBe(0);
    expect(nextEnergyCommission(s)?.templateId).toBe(GRID_MAINTENANCE.id);
    for (let count = 0; s.cash < 12000 && count < 12; count++) {
      if ((s.equipment.insulation ?? 0) < 2) s = act(s, { type: 'buyEquipment', equipmentId: 'insulation', count: 2 });
      s = commission(s, 'balanced');
    }
    expect(journey(s).next).toMatchObject({id:'energy-ownership',done:false});
    s = act(s, { type: 'buyShop' });
    expect(s.victory).toBe(true);
    expect(s.records.repairs).toBe(0);
    expect(journey(s).next).toMatchObject({id:'energy-ownership',done:true});
    expect(energyCommissionProgress(importSave(exportSave(s)))).toBe(3);
    s = act(s, { type: 'continueEndless' });
    s = act(s, { type: 'openDay' });
    for (let day = 0; day < 45; day++) {
      const next = nextEnergyCommission(s);
      if (next?.status === 'offered') {
        s = act(s, { type: 'acceptDelivery', jobId: next.id });
        s = act(s, { type: 'cancelDelivery', jobId: next.id });
      }
      s = advance(s);
    }
    expect(energyCommissionProgress(importSave(exportSave(s)))).toBe(3);
  });

  it('does not let a later contract jump the queue or a saved milestone invent a final delivery', () => {
    const s = createGame(42);
    const later = ENERGY_COMMISSIONS[1]!.id;
    expect(applyAction(s, { type: 'acceptDelivery', jobId: `delivery-${s.day}-${later}` }).ok).toBe(false);
    s.professionMilestones = [GRID_MILESTONE];
    expect(() => exportSave(s)).toThrow('里程碑');
  });
});
