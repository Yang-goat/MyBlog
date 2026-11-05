<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { ITEMS, CHARACTERS } from '../content';
import { capacity, stockUsage, attraction } from '../game/engine';
import { footprint, warehouseLayout, GRID_COLUMNS, fits, occupy, STORAGE_UPGRADES, counterLayout, SURFACE_COLUMNS, SURFACE_ROWS, SURFACE_CAPACITY, type Placement } from '../game/warehouse';
import type { ItemInstance } from '../game/types';
import { state, modal, selectedItem, selectedOrder, dispatch, notify, muted, fullScreen } from './store';
import Art from './Art.vue';
import VisitorPanel from './VisitorPanel.vue';
import ItemInfoCard from './ItemInfoCard.vue';
import { tradeIds, tradePlaces, stageTrade, removeTrade, clearTrade, guestGoods, tradeItem } from './trade-selection';
import './room.css';
const ShopCanvas = defineAsyncComponent(() => import('../scenes/ShopCanvas.vue'));

const chapters = ['重新开门', '街区口碑', '高价与代价', '自己的招牌'];
const chapter = computed(() => state.value.endless ? '自由经营' : chapters[Math.max(0,state.value.chapter-1)]);
const visitor = computed(() => state.value.visitors[state.value.visitorIndex]);
const person = computed(() => CHARACTERS.find(p => p.id === visitor.value?.characterId));
const canCall = computed(()=>state.value.phase==='open' && !!visitor.value && (state.value.visitorArrived===false || (visitor.value.resolved&&state.value.visitorIndex<state.value.visitors.length-1)));
const talking = computed(() => state.value.visitorArrived !== false && !!visitor.value && !visitor.value.resolved && state.value.phase === 'open');
const speechStep = computed(() => state.value.conversations?.[visitor.value?.id ?? ''] ?? 0);
const dialogue = computed(() => speechStep.value === 0 ? (state.value.met.includes(person.value?.id ?? '') ? person.value?.returning : person.value?.intro) : visitor.value?.request);
const layout = computed(() => warehouseLayout(state.value.items, capacity(state.value)));
const stock = computed(() => state.value.items.filter(i => layout.value.positions[i.id]));
const waiting = computed(() => state.value.items.filter(i => i.owner === 'player' && (i.location === 'counter' || layout.value.overflow.includes(i.id))));
const displays = computed(() => state.value.items.filter(i => i.location === 'display'));
const orders = computed(() => state.value.orders.filter(o => !o.delivered));
const staged = computed({get:()=>tradeIds.value[0]??'',set:(value:string)=>{if(!value)clearTrade();else stageTrade(value);}});
const stagedAt = computed(()=>tradePlaces.value[staged.value]??{x:0,y:0,rotated:false});
const incomingAt = ref<Record<string,Placement>>({});
const storageShop = ref(false);
const itemArtStyle = (item: ItemInstance, rotated: boolean) => { const {width,height}=footprint(item); return rotated ? {width: `${width/height*100}%`,height: `${height/width*100}%`,transform:'translate(-50%,-50%) rotate(90deg) scale(1.45)'} : {}; };

