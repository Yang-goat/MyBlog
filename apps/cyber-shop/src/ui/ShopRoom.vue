<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { ITEMS, CHARACTERS } from '../content';
import { capacity, rootCapacity, displayCapacity, stockUsage, attraction } from '../game/engine';
import { dailyHours } from '../game/modifiers';
import { footprint, rotateObject, warehouseLayout, GRID_COLUMNS, fits, occupy, counterLayout, SURFACE_COLUMNS, SURFACE_ROWS, SURFACE_CAPACITY, type Placement } from '../game/warehouse';
import type { ItemInstance, Rotation } from '../game/types';
import { rootLayout, shopCounterLayout, ownedObjects, firstObjectPlace, isContainer, nestingProblem, containerTrail, type StoredObject } from '../game/containers';
import { storageStyle } from '../content/storage';
import { visitorGreeting } from '../game/narrative';
import { state, modal, selectedItem, selectedOrder, dispatch, notify, muted, fullScreen, openGuide } from './store';
import Art from './Art.vue';
import StorageArt from '../scenes/StorageArt.vue';
import HandbookProp from './HandbookProp.vue';
import ContainerWindows from './ContainerWindows.vue';
import {openContainer, closeTopContainer} from './container-windows';
import {locateRequest,locatedItem,resetInventoryNavigation} from './inventory-navigation';
import VisitorPanel from './VisitorPanel.vue';
import ItemInfoCard from './ItemInfoCard.vue';
import JourneyBoard from './JourneyBoard.vue';
import MarketNote from './MarketNote.vue';
import { vDialogFocus } from './dialog-focus';
import { tradeIds, tradePlaces, stageTrade, removeTrade, clearTrade, guestGoods, tradeItem } from './trade-selection';
import './room.css';
import './living-room.css';
import './neon-room.css';
import './inventory-consistency.css';
import InventoryArt from '../scenes/InventoryArt.vue';
import {inventoryPlacement,previewPlacement,shapeClip} from './inventory-shape';
import {inventoryCell,measureInventory} from './inventory-metrics';
const ShopCanvas = defineAsyncComponent(() => import('../scenes/ShopCanvas.vue'));

const chapters = ['重新开门', '街区口碑', '高价与代价', '自己的招牌'];
const chapter = computed(() => state.value.endless ? '自由经营' : chapters[Math.max(0,state.value.chapter-1)]);
const visitor = computed(() => state.value.visitors[state.value.visitorIndex]);
import { factionFor,relationName } from '../game/factions';
import { showFaction } from './faction-view';
const currentFaction=computed(()=>factionFor(visitor.value?.characterId??''));
const person = computed(() => CHARACTERS.find(p => p.id === visitor.value?.characterId));
const canCall = computed(()=>state.value.phase==='open' && !!visitor.value && (state.value.visitorArrived===false || (visitor.value.resolved&&state.value.visitorIndex<state.value.visitors.length-1)));
const talking = computed(() => state.value.visitorArrived !== false && !!visitor.value && !visitor.value.resolved && state.value.phase === 'open');
const speechStep = computed(() => state.value.conversations?.[visitor.value?.id ?? ''] ?? 0);
const greeting=computed(()=>visitorGreeting(state.value,visitor.value));
const dialogue = computed(() => speechStep.value === 0 ? greeting.value : visitor.value?.request);
const layout = computed(() => rootLayout(state.value, rootCapacity(state.value)));
const stock = computed(() => state.value.items.filter(i => layout.value.positions[i.id]));
const waiting = computed(() => ownedObjects(state.value).filter(i => i.location === 'counter' || layout.value.overflow.includes(i.id)));
const waitingItems=computed(()=>waiting.value.filter((o):o is ItemInstance=>!isContainer(o)));
const displays = computed(() => state.value.items.filter(i => i.location === 'display'));
const orders = computed(() => state.value.orders.filter(o => !o.delivered));
const staged = computed({get:()=>tradeIds.value[0]??'',set:(value:string)=>{if(!value)clearTrade();else stageTrade(value);}});
const stagedAt = computed(()=>tradePlaces.value[staged.value]??{x:0,y:0,rotated:false});
const incomingAt = ref<Record<string,Placement>>({});

