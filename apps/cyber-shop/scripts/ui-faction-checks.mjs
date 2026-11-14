import assert from 'node:assert/strict';
/** Optional checks driven by the ordinary full-career UI journey, never injected state. */
export function factionChecks({page,game,close,panel,shot}){
 const seen=new Set(),newPeople=['ji-yan','han-qiao','xu-zheng','yan-que'];
 let appointment=null,visits=[],checkedLocked=false;
 return {
  async visitor(v){
   const s=await game();
   if(appointment&&s.day===appointment.day&&v.characterId===appointment.contact&&['seller','buyer'].includes(v.kind))visits.push(v.kind);
   if(!newPeople.includes(v.characterId)||seen.has(v.characterId))return;
   await shot(`visitor-${v.characterId}`);seen.add(v.characterId);
   await page.locator('.visitor-faction').click();
   const f=s.factions.find(f=>f.contact===v.characterId);assert(f);
   await page.locator(`[data-faction-profile="${f.id}"]`).waitFor();
   const portrait=page.locator('.faction-portrait');assert(await portrait.evaluate(i=>i.complete&&i.naturalWidth>0));
   await shot(`contact-${f.id}`);await close();
  },
  async dayEnd(){
   const s=await game();
   if(!checkedLocked){
    await panel('街区手记');await page.locator('[data-faction="uppercity"]').click();assert(await page.locator('.faction-appoint').isDisabled());
    await shot('contacts-before-meeting');await close();checkedLocked=true;
   }
   if(appointment||s.day<5)return;
   const f=s.factions.find(f=>f.canAppoint);if(!f)return;
   await panel('街区手记');await page.locator(`[data-faction="${f.id}"]`).click();await page.locator('.faction-appoint').click();
   assert.equal((await game()).factionAppointment,f.id);
   await page.getByRole('button',{name:'取消预约',exact:true}).click();assert.equal((await game()).factionAppointment,null);
   await page.locator('.faction-appoint').click();assert.equal((await game()).factionAppointment,f.id);
   appointment={group:f.id,contact:f.contact,day:s.day+1};await shot('confirmed-faction-appointment');await close();
  },
  async finish(){
   assert.deepEqual([...seen].sort(),[...newPeople].sort());assert(appointment);assert(visits.includes('seller'));assert(visits.includes('buyer'));
   assert.equal((await game()).factionAppointment,null);
   await panel('街区手记');await page.locator('[data-faction="freewave"]').click();await page.setViewportSize({width:844,height:390});await shot('contacts-landscape');
   assert(await page.locator('.faction-appoint').isVisible());await close();await page.setViewportSize({width:1440,height:960});
   return {seen:[...seen],appointment,visits};
  }
 };
}