const counter = computed(() => counterLayout(state.value.items));
const incomingGoods=computed(()=>guestGoods.value.filter(i=>!tradeIds.value.includes(i.id)));
const incomingLayout=computed(()=>warehouseLayout(incomingGoods.value.map(i=>({...i,owner:'player',location:'stock',grid:incomingAt.value[i.id]})),GRID_COLUMNS*3/4));
const surfaceStyle = (item: ItemInstance, at?: Placement) => at ? { gridColumn: `${at.x + 1} / span ${footprint(item, at.rotated).width}`, gridRow: `${at.y + 1} / span ${footprint(item, at.rotated).height}` } : {};
const held = ref('');
const rotated = ref(false);
const hoverCell = ref<{ x: number; y: number; zone: 'warehouse' | 'trade' }>();
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
function hoverItem(e:PointerEvent){if(e.pointerType!=='mouse'||modal.value||storageShop.value)return;touchMode.value=false;const target=itemTarget(e.target);if(target){hoveredItem.value=target.dataset.item??'';pointer.value={x:e.clientX,y:e.clientY};}}
function leaveItem(e:PointerEvent){if(itemTarget(e.target)!==itemTarget(e.relatedTarget))hoveredItem.value='';}
function openItemMenu(e:MouseEvent){const target=itemTarget(e.target);if(!target||modal.value)return;itemMenu.value={id:target.dataset.item!,x:e.clientX,y:e.clientY};hoveredItem.value='';pinnedInfo.value='';}
function dismissItemMenu(e:PointerEvent){if(!(e.target instanceof Element)||!e.target.closest('.item-context-menu'))itemMenu.value=undefined;if(!itemTarget(e.target))pinnedInfo.value='';}
function resizeViewport(){viewport.value={width:window.innerWidth,height:window.innerHeight};}
function clearLongPress(){if(longPressTimer)clearTimeout(longPressTimer);longPressTimer=undefined;}
let down: { id: string; x: number; y: number } | undefined;
const definition = (id: string) => ITEMS.find(d => d.id === id);
const itemById = tradeItem;
const currentItem = computed(() => itemById(held.value || selectedItem.value));
const gridRows = computed(() => Math.ceil(capacity(state.value) * 4 / GRID_COLUMNS));
const tutorialStep = computed(() => state.value.tutorial?.skipped ? 9 : state.value.tutorial?.step ?? 9);
const lessons = [
  ['欢迎接手第九街', '我是林桥。先熟悉你的店：上方是客人带来的货，中间谈判，下面才是自己的仓库。每天开门先按右侧绿灯叫号。我们一起做完第一单。'],
  ['先整理自己的仓库', '拖动下方任意一件货物到另一处空格。也可以点选物品，再点空格放下；Q / E 旋转，Esc 取消。'],
  ['按右侧绿灯叫号', '先点击右侧叫号器的绿色按钮，顾客才会来到门前。再按空格或点“继续交谈”，听完需求后处理货物。'],
  ['把来货放到谈判台', '从上方来货区把送修物拖到中间台面，打开委托单并接下维修。客人的物品单独保管。'],
  ['先检测，再动手', '工作台会给出故障线索。先点击检测，再根据症状选择工序；材料预付款只用于这份工单。'],
  ['修好、复检、交付', '按检测结果完成清洁、更换或校准，然后复检并交付。工时用尽可以闭店，订单会保留。'],
  ['试着收购一件旧货', '呼叫下一位，听完对白，把卖家的货从来货区拖到谈判台。检查、议价后再购买。未付款的货不能入库。'],
  ['买下之后，亲手入库', '已购买的物品仍在中间台面。把它拖进下方空格；放不下时旋转或整理，放错不会丢失物品。'],
  ['营业日由你安排', '继续接客，也可以处理展柜和工单。谈判台也能临时存放库存，方便整理；闭店前必须将台面物品全部入库，再查看结算费用。'],
];
function lesson(step: number, skipped = false) { dispatch({ type: 'tutorial', step, skipped }); }
function speak() { if (talking.value && speechStep.value < 2) dispatch({ type: 'talk', visitorId: visitor.value!.id }); }
watch(() => visitor.value?.id, () => { staged.value = ''; held.value = ''; incomingAt.value = {}; history.value = false; });
watch(state, (next, previous) => {
  if (staged.value && !itemById(staged.value)) staged.value = '';
  if (held.value && !itemById(held.value)) held.value = '';
  const step = next.tutorial?.skipped ? 9 : next.tutorial?.step ?? 9;
  if (step === 2 && (next.conversations?.[visitor.value?.id ?? ''] ?? 0) >= 2) lesson(3);
  else if (step === 3 && next.orders.some(o => !o.delivered)) lesson(4);
  else if (step === 4 && next.orders.some(o => o.diagnosed)) lesson(5);
  else if (step === 5 && next.records.repairs > 0) lesson(6);
  else if (step === 6 && next.items.some(i => i.location === 'counter')) lesson(7);
  else if (step === 7 && previous.items.some(i => i.location === 'counter') && !next.items.some(i => i.location === 'counter')) lesson(8);
  else if (step === 8 && next.phase === 'closed') lesson(9);
});
function pick(id: string) {
  held.value = id; selectedItem.value = id; rotated.value = (counter.value.positions[id] ?? layout.value.positions[id] ?? incomingLayout.value.positions[id])?.rotated ?? false;
}
function startPointer(e: PointerEvent, id: string) {
  if (e.button !== 0 || modal.value || storageShop.value) return;
  clearLongPress();longPressTriggered=false;touchMode.value=e.pointerType==='touch';pinnedInfo.value='';
  down = { id, x: e.clientX, y: e.clientY }; pointer.value = { x: e.clientX, y: e.clientY };
  if(touchMode.value)longPressTimer=setTimeout(()=>{longPressTriggered=true;down=undefined;itemMenu.value={id,x:e.clientX,y:e.clientY};touchInfo.value=id;},500);
}
function cellAt(x: number, y: number, zone = 'warehouse') {
  const grid = document.querySelector(zone === 'warehouse' ? '.warehouse-grid' : `[data-zone="${zone}"] .surface-grid`)?.getBoundingClientRect();
  if (!grid || x < grid.left || x >= grid.right || y < grid.top || y >= grid.bottom) return undefined;
  return { x: Math.floor((x - grid.left) / grid.width * (zone === 'warehouse' ? GRID_COLUMNS : SURFACE_COLUMNS)), y: Math.floor((y - grid.top) / grid.height * (zone === 'warehouse' ? gridRows.value : SURFACE_ROWS)) };
}
function movePointer(e: PointerEvent) {
  pointer.value = { x: e.clientX, y: e.clientY };
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 && !dragging.value) { clearLongPress();touchInfo.value='';hoveredItem.value='';pick(down.id); dragging.value = true; }
  const zone = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-zone]')?.dataset.zone;
  const cell = held.value && !modal.value && !storageShop.value && (zone === 'warehouse' || zone === 'trade') ? cellAt(e.clientX, e.clientY, zone) : undefined;
  hoverCell.value = cell && (zone === 'warehouse' || zone === 'trade') ? { ...cell, zone } : undefined;
}
function counterOccupied(excludeId: string) {
  const occupied = new Set<number>();
  for (const other of waiting.value) if (other.id !== excludeId && counter.value.positions[other.id]) occupy(other, counter.value.positions[other.id]!, occupied, SURFACE_COLUMNS);
  for (const id of tradeIds.value) if (id !== excludeId && itemById(id) && tradePlaces.value[id]) occupy(itemById(id)!, tradePlaces.value[id]!, occupied, SURFACE_COLUMNS);
  return occupied;
}
const validPreview = computed(() => {
  const item = itemById(held.value); if (!item || !hoverCell.value) return false;
  const own = state.value.items.includes(item) && item.owner === 'player';
  const at = { x: hoverCell.value.x, y: hoverCell.value.y, rotated: rotated.value };
  if (hoverCell.value.zone === 'trade') {
    if (own ? !['stock', 'counter'].includes(item.location) : !talking.value || speechStep.value < 2) return false;
    return fits(item, at, counterOccupied(item.id), SURFACE_CAPACITY, SURFACE_COLUMNS);
  }
  if (!own || !['stock', 'counter'].includes(item.location)) return false;
  const occupied = new Set<number>();
  for (const other of stock.value) if (other.id !== item.id) occupy(other, layout.value.positions[other.id]!, occupied);
  return fits(item, at, occupied, capacity(state.value));
});
const previewStyle = computed(() => {
  if (!hoverCell.value || !currentItem.value) return {};
  const { x, y, zone } = hoverCell.value;
  const { width, height } = footprint(currentItem.value, rotated.value);
  return { gridColumn: `${x + 1} / span ${Math.min(width, (zone === 'trade' ? SURFACE_COLUMNS : GRID_COLUMNS) - x)}`, gridRow: `${y + 1} / span ${Math.min(height, (zone === 'trade' ? SURFACE_ROWS : gridRows.value) - y)}` };
});
function place(zone: string, x?: number, y?: number) {
  const item = itemById(held.value); if (!item) return;
  const own = state.value.items.some(i => i.id === item.id && i.owner === 'player');
  if (zone === 'warehouse' && x !== undefined && y !== undefined) {
    if (!own) return notify('这件货还是客人的。先放到中间谈判台，购买后才能入库。');
    if (dispatch({ type: 'moveStock', itemId: item.id, x, y, rotated: rotated.value })) { held.value = ''; removeTrade(item.id); if (tutorialStep.value === 1) lesson(2); }
  } else if (zone === 'incoming') {
    if (own || !guestGoods.value.some(i=>i.id===item.id)) return notify('来货区只放客人尚未售出的物品。');
    const at = { x: x ?? 0, y: y ?? 0, rotated: rotated.value };
    if (!fits(item, at, new Set(), GRID_COLUMNS * 3 / 4)) return notify('来货区这里放不下，请旋转或选择其他格子。');
    const occupied=new Set<number>(); for(const other of incomingGoods.value)if(other.id!==item.id&&incomingLayout.value.positions[other.id])occupy(other,incomingLayout.value.positions[other.id]!,occupied); if(!fits(item,at,occupied,GRID_COLUMNS*3/4))return notify('来货区这几格已被占用。'); incomingAt.value[item.id] = at; removeTrade(item.id); held.value = '';
  } else if (zone === 'trade') {
    const occupied = counterOccupied(item.id);
    const at = { x: x ?? 0, y: y ?? 0, rotated: rotated.value };
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
    const zone = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-zone]')?.dataset.zone;
    if (zone === 'trade' || zone === 'incoming' || zone === 'warehouse') {
      const cell = cellAt(e.clientX, e.clientY, zone);
      if (cell) place(zone, cell.x, cell.y);
    } else if (zone) place(zone);
  } else if (down && !modal.value) {pick(down.id);if(touchMode.value)touchInfo.value=down.id;}
  down = undefined; dragging.value = false; hoverCell.value = undefined;
}
function cancelPointer() { clearLongPress(); down = undefined; dragging.value = false; hoverCell.value = undefined; }
function key(e: KeyboardEvent) {
  if ((e.target as HTMLElement)?.matches('input,select,textarea') || modal.value || storageShop.value) return;
  if (['q', 'e'].includes(e.key.toLowerCase()) && held.value) { e.preventDefault(); rotated.value = !rotated.value; }
  if (e.key === 'Escape') {held.value = '';touchInfo.value='';pinnedInfo.value='';itemMenu.value=undefined;}
  if (e.code === 'Space' && talking.value && speechStep.value < 2) { e.preventDefault(); speak(); }
}
function showOrder(id: string) { selectedOrder.value = id; modal.value = 'workbench'; }
function openTrade() {
  if (staged.value && talking.value) modal.value = 'trade';
  else if (held.value) place('trade');
  else notify('先把上方来货或要卖的库存放到这里。');
}
function autoStore(item: ItemInstance) {
  const candidate = { ...item, location: 'stock' as const, grid: undefined };
  const planned = warehouseLayout([...state.value.items.filter(i => i.id !== item.id), candidate], capacity(state.value));
  const at = planned.positions[item.id];
  if (at) dispatch({ type: 'moveStock', itemId: item.id, ...at }); else notify('没有合适的连续空位，请旋转或整理仓库。');
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
  rotated.value=!at.rotated;
  if(tradeIds.value.includes(id)){stageTrade(id,{...at,rotated:rotated.value});held.value='';}
  else place(item.location==='counter'?'trade':state.value.items.some(i=>i.id===id)?'warehouse':'incoming',at.x,at.y);
 }
}
onMounted(() => { window.addEventListener('resize',resizeViewport);window.addEventListener('pointerdown',dismissItemMenu);window.addEventListener('pointermove', movePointer); window.addEventListener('pointerup', endPointer); window.addEventListener('pointercancel', cancelPointer); window.addEventListener('keydown', key); });
onUnmounted(() => { clearLongPress();tooltipObserver?.disconnect();window.removeEventListener('resize',resizeViewport);window.removeEventListener('pointerdown',dismissItemMenu);window.removeEventListener('pointermove', movePointer); window.removeEventListener('pointerup', endPointer); window.removeEventListener('pointercancel', cancelPointer); window.removeEventListener('keydown', key); });
</script>