const counter = computed(() => shopCounterLayout(state.value));
const incomingGoods=computed(()=>guestGoods.value.filter(i=>!tradeIds.value.includes(i.id)));
const incomingLayout=computed(()=>warehouseLayout(incomingGoods.value.map(i=>({...i,owner:'player',location:'stock',grid:incomingAt.value[i.id]})),GRID_COLUMNS*3/4));
const surfaceStyle = inventoryPlacement;
const held = ref('');
const rotated = ref<Rotation>(false);
function rotateHeld(direction=1){if(currentItem.value)rotated.value=rotateObject(currentItem.value,rotated.value,direction);}
const hoverCell = ref<{ x: number; y: number; zone: 'warehouse' | 'trade' | 'container'; containerId?:string }>();
const dragging = ref(false);
const pointer = ref({ x: 0, y: 0 });
const history = ref(false);
const hoveredItem = ref('');
const touchInfo = ref('');
const pinnedInfo = ref('');
const touchMode = ref(false);
const itemMenu = ref<{id:string;x:number;y:number}>();
const tooltipElement = ref<HTMLElement>();
const tooltipSize = ref({width:320,height:380});
const viewport = ref({width:window.innerWidth,height:window.innerHeight});
let tooltipObserver:ResizeObserver|undefined;
const warehouseViewport=ref<HTMLElement>();let inventoryObserver:ResizeObserver|undefined;
let longPressTimer:ReturnType<typeof setTimeout>|undefined;
let longPressTriggered=false;
const inspectedItem = computed(()=>itemById(touchInfo.value||pinnedInfo.value||hoveredItem.value));
const tooltipStyle = computed(()=>{
 const size=tooltipSize.value,view=viewport.value;
 return {left:Math.max(10,Math.min(pointer.value.x+20,view.width-size.width-10))+'px',top:Math.max(10,Math.min(pointer.value.y+18,view.height-size.height-10))+'px'};
});
const menuStyle = computed(()=>({left:Math.max(8,Math.min(itemMenu.value?.x??0,viewport.value.width-208))+'px',top:Math.max(8,Math.min(itemMenu.value?.y??0,viewport.value.height-285))+'px'}));
watch(tooltipElement,el=>{tooltipObserver?.disconnect();if(el){tooltipObserver=new ResizeObserver(()=>{tooltipSize.value={width:el.offsetWidth,height:el.offsetHeight};});tooltipObserver.observe(el);}});
watch(modal,()=>{hoveredItem.value='';pinnedInfo.value='';touchInfo.value='';itemMenu.value=undefined;});
function itemTarget(target:EventTarget|null){return target instanceof Element?target.closest<HTMLElement>('[data-item]'):null;}
function hoverItem(e:PointerEvent){if(e.pointerType!=='mouse'||modal.value)return;touchMode.value=false;const target=itemTarget(e.target);if(target){hoveredItem.value=target.dataset.item??'';pointer.value={x:e.clientX,y:e.clientY};}}
function leaveItem(e:PointerEvent){if(itemTarget(e.target)!==itemTarget(e.relatedTarget))hoveredItem.value='';}
function openItemMenu(e:MouseEvent){const target=itemTarget(e.target);if(!target||modal.value)return;itemMenu.value={id:target.dataset.item!,x:e.clientX,y:e.clientY};hoveredItem.value='';pinnedInfo.value='';}
function dismissItemMenu(e:PointerEvent){if(!(e.target instanceof Element)||!e.target.closest('.item-context-menu'))itemMenu.value=undefined;if(!itemTarget(e.target))pinnedInfo.value='';}
function resizeViewport(){viewport.value={width:window.innerWidth,height:window.innerHeight};}
function clearLongPress(){if(longPressTimer)clearTimeout(longPressTimer);longPressTimer=undefined;}
let down: { id: string; x: number; y: number } | undefined;
const definition = (id: string) => ITEMS.find(d => d.id === id);
const itemById = tradeItem;
const objectById=(id:string):StoredObject|undefined=>state.value.containers?.find(c=>c.id===id)??itemById(id);
const currentItem = computed(() => objectById(held.value || selectedItem.value));
const gridRows = computed(() => Math.ceil(rootCapacity(state.value) * 4 / GRID_COLUMNS));
const tutorialStep = computed(() => state.value.tutorial?.skipped ? 9 : state.value.tutorial?.step ?? 9);
function speak() { if (talking.value && speechStep.value < 2) dispatch({ type: 'talk', visitorId: visitor.value!.id }); }
watch(() => visitor.value?.id, () => { staged.value = ''; held.value = ''; incomingAt.value = {}; history.value = false; });
watch(state, () => {
  if (staged.value && !itemById(staged.value)) staged.value = '';
  if (held.value && !objectById(held.value)) held.value = '';

});
function pick(id: string) {
  const o=objectById(id);if(!o)return;held.value=id;if(!isContainer(o))selectedItem.value=id;rotated.value=(o.containerId?o.grid:tradePlaces.value[id]??counter.value.positions[id]??layout.value.positions[id]??incomingLayout.value.positions[id])?.rotated??false;
}
function openBox(id:string,e?:MouseEvent){held.value='';touchInfo.value='';hoveredItem.value='';itemMenu.value=undefined;openContainer(id,e);}
function inspectLedger(id:string){resetInventoryNavigation();selectedItem.value=id;held.value='';modal.value='inventory';}
let locationTimer:ReturnType<typeof setTimeout>;
watch(locateRequest,async request=>{
 if(!request)return;const item=state.value.items.find(i=>i.id===request.id&&i.owner==='player');if(!item)return;
 held.value='';touchInfo.value='';hoveredItem.value='';itemMenu.value=undefined;
 if(item.containerId){const outer=containerTrail(state.value,item.containerId)?.[0];const anchor=outer?document.querySelector(`[data-container-object="${outer.id}"]`)?.getBoundingClientRect():undefined;openContainer(item.containerId,anchor?{clientX:anchor.right,clientY:anchor.top}:undefined);}
 // Let the ledger finish restoring its previous focus before selecting the physical item.
 await nextTick();await nextTick();
 const target=document.querySelector<HTMLElement>(item.containerId?`[data-container-window="${item.containerId}"] [data-storage-object="${item.id}"]`:`.shop-room [data-item="${item.id}"]`);
 if(target){target.scrollIntoView({block:'nearest',inline:'nearest'});target.focus({preventScroll:true});locatedItem.value=item.id;clearTimeout(locationTimer);locationTimer=setTimeout(()=>locatedItem.value='',5000);}
});
onUnmounted(()=>{clearTimeout(locationTimer);locatedItem.value='';});
function autoInto(target?:string){const o=objectById(held.value);if(!o)return;if(!ownedObjects(state.value).some(i=>i.id===o.id))return notify('先成交，再把货物收入箱包。');const problem=nestingProblem(state.value,o,target);if(problem)return notify(problem);const at=firstObjectPlace(state.value,rootCapacity(state.value),o,target);if(at)place(target?'container':'warehouse',at.x,at.y,target,at.rotated);else notify('没有完整空位，试着旋转或整理。');}
function startPointer(e: PointerEvent, id: string) {
  if (e.button !== 0 || modal.value) return;
  clearLongPress();longPressTriggered=false;touchMode.value=e.pointerType==='touch';pinnedInfo.value='';
  down = { id, x: e.clientX, y: e.clientY }; pointer.value = { x: e.clientX, y: e.clientY };
  if(touchMode.value)longPressTimer=setTimeout(()=>{longPressTriggered=true;down=undefined;itemMenu.value={id,x:e.clientX,y:e.clientY};touchInfo.value=id;},500);
}
function cellAt(x: number, y: number, zone = 'warehouse', containerId?:string) {
  if(zone==='container'&&containerId){const box=state.value.containers?.find(c=>c.id===containerId),grid=document.querySelector(`[data-container-id="${containerId}"]`)?.getBoundingClientRect();if(!box||!grid||x<grid.left||x>=grid.right||y<grid.top||y>=grid.bottom)return;const style=storageStyle(box.styleId);return{x:Math.floor((x-grid.left)/grid.width*style.columns),y:Math.floor((y-grid.top)/grid.height*style.rows)};}
  const grid = document.querySelector(zone === 'warehouse' ? '.warehouse-grid' : `[data-zone="${zone}"] .surface-grid`)?.getBoundingClientRect();
  if (!grid || x < grid.left || x >= grid.right || y < grid.top || y >= grid.bottom) return undefined;
  return { x: Math.floor((x - grid.left) / grid.width * (zone === 'warehouse' ? GRID_COLUMNS : SURFACE_COLUMNS)), y: Math.floor((y - grid.top) / grid.height * (zone === 'warehouse' ? gridRows.value : SURFACE_ROWS)) };
}
function movePointer(e: PointerEvent) {
  pointer.value = { x: e.clientX, y: e.clientY };
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 && !dragging.value) { clearLongPress();touchInfo.value='';hoveredItem.value='';pick(down.id); dragging.value = true; }
  const surface=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-zone]'),zone=surface?.dataset.zone,containerId=surface?.dataset.containerId;
  const cell=held.value&&!modal.value&&['warehouse','trade','container'].includes(zone??'')?cellAt(e.clientX,e.clientY,zone,containerId):undefined;
  hoverCell.value=cell&&(zone==='warehouse'||zone==='trade'||zone==='container')?{...cell,zone,containerId}:undefined;
}
function counterOccupied(excludeId: string) {
  const occupied = new Set<number>();
  for (const other of ownedObjects(state.value)) if (other.id !== excludeId && counter.value.positions[other.id]) occupy(other, counter.value.positions[other.id]!, occupied, SURFACE_COLUMNS);
  for (const id of tradeIds.value) if (id !== excludeId && itemById(id) && tradePlaces.value[id]) occupy(itemById(id)!, tradePlaces.value[id]!, occupied, SURFACE_COLUMNS);
  return occupied;
}
const validPreview = computed(() => {
  const item = objectById(held.value); if (!item || !hoverCell.value) return false;
  const own = ownedObjects(state.value).some(o=>o.id===item.id);
  const at = { x: hoverCell.value.x, y: hoverCell.value.y, rotated: rotated.value };
  if (hoverCell.value.zone === 'trade') {
    if (own ? !['stock', 'counter'].includes(item.location) : !talking.value || speechStep.value < 2) return false;
    return fits(item, at, counterOccupied(item.id), SURFACE_CAPACITY, SURFACE_COLUMNS);
  }
  if (!own || !['stock', 'counter'].includes(item.location)) return false;
  const occupied = new Set<number>();
  for (const other of ownedObjects(state.value)) if (other.id !== item.id && layout.value.positions[other.id]) occupy(other, layout.value.positions[other.id]!, occupied);
  return fits(item, at, occupied, rootCapacity(state.value));
});
const previewStyle = computed(() => {
  if (!hoverCell.value || !currentItem.value) return {};
  return previewPlacement(currentItem.value,{x:hoverCell.value.x,y:hoverCell.value.y,rotated:rotated.value});
});
function place(zone: string, x?: number, y?: number, target?:string, rotation=rotated.value) {
  const object=objectById(held.value);if(!object)return;
  if(isContainer(object)||zone==='container'){
    if(!ownedObjects(state.value).some(o=>o.id===object.id))return notify('先成交，再把货物收入箱包。');
    if(x===undefined||y===undefined||!['container','warehouse','trade'].includes(zone))return;
    const at={x,y,rotated:rotation};const ok=isContainer(object)?dispatch({type:'moveStorage',storageId:object.id,containerId:zone==='container'?target:undefined,counter:zone==='trade',...at}):dispatch({type:'moveStock',itemId:object.id,containerId:target,...at});
    if(ok){held.value='';removeTrade(object.id);}return;
  }
  const item = itemById(held.value); if (!item) return;
  const own = state.value.items.some(i => i.id === item.id && i.owner === 'player');
  if (zone === 'warehouse' && x !== undefined && y !== undefined) {
    if (!own) return notify('这件货还是客人的。先放到中间谈判台，购买后才能入库。');
    if (dispatch({ type: 'moveStock', itemId: item.id, x, y, rotated: rotation })) { held.value = ''; removeTrade(item.id); }
  } else if (zone === 'incoming') {
    if (own || !guestGoods.value.some(i=>i.id===item.id)) return notify('来货区只放客人尚未售出的物品。');
    const at = { x: x ?? 0, y: y ?? 0, rotated: rotation };
    if (!fits(item, at, new Set(), GRID_COLUMNS * 3 / 4)) return notify('来货区这里放不下，请旋转或选择其他格子。');
    const occupied=new Set<number>(); for(const other of incomingGoods.value)if(other.id!==item.id&&incomingLayout.value.positions[other.id])occupy(other,incomingLayout.value.positions[other.id]!,occupied); if(!fits(item,at,occupied,GRID_COLUMNS*3/4))return notify('来货区这几格已被占用。'); incomingAt.value[item.id] = at; removeTrade(item.id); held.value = '';
  } else if (zone === 'trade') {
    const occupied = counterOccupied(item.id);
    const at = { x: x ?? 0, y: y ?? 0, rotated: rotation };
    if (!fits(item, at, occupied, SURFACE_CAPACITY, SURFACE_COLUMNS)) return notify('谈判台这里放不下，请旋转，或选择完整空格。');
    if (own) {
      if(!['stock','counter'].includes(item.location))return notify('请先撤下展柜物品或完成维修。');
      if(dispatch({type:'moveCounter',itemId:item.id,...at})){
        held.value='';
        if(tradeIds.value.includes(item.id))tradePlaces.value[item.id]={...at};
        if(talking.value&&speechStep.value>=2&&visitor.value?.kind==='buyer'&&definition(item.definitionId)?.category===visitor.value.category&&stageTrade(item.id,at))modal.value='trade';
      }
      return;
    }
    if (talking.value && speechStep.value < 2) return notify('先听客人说完，再处理来货。');
    if (!own || (visitor.value?.kind === 'buyer' && item.location === 'stock')) { if(stageTrade(item.id,at)){selectedItem.value = item.id; held.value = ''; modal.value = 'trade';} }
    else notify(item.location === 'counter' ? '这件货已经买下了，拖到下方仓库空格即可。' : '当前客人不收这件货；可以放进展柜或送到工作台。');
  } else if (zone === 'display') {
    if (own && dispatch({ type: 'display', itemId: item.id })) held.value = '';
  } else if (zone === 'workshop') {
    if (own && dispatch({ type: 'startRepair', itemId: item.id })) { selectedOrder.value = state.value.orders.find(o => o.itemId === item.id && !o.delivered)?.id ?? ''; held.value = ''; modal.value = 'workbench'; }
  }
}
function endPointer(e: PointerEvent) {
  clearLongPress();if(longPressTriggered){longPressTriggered=false;down=undefined;return;}
  if (dragging.value && !modal.value) {
    const hit=document.elementFromPoint(e.clientX,e.clientY),surface=hit?.closest<HTMLElement>('[data-zone]'),zone=surface?.dataset.zone;
    const box=hit?.closest<HTMLElement>('[data-container-object]')?.dataset.containerObject;
    if(box&&box!==held.value)autoInto(box);
    else if (zone === 'trade' || zone === 'incoming' || zone === 'warehouse'||zone==='container') {
      const cell = cellAt(e.clientX, e.clientY, zone,surface?.dataset.containerId);
      if (cell) place(zone, cell.x, cell.y,surface?.dataset.containerId);
    } else if (zone) place(zone);
  } else if (down && !modal.value) {pick(down.id);if(touchMode.value&&!isContainer(objectById(down.id)!))touchInfo.value=down.id;}
  down = undefined; dragging.value = false; hoverCell.value = undefined;
}
function cancelPointer() { clearLongPress(); down = undefined; dragging.value = false; hoverCell.value = undefined; }
function key(e: KeyboardEvent) {
  if ((e.target as HTMLElement)?.matches('input,select,textarea') || modal.value || tutorialStep.value<9) return;
  if (['q', 'e'].includes(e.key.toLowerCase()) && held.value) { e.preventDefault(); rotateHeld(e.key.toLowerCase()==='q'?-1:1); }
  if (e.key === 'Escape') {if(!held.value)closeTopContainer();held.value = '';touchInfo.value='';pinnedInfo.value='';itemMenu.value=undefined;}
  if (e.code === 'Space' && !(e.target as HTMLElement)?.closest('.container-window') && talking.value && speechStep.value < 2) { e.preventDefault(); speak(); }
}
function showOrder(id: string) { selectedOrder.value = id; modal.value = 'workbench'; }
function openTrade() {
  if (!talking.value || speechStep.value < 2) return;
  if (visitor.value?.kind !== 'buyer' && !staged.value) {
    const item = incomingGoods.value[0];
    if (!item || !stageTrade(item.id)) return;
    selectedItem.value = item.id;
  }
  modal.value = 'trade';
}
function autoStore(item: StoredObject) {
  const at=firstObjectPlace(state.value,rootCapacity(state.value),item);
  if(at)dispatch(isContainer(item)?{type:'moveStorage',storageId:item.id,...at}:{type:'moveStock',itemId:item.id,...at});else notify('没有合适的连续空位，请旋转或整理仓库。');
}
const menuItem = computed(()=>itemMenu.value?itemById(itemMenu.value.id):undefined);
const menuActions = computed(()=>{
 const item=menuItem.value;if(!item)return [];
 const own=state.value.items.some(i=>i.id===item.id&&i.owner==='player');
 const actions:Array<{id:string;label:string;disabled?:boolean}>=[{id:'info',label:'查看物品信息'}];
 if(tradeIds.value.includes(item.id))actions.push({id:'unstage',label:'取消交易选择'});
 else if((!own&&talking.value)||(own&&(item.location==='stock'||(item.location==='counter'&&talking.value&&visitor.value?.kind==='buyer'))))actions.push({id:'trade',label:'放到谈判台'});
 if(own&&item.location==='counter')actions.push({id:'store',label:'收入仓库'});
 if(own&&item.location==='display')actions.push({id:'withdraw',label:'撤下展柜'});
 if((own&&['stock','counter'].includes(item.location))||!own)actions.push({id:'rotate',label:'旋转物品'});
 if(own&&item.location==='stock'){actions.push({id:'display',label:item.known.includes('serial')&&item.authentic?'放入展柜':'放入展柜 · 需核验',disabled:!item.known.includes('serial')||!item.authentic});if(definition(item.definitionId)?.certificate)actions.push({id:'repair',label:'送到维修工作台'});}
 return actions;
});
function runItemAction(action:string){
 const item=menuItem.value;if(!item)return;const id=item.id;itemMenu.value=undefined;
 if(action==='info'){if(touchMode.value)touchInfo.value=id;else pinnedInfo.value=id;return;}
 hoveredItem.value='';pinnedInfo.value='';touchInfo.value='';pick(id);
 if(action==='trade'){
  const own=state.value.items.some(i=>i.id===id&&i.owner==='player');
  if(!own&&speechStep.value<2)return notify('先听客人把话说完。');
  if(stageTrade(id)){
    held.value='';
    if(!own||(talking.value&&speechStep.value>=2&&visitor.value?.kind==='buyer'&&definition(item.definitionId)?.category===visitor.value.category))modal.value='trade';
    else removeTrade(id);
  }
 }else if(action==='store'){autoStore(item);held.value='';}
 else if(action==='unstage'){removeTrade(id);held.value='';}
 else if(action==='withdraw'){dispatch({type:'withdraw',itemId:id});held.value='';}
 else if(action==='display')place('display');
 else if(action==='repair')place('workshop');
 else if(action==='rotate'){
  const at=tradePlaces.value[id]??counter.value.positions[id]??layout.value.positions[id]??incomingLayout.value.positions[id];if(!at)return;
  rotated.value=rotateObject(item,at.rotated);
  if(tradeIds.value.includes(id)){stageTrade(id,{...at,rotated:rotated.value});held.value='';}
  else place(item.location==='counter'?'trade':state.value.items.some(i=>i.id===id)?'warehouse':'incoming',at.x,at.y);
 }
}
onMounted(() => { if(warehouseViewport.value){inventoryObserver=new ResizeObserver(()=>measureInventory(warehouseViewport.value!));inventoryObserver.observe(warehouseViewport.value);measureInventory(warehouseViewport.value);} window.addEventListener('resize',resizeViewport);window.addEventListener('pointerdown',dismissItemMenu);window.addEventListener('pointermove', movePointer); window.addEventListener('pointerup', endPointer); window.addEventListener('pointercancel', cancelPointer); window.addEventListener('keydown', key); });
onUnmounted(() => { inventoryObserver?.disconnect();clearLongPress();tooltipObserver?.disconnect();window.removeEventListener('resize',resizeViewport);window.removeEventListener('pointerdown',dismissItemMenu);window.removeEventListener('pointermove', movePointer); window.removeEventListener('pointerup', endPointer); window.removeEventListener('pointercancel', cancelPointer); window.removeEventListener('keydown', key); });
</script>

