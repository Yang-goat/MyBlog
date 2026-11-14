<script setup lang="ts">
import { computed } from 'vue';
import { CHARACTERS,CATEGORIES } from '../content';
import { factionContacts,CONTACT_RELATION,TRUSTED_RELATION } from '../game/factions';
import { state,dispatch } from './store';
import { selectedFaction } from './faction-view';
import Art from './Art.vue';
const contacts=computed(()=>factionContacts(state.value));
const contact=computed(()=>contacts.value.find(f=>f.id===selectedFaction.value)!);
const person=computed(()=>CHARACTERS.find(c=>c.id===contact.value.contact)!);
const queued=computed(()=>contacts.value.find(f=>f.id===state.value.factionAppointment));
</script>
<template>
 <section id="faction-ledger" class="faction-ledger" aria-label="街区人脉" :style="{'--faction-color':contact.color}">
  <header><h3>街区人脉</h3><small>{{contacts.filter(f=>f.known).length}} / {{contacts.length}} 已结识</small></header>
  <nav aria-label="选择人群"><button v-for="f in contacts" :key="f.id" :data-faction="f.id" :aria-pressed="f.id===selectedFaction" :class="{active:f.id===selectedFaction}" @click="selectedFaction=f.id"><i :style="{background:f.color}"></i>{{f.shortName}}<small>{{f.known?f.level:'待结识'}}</small></button></nav>
  <article class="faction-profile" :data-faction-profile="contact.id">
   <Art class="faction-portrait" :id="person.id" :label="person.name"/>
   <div class="faction-detail"><small>{{contact.stratum}} · {{person.name}}</small><h4>{{contact.name}}</h4><p>{{contact.description}}</p><p class="faction-preference">{{contact.tradeNote}}</p><div class="faction-relation"><span>{{contact.level}} · {{contact.relation}}</span><span>熟客 {{CONTACT_RELATION}} / 信任 {{TRUSTED_RELATION}}</span></div><meter :value="Math.max(0,contact.relation)" min="0" :max="TRUSTED_RELATION" :aria-label="`${contact.name}关系`"></meter><p class="faction-perk" :class="{unlocked:contact.trusted}">{{contact.trusted?'✓ ':''}}{{contact.perk}}</p><button class="faction-appoint" :disabled="!contact.canAppoint || state.factionAppointment===contact.id || ['failed','won'].includes(state.phase)" @click="dispatch({type:'appointFaction',factionId:contact.id})">{{state.factionAppointment===contact.id?'已预约下次营业':contact.canAppoint?'预约下次营业来访':'关系达到 6 可预约'}}</button><small class="faction-categories">来访货类：{{contact.categories.map(id=>CATEGORIES.find(c=>c.id===id)?.name).join(' / ')}}</small></div>
  </article>
  <footer><p v-if="queued">下次营业：{{queued.name}} · 一位供货人和一位买家 <button @click="dispatch({type:'appointFaction',factionId:null})">取消预约</button></p><p v-else>熟客可免费预约下个营业日的供货人与买家，每次预约一个人群。</p><small>每次接待首次成交关系 +1；维修、订货与街区选择也会改变关系。</small></footer>
 </section>
</template>
<style scoped>
.faction-ledger{padding:20px;margin:16px 0;border:1px solid #4d6059;background:#142a28;scroll-margin:20px}.faction-ledger>header{display:flex;justify-content:space-between;align-items:center}.faction-ledger h3{margin:0 0 14px;font-size:20px;font-weight:400}.faction-ledger small{font-size:11px;color:#aebbad}.faction-ledger nav{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}.faction-ledger nav button{display:flex;align-items:center;gap:6px;padding:7px 9px;margin:0;background:#1d3733;border:1px solid #40564e;font-size:12px}.faction-ledger nav button.active{border-color:var(--faction-color);color:var(--faction-color);background:#283f39}.faction-ledger nav i{width:5px;height:5px;border-radius:50%}.faction-ledger nav small{font-size:9px}.faction-profile{display:grid;grid-template-columns:125px minmax(0,1fr);gap:18px}.faction-portrait{width:100%;object-fit:contain;object-position:center bottom;height:250px;align-self:end;overflow:hidden;background:radial-gradient(ellipse at bottom,#3b5145,transparent 75%)}.faction-portrait :deep(img){width:100%;height:100%;object-fit:contain;object-position:center bottom}.faction-detail h4{font-size:23px;font-weight:400;color:var(--faction-color);margin:6px 0 10px}.faction-detail p{font-size:12px;line-height:1.8;color:#bdc9b9;margin:8px 0}.faction-detail .faction-preference{color:#e0d6b2}.faction-relation{display:flex;justify-content:space-between;gap:10px;font-size:10px;color:var(--faction-color);margin-top:16px}.faction-detail meter{width:100%;height:8px;accent-color:var(--faction-color)}.faction-detail meter::-webkit-meter-bar{background:#0a1b1a;border:0}.faction-detail meter::-webkit-meter-optimum-value{background:var(--faction-color)}.faction-detail .faction-perk{font-size:11px;color:#94a699}.faction-detail .faction-perk.unlocked{color:#c4d49f}.faction-appoint{margin:5px 0 8px;font-size:12px}.faction-categories{display:block}.faction-ledger footer{margin-top:16px;border-top:1px solid #42574b;padding-top:12px}.faction-ledger footer p{font-size:11px;line-height:1.8;margin:0 0 6px;color:#c3c9ae}.faction-ledger footer button{font-size:10px;padding:3px 8px;margin-left:8px}.faction-ledger footer small{font-size:10px;color:#93a395}@media(max-width:600px){.faction-profile{grid-template-columns:75px minmax(0,1fr);gap:10px}.faction-portrait{height:190px}.faction-ledger{padding:14px}.faction-detail h4{font-size:19px}.faction-ledger nav button{padding:6px}.faction-relation{flex-wrap:wrap}}
</style>