<template>
  <section class="shop-room" :class="{ 'holding-item': held, 'dragging-item': dragging }" aria-label="店铺：上方来货，中间交易，下方仓库" @pointerover="hoverItem" @pointerout="leaveItem" @contextmenu.prevent="openItemMenu">
    <ShopCanvas class="room-background" :blocked="true" :scenery-only="true" />
    <div class="room-tint"></div>
    <aside class="room-left">
      <div class="wall-clock" aria-label="店铺营业信息"><strong>第 {{ state.day }} 日</strong><b class="television-cash" aria-label="现金">₡ {{ state.cash.toLocaleString() }}</b><span class="television-hours">工时 {{ state.hours }} / 12</span><small class="television-status">{{ state.phase === 'open' ? '营业中' : '已打烊' }}</small></div>
      <div class="television-controls" aria-label="电视机控制"><button aria-label="声音开关" :aria-pressed="!muted" @click="muted = !muted">{{ muted ? '静音' : '声音' }}</button><button aria-label="切换全屏" @click="fullScreen">全屏</button><button aria-label="操作指引" @click="modal = 'help'">指引</button></div>
      <button class="shop-plaque" @click="modal = 'journal'">第九街 · 杂货铺<small>{{ state.endless ? '' : `第 ${state.chapter} 章 · ` }}{{ chapter }}</small></button>
      <section class="room-showcase" data-zone="display" @click="held ? place('display') : modal = 'collection'"><header>展示柜 <small>吸引力 {{ attraction(state) }}</small></header><div><button v-for="item in displays" :key="item.id" class="showcase-object" :data-item="item.id" :aria-label="definition(item.definitionId)?.name" @click.stop @pointerdown="startPointer($event,item.id)"><Art :id="item.definitionId" :label="definition(item.definitionId)?.name" /></button><p v-if="!displays.length">留给值得记住的旧物</p></div><button @click.stop="modal = 'collection'">管理陈列 ↗</button></section>
      <div v-if="tutorialStep < 9" class="mentor-note" aria-label="新手引导" :data-step="tutorialStep"><small>林桥的开店笔记 · {{ tutorialStep + 1 }} / 9</small><h3>{{ lessons[tutorialStep]?.[0] }}</h3><p>{{ lessons[tutorialStep]?.[1] }}</p><button v-if="tutorialStep === 0" class="primary" @click="lesson(1)">带我熟悉店铺 →</button><button v-if="tutorialStep >= 4 && tutorialStep <= 5 && orders.length" @click="showOrder(orders[0]!.id)">打开当前工单</button><button class="text-button" @click="lesson(9, true)">跳过引导</button></div>
      <button v-else class="room-help" @click="lesson(0)">重新阅读开店引导</button>
    </aside>

    <div class="visitor-window">
      <section v-if="touchInfo && inspectedItem && !modal" class="touch-item-info" role="dialog" aria-label="物品信息"><button class="item-info-close" @click="touchInfo = ''">关闭物品信息 ×</button><ItemInfoCard :item="inspectedItem"/></section>
      <Transition name="guest" mode="out-in"><Art v-if="talking && person" :key="visitor?.id" :id="person.id" :label="person.name" class="room-person" eager /></Transition>
      <div v-if="talking && person" class="speech-bubble"><small>{{ person.role }}</small><h2>{{ person.name }}</h2><p>{{ dialogue }}</p><button v-if="speechStep < 2" @click="speak">{{ speechStep === 0 ? '继续交谈' : '看看带来的货' }} <kbd>空格</kbd></button><div v-else class="speech-options"><button @click="history = !history">对话记录</button><button @click="notify(person.bargain)">聊聊这笔生意</button></div><div v-if="history" class="dialogue-history"><p>{{ person.intro }}</p><p>{{ visitor?.request }}</p><p>{{ person.bargain }}</p></div></div>
      <div v-else class="quiet-window"><strong>{{ state.phase === 'open' ? '柜台暂时安静' : '今晚的招牌收好了' }}</strong><span>{{ state.phase === 'open' ? '按右侧设备的绿色按钮叫号。' : '整理仓库，准备明天。' }}</span></div>
    </div>

    <div class="incoming-tray" data-zone="incoming"><header>01 / 店外来货区 <small>客人的货 · 未购买</small></header><div class="surface-grid" aria-label="来货格子区"><button v-for="n in 72" :key="n" class="surface-cell" :style="{gridColumn:(n-1)%24+1,gridRow:Math.floor((n-1)/24)+1}" :aria-label="`来货空格 ${n}`" @click="held && place('incoming',(n-1)%24,Math.floor((n-1)/24))"></button><button v-for="item in talking && speechStep >= 2 ? incomingGoods : []" :key="item.id" class="physical-item incoming-item surface-item" :style="surfaceStyle(item,incomingLayout.positions[item.id])" :data-item="item.id" @pointerdown="startPointer($event,item.id)" @keydown.enter="pick(item.id)"><Art :id="item.definitionId" eager /></button><span v-if="!talking || speechStep < 2 || !incomingGoods.length" class="zone-hint surface-hint">{{ speechStep < 2 && talking ? '先与客人交谈' : staged && talking ? '货物已移到谈判台' : visitor?.kind === 'buyer' && talking ? '从仓库选取要出售的货物' : '等待下一位来客' }}</span></div></div>

    <div class="negotiation-table" data-zone="trade"><header>02 / 谈判交易区 <button v-if="staged && talking" @click="modal = 'trade'">打开谈判 ↗</button></header><div class="surface-grid table-objects" aria-label="谈判台格子区"><button v-for="n in 72" :key="n" class="surface-cell" :style="{gridColumn:(n-1)%24+1,gridRow:Math.floor((n-1)/24)+1}" :aria-label="`谈判空格 ${n}`" @click="held && place('trade',(n-1)%24,Math.floor((n-1)/24))"></button><button v-for="id in talking ? tradeIds : []" :key="id" class="physical-item surface-item staged-item" :data-item="id" :style="itemById(id) ? surfaceStyle(itemById(id)!,tradePlaces[id]) : {}" @pointerdown="startPointer($event,id)" @dblclick="modal = 'trade'"><Art v-if="itemById(id)" :id="itemById(id)!.definitionId" eager /></button><button v-for="item in waiting.filter(i=>!tradeIds.includes(i.id))" :key="item.id" class="physical-item purchased-item surface-item" :style="surfaceStyle(item,counter.positions[item.id])" :data-item="item.id" @pointerdown="startPointer($event,item.id)" @keydown.enter="pick(item.id)" @dblclick="autoStore(item)"><Art :id="item.definitionId" eager /><span>自有物品 · 待入库</span></button><div v-if="held && hoverCell?.zone === 'trade' && currentItem && !modal && !storageShop" :class="['placement-preview', { invalid: !validPreview }]" :style="previewStyle"></div><span v-if="!waiting.length && !(staged && talking)" class="surface-hint zone-hint">可暂存库存整理，也可放入来货谈判</span></div></div>

    <section class="warehouse-section"><header><strong>03 / 仓库</strong><span>{{ stockUsage(state) * 4 }} / {{ capacity(state) * 4 }} 格</span><button :disabled="!held" @click="rotated = !rotated">旋转 Q / E</button><button @click="dispatch({ type: 'sort' })">整理</button><button @click="storageShop = true">扩容 +</button><button @click="modal = 'inventory'">详细账目 ↗</button></header><div class="warehouse-scroll"><div class="warehouse-grid" data-zone="warehouse" :style="{ '--rows': gridRows }" role="group" aria-label="可整理的格子仓库"><button v-for="n in gridRows * GRID_COLUMNS" :key="n" class="warehouse-cell" :style="{ gridColumn: (n - 1) % GRID_COLUMNS + 1, gridRow: Math.floor((n - 1) / GRID_COLUMNS) + 1 }" :disabled="n > capacity(state) * 4" :aria-label="`仓库空格 ${n}`" @click="!dragging && held && place('warehouse', (n - 1) % GRID_COLUMNS, Math.floor((n - 1) / GRID_COLUMNS))"></button><button v-for="item in stock.filter(i => !(talking && tradeIds.includes(i.id)))" :key="item.id" :data-item="item.id" :aria-label="definition(item.definitionId)?.name" :class="['warehouse-item', { selected: held === item.id }]" :style="{ gridColumn: `${layout.positions[item.id]!.x + 1} / span ${footprint(item, layout.positions[item.id]!.rotated).width}`, gridRow: `${layout.positions[item.id]!.y + 1} / span ${footprint(item, layout.positions[item.id]!.rotated).height}` }" @pointerdown="startPointer($event, item.id)" @keydown.enter="pick(item.id)" @dblclick="selectedItem = item.id; modal = 'inventory'"><Art :id="item.definitionId" :label="definition(item.definitionId)?.name" :style="itemArtStyle(item,layout.positions[item.id]!.rotated)" eager /><span>{{ definition(item.definitionId)?.name }}</span><small v-if="item.expiresDay !== null">{{ item.expiresDay < state.day ? '已过期' : `第${item.expiresDay}日到期` }}</small></button><div v-if="held && hoverCell?.zone === 'warehouse' && currentItem && !modal && !storageShop" :class="['placement-preview', { invalid: !validPreview }]" :style="previewStyle"></div></div></div><p class="warehouse-hint">{{ held ? '点空格放置 · Q/E 旋转 · Esc 放下' : '拖动整理 · 点选后点空格也能移动 · 双击查看物品' }}</p></section>

    <aside class="room-right"><div class="queue-terminal"><small>柜台呼叫器</small><strong>{{ state.visitors.filter(v => !v.resolved).length }} <span>位待接待</span></strong><button v-if="talking" @click="dispatch({ type: 'reject', visitorId: visitor!.id })">结束当前接待</button><span v-else-if="canCall" class="waiting-call">等待叫号 · 按下绿灯</span><button v-else-if="state.phase === 'closed'" class="primary" @click="dispatch({ type: 'openDay' })">迎接新的一天 →</button><span v-else>今日来客已接待完毕</span></div><button class="workshop-hotspot" data-zone="workshop" @click="held ? place('workshop') : modal = 'orders'">维修工作台 <b>{{ orders.length }} 件待办 ↗</b></button><button v-for="order in orders.slice(0, 3)" :key="order.id" class="room-order" @click="showOrder(order.id)">{{ definition(state.items.find(i => i.id === order.itemId)?.definitionId ?? '')?.name }}<small>{{ order.verified ? '待交付' : order.diagnosed ? '待修复 / 复检' : '待检测' }}</small></button><button class="closing-switch" v-if="state.phase === 'open'" @click="modal = 'close-day'">关店 / 日结 →</button></aside>
    <button class="call-green-button" :class="{'call-ready':canCall}" :disabled="!canCall" aria-label="绿色叫号按钮" @click="dispatch({type:'callVisitor'})"><span class="sr-only">叫号，接待下一位顾客</span></button>
    <p v-if="canCall && (state.visitorArrived === false || tutorialStep === 2)" class="call-guide" role="status">点击绿灯叫号 →</p>
    <nav class="cabinet-menu" aria-label="店铺菜单">
      <button @click="modal = 'inventory'">库存</button>
      <button @click="modal = 'growth'">技能与资质 <b v-if="state.points">{{ state.points }}</b></button>
      <button @click="modal = 'equipment'">工具采购</button>
      <button @click="modal = 'collection'">收藏图鉴</button>
      <button @click="modal = 'journal'">街区手记</button>
      <button @click="modal = 'settings'">设置与存档</button>
    </nav>
    <div v-if="dragging && currentItem" class="drag-ghost" :style="{ left: pointer.x + 'px', top: pointer.y + 'px', transform: `translate(-50%,-50%) rotate(${rotated ? 90 : 0}deg)` }"><Art :id="currentItem.definitionId" eager /></div>
    <Teleport to="body">
      <div v-if="inspectedItem && !touchInfo && !modal && !storageShop && !dragging && !itemMenu" ref="tooltipElement" class="pointer-item-info" role="tooltip" :style="tooltipStyle"><ItemInfoCard :item="inspectedItem"/></div>
      <div v-if="itemMenu && menuItem && !modal" class="item-context-menu" role="menu" aria-label="物品操作" :style="menuStyle" @contextmenu.prevent><small>{{definition(menuItem.definitionId)?.name}}</small><button v-for="action in menuActions" :key="action.id" role="menuitem" :disabled="action.disabled" @click="runItemAction(action.id)">{{action.label}}</button><button role="menuitem" class="menu-dismiss" @click="itemMenu = undefined">取消</button></div>
    </Teleport>
    <Teleport to="body"><div v-if="storageShop" class="modal-backdrop" @click.self="storageShop = false"><section class="trade-dialog" role="dialog" aria-label="仓库扩容"><button class="modal-close" aria-label="关闭扩容" @click="storageShop = false">×</button><h2>给旧物腾出地方</h2><p>扩展后增加实际格子，原有摆放保持不动。向下滚动可看到新空间。</p><div v-for="(upgrade,kind) in STORAGE_UPGRADES" :key="kind" class="storage-option"><h3>{{ upgrade.name }}</h3><p>{{ upgrade.description }}</p><span>已装 {{ state.storageUpgrades?.[kind] ?? 0 }} / {{ upgrade.limit }}</span><button :disabled="(state.storageUpgrades?.[kind] ?? 0) >= upgrade.limit" @click="dispatch({type:'buyStorage',kind})">安装{{ upgrade.name }} · ₡{{ upgrade.price }}</button></div></section></div></Teleport>
    <Teleport to="body"><div v-if="modal === 'trade'" class="modal-backdrop" @click.self="modal = ''"><section class="trade-dialog" role="dialog" aria-label="谈判交易" aria-modal="true"><button class="modal-close" aria-label="关闭谈判" @click="modal = ''">×</button><VisitorPanel /><button class="text-button" @click="modal = ''; staged = ''">关闭交易，取消本次选择</button></section></div></Teleport>
  </section>
</template>