<template>
  <section class="shop-room" :style="{'--inventory-cell':inventoryCell+'px'}" :aria-hidden="!!modal || ['won','ended','failed'].includes(state.phase)" :inert="!!modal || tutorialStep<8 || ['won','ended','failed'].includes(state.phase)" :class="{ 'holding-item': held, 'dragging-item': dragging }" aria-label="店铺：上方来货，中间交易，下方仓库" @pointerover="hoverItem" @pointerout="leaveItem" @contextmenu.prevent="openItemMenu">
    <ShopCanvas class="room-background" :blocked="true" :scenery-only="true" />
    <div class="room-tint"></div>
    <aside class="room-left">
      <div class="wall-clock" aria-label="店铺营业信息"><strong>第 {{ state.day }} 日</strong><b class="television-cash" aria-label="现金">₡ {{ state.cash.toLocaleString() }}</b><span class="television-hours">工时 {{ state.hours }} / {{ dailyHours(state) }}</span><small class="television-status">{{ state.phase === 'open' ? '营业中' : '已打烊' }}</small></div>
      <div class="television-controls" aria-label="电视机控制"><button aria-label="声音开关" :aria-pressed="!muted" @click="muted = !muted">{{ muted ? '静音' : '声音' }}</button><button aria-label="切换全屏" @click="fullScreen">全屏</button><button aria-label="操作指引" @click="openGuide()">指引</button></div>
      <section class="room-showcase" data-zone="display" @click="held ? place('display') : modal = 'collection'"><header>展示柜 <small>吸引力 {{ attraction(state) }}</small></header><div><button v-for="item in displays" :key="item.id" class="showcase-object" :data-item="item.id" :data-located="locatedItem===item.id||undefined" :aria-label="definition(item.definitionId)?.name" @click.stop @pointerdown="startPointer($event,item.id)"><Art :id="item.definitionId" :label="definition(item.definitionId)?.name" /></button></div><button @click.stop="modal = 'collection'">管理陈列 ↗</button></section>
      <JourneyBoard compact />
    </aside>

    <div class="visitor-window">
      <section v-if="touchInfo && inspectedItem && !modal" class="touch-item-info" role="dialog" aria-label="物品信息"><button class="item-info-close" @click="touchInfo = ''">关闭物品信息 ×</button><ItemInfoCard :item="inspectedItem"/></section>
      <Transition name="guest" mode="out-in"><Art v-if="talking && person" :key="visitor?.id" :id="person.id" :label="person.name" class="room-person" eager /></Transition>
      <div v-if="talking && person" class="speech-bubble"><small>{{ person.role }}</small><button class="visitor-faction" @click="showFaction(currentFaction.id)">{{currentFaction.shortName}} · {{relationName(state.relations[currentFaction.id]??0)}}</button><h2>{{ person.name }}</h2><p>{{ dialogue }}</p><button v-if="speechStep < 2" @click="speak">{{ speechStep === 0 ? '继续交谈' : visitor?.kind === 'repair' ? '看看需要修什么' : visitor?.kind === 'buyer' ? '看看有什么合适的' : '看看带来的货' }} </button><div v-else class="speech-options"><button class="primary" @click="openTrade">{{ visitor?.kind === 'repair' ? '查看维修委托' : visitor?.kind === 'buyer' ? '挑选出售货物' : '把来货放上台' }} →</button><button @click="history = !history">对话记录</button><button @click="notify(person.bargain)">聊聊这笔生意</button></div><div v-if="history" class="dialogue-history"><p>{{ greeting }}</p><p>{{ visitor?.request }}</p><p>{{ person.bargain }}</p></div></div>

    </div>

    <div class="incoming-tray" data-zone="incoming"><div class="surface-grid" aria-label="来货格子区"><button v-for="n in 72" :key="n" class="surface-cell" :style="{gridColumn:(n-1)%24+1,gridRow:Math.floor((n-1)/24)+1}" :aria-label="`来货空格 ${n}`" @click="held && place('incoming',(n-1)%24,Math.floor((n-1)/24))"></button><button v-for="item in talking && speechStep >= 2 ? incomingGoods : []" :key="item.id" class="physical-item incoming-item surface-item" :style="surfaceStyle(item,incomingLayout.positions[item.id])" :data-item="item.id" :data-located="locatedItem===item.id||undefined" @pointerdown="startPointer($event,item.id)" @keydown.enter="pick(item.id)"><InventoryArt :object="item" :rotated="incomingLayout.positions[item.id]?.rotated"/></button></div></div>

    <div class="negotiation-table" data-zone="trade"><header><button v-if="waiting.length" @click="waiting.forEach(autoStore)">全部入库 ↓</button><button v-if="staged && talking" @click="modal = 'trade'">打开谈判 ↗</button></header><div class="surface-grid table-objects" aria-label="谈判台格子区"><button v-for="n in 72" :key="n" class="surface-cell" :style="{gridColumn:(n-1)%24+1,gridRow:Math.floor((n-1)/24)+1}" :aria-label="`谈判空格 ${n}`" @click="held && place('trade',(n-1)%24,Math.floor((n-1)/24))"></button><button v-for="id in talking ? tradeIds : []" :key="id" class="physical-item surface-item staged-item" :data-item="id" :data-located="locatedItem===id||undefined" :style="itemById(id) ? surfaceStyle(itemById(id)!,tradePlaces[id]) : {}" @pointerdown="startPointer($event,id)" @dblclick="modal = 'trade'"><InventoryArt v-if="itemById(id)" :object="itemById(id)!" :rotated="tradePlaces[id]?.rotated"/></button><button v-for="item in waitingItems.filter(i=>!tradeIds.includes(i.id))" :key="item.id" class="physical-item purchased-item surface-item" :style="surfaceStyle(item,counter.positions[item.id])" :data-item="item.id" :data-located="locatedItem===item.id||undefined" @pointerdown="startPointer($event,item.id)" @keydown.enter="pick(item.id)" @dblclick="autoStore(item)"><InventoryArt :object="item" :rotated="counter.positions[item.id]?.rotated"/></button><button v-for="box in (state.containers??[]).filter(c=>c.location==='counter')" :key="box.id" class="surface-item purchased storage-on-counter" :data-counter-container="box.id" :data-container-object="box.id" :aria-label="`收纳 ${box.label}`" :style="surfaceStyle(box,counter.positions[box.id])" @pointerdown="startPointer($event,box.id)" @dblclick="openBox(box.id,$event)" @keydown.enter="openBox(box.id)"><InventoryArt :object="box" :rotated="counter.positions[box.id]?.rotated"/></button><div v-if="held && hoverCell?.zone === 'trade' && currentItem && !modal" :class="['placement-preview', { invalid: !validPreview }]" :style="previewStyle"></div></div></div>

    <section class="warehouse-section"><header><span>{{ stockUsage(state) * 4 }} / {{ capacity(state) * 4 }} 格</span><button v-if="held" aria-label="旋转物品" @click="rotateHeld()">↻</button><button @click="dispatch({ type: 'sort' })">整理</button><button v-if="held && currentItem && isContainer(currentItem)" @click="openBox(currentItem.id,$event)">打开箱包</button><button @click="modal = 'inventory'">详细账目 ↗</button></header><div class="warehouse-body"><div ref="warehouseViewport" class="warehouse-scroll"><div class="warehouse-grid" data-zone="warehouse" :style="{ '--rows': gridRows }" role="group" aria-label="可整理的格子仓库"><button v-for="n in gridRows * GRID_COLUMNS" :key="n" class="warehouse-cell" :style="{ gridColumn: (n - 1) % GRID_COLUMNS + 1, gridRow: Math.floor((n - 1) / GRID_COLUMNS) + 1 }" :disabled="n > rootCapacity(state) * 4" :aria-label="`仓库空格 ${n}`" @click="!dragging && held && place('warehouse', (n - 1) % GRID_COLUMNS, Math.floor((n - 1) / GRID_COLUMNS))"></button><button v-for="item in stock.filter(i => !(talking && tradeIds.includes(i.id)))" :key="item.id" :data-item="item.id" :data-located="locatedItem===item.id||undefined" :aria-label="definition(item.definitionId)?.name" :class="['warehouse-item', { selected: held === item.id }]" :style="surfaceStyle(item,layout.positions[item.id])" @pointerdown="startPointer($event, item.id)" @keydown.enter="pick(item.id)" @dblclick="inspectLedger(item.id)"><InventoryArt :object="item" :rotated="layout.positions[item.id]!.rotated"/><span>{{ definition(item.definitionId)?.name }}</span><small v-if="item.known.includes('basic') && item.expiresDay !== null">{{ item.expiresDay < state.day ? '已过期' : `第${item.expiresDay}日到期` }}</small></button><button v-for="box in (state.containers??[]).filter(c=>layout.positions[c.id])" :key="box.id" class="warehouse-item" :data-world-container="box.id" :data-container-object="box.id" :class="{selected:held===box.id}" :aria-label="`打开 ${box.label}`" :style="surfaceStyle(box,layout.positions[box.id])" @pointerdown="startPointer($event,box.id)" @dblclick="openBox(box.id,$event)" @keydown.enter="openBox(box.id)"><InventoryArt :object="box" :rotated="layout.positions[box.id]!.rotated"/><span>{{box.label}}</span></button><div v-if="held && hoverCell?.zone === 'warehouse' && currentItem && !modal" :class="['placement-preview', { invalid: !validPreview }]" :style="previewStyle"></div></div></div><aside class="warehouse-tools" aria-label="仓库用具"><HandbookProp/><button class="storage-dock" :aria-label="state.labeler?'标签机使用说明':'购入标签机 · ₡90'" @click="state.labeler?notify('双击打开箱包，点击标题旁的标签按钮命名。'):dispatch({type:'buyLabeler'})"><StorageArt kind="labeler"/><span>{{state.labeler?'标签机':'标签机 ₡90'}}</span></button></aside></div></section>

    <ContainerWindows :held="held" :rotated="rotated" :hover="hoverCell" @start="startPointer" @place="place" @open="openBox" @rotate="rotateHeld()" @cancel="held=''" @auto="autoInto"/>
    <aside class="room-right"><div class="queue-terminal"><small>柜台呼叫器</small><strong>{{ state.visitors.filter(v => !v.resolved).length }} <span>位待接待</span></strong><button v-if="talking" @click="dispatch({ type: 'reject', visitorId: visitor!.id })">结束当前接待</button><span v-else-if="canCall" class="waiting-call"></span><button v-else-if="state.phase === 'closed'" class="primary" @click="dispatch({ type: 'openDay' })">迎接新的一天 →</button><span v-else>今日来客已接待完毕</span></div><button class="workshop-hotspot" data-zone="workshop" @click="held ? place('workshop') : modal = 'orders'">维修工作台 <b>{{ orders.length }} 件待办 ↗</b></button><button v-for="order in orders.slice(0, 3)" :key="order.id" class="room-order" @click="showOrder(order.id)">{{ definition(state.items.find(i => i.id === order.itemId)?.definitionId ?? '')?.name }}<small>{{ order.verified ? '待交付' : order.diagnosed ? '待修复 / 复检' : '待检测' }}</small></button><button class="closing-switch" v-if="state.phase === 'open'" @click="modal = 'close-day'">关店 / 日结 →</button></aside>
    <MarketNote v-if="!orders.length" />
    <button class="call-green-button" :class="{'call-ready':canCall}" :disabled="!canCall" aria-label="绿色叫号按钮" @click="dispatch({type:'callVisitor'})"><span class="sr-only">叫号，接待下一位顾客</span></button>
    <nav class="cabinet-menu" aria-label="店铺菜单">
      <button @click="modal = 'inventory'">库存</button>
      <button @click="modal = 'growth'">技能与资质 <b v-if="state.points">{{ state.points }}</b></button>
      <button @click="modal = 'equipment'">工具采购</button>
      <button @click="modal = 'collection'">收藏图鉴</button>
      <button @click="modal = 'journal'">街区手记</button>
      <button @click="modal = 'settings'">设置与存档</button>
    </nav>
    <div v-if="dragging && currentItem" class="drag-ghost" :style="{ left: pointer.x + 'px', top: pointer.y + 'px', clipPath:shapeClip(currentItem,rotated),width:footprint(currentItem,rotated).width*inventoryCell+'px',height:footprint(currentItem,rotated).height*inventoryCell+'px' }"><InventoryArt :object="currentItem" :rotated="rotated"/></div>
    <Teleport to="body">
      <div v-if="inspectedItem && !touchInfo && !modal && !dragging && !itemMenu" ref="tooltipElement" class="pointer-item-info" role="tooltip" :style="tooltipStyle"><ItemInfoCard :item="inspectedItem"/></div>
      <div v-if="itemMenu && menuItem && !modal" class="item-context-menu" role="menu" aria-label="物品操作" :style="menuStyle" @contextmenu.prevent><small>{{definition(menuItem.definitionId)?.name}}</small><button v-for="action in menuActions" :key="action.id" role="menuitem" :disabled="action.disabled" @click="runItemAction(action.id)">{{action.label}}</button><button role="menuitem" class="menu-dismiss" @click="itemMenu = undefined">取消</button></div>
    </Teleport>

    <Teleport to="body"><div v-if="modal === 'trade'" class="modal-backdrop" @click.self="modal = ''"><section v-dialog-focus class="trade-dialog trade-dialog-wide" role="dialog" aria-label="谈判交易" aria-modal="true" @keydown.esc.stop="modal = ''"><button class="modal-close" aria-label="关闭谈判" @click="modal = ''">×</button><VisitorPanel /><button class="text-button" @click="modal = ''; staged = ''">关闭交易，取消本次选择</button></section></div></Teleport>
  </section>
</template>
