<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Phaser from 'phaser';
import { CHARACTERS, ITEMS } from '../content';
import { state, modal, selectedItem, selectedOrder, dispatch, listen, reducedMotion } from '../ui/store';
const props = defineProps<{ blocked: boolean; sceneryOnly?: boolean }>();
const host = ref<HTMLDivElement>(); const loading = ref(0); const ready = ref(false); const failed = ref<string[]>([]);
let game: Phaser.Game | undefined; let scene: ShopScene | undefined;
let stopWatch: (() => void) | undefined; let stopListen: (() => void) | undefined;
const assetUrl = (id: string) => `/cyber-shop/art/${id}.webp`;

class ShopScene extends Phaser.Scene {
  private figures: Phaser.GameObjects.GameObject[] = [];
  private currentVisit = '';
  private currentStock = '';
  private loadingKeys = new Set<string>();
  private lamp?: Phaser.GameObjects.Ellipse;
  private table?: Phaser.GameObjects.Zone;
  private shelf?: Phaser.GameObjects.Zone;
  constructor() { super('shop'); }
  preload() {
    this.load.on('progress', (n: number) => { loading.value = Math.round(n * 100); });
    this.load.on('loaderror', (file: Phaser.Loader.File) => { failed.value = [...new Set([...failed.value, file.key])]; this.loadingKeys.delete(file.key); });
    this.load.image('scene-shop', assetUrl('scene-shop'));
  }
  create() {
    scene = this; ready.value = true;
    this.cameras.main.setBackgroundColor('#122b30');
    if (this.textures.exists('scene-shop')) {
      const image = this.add.image(720, 450, 'scene-shop');
      if (props.sceneryOnly) {
        const fit = () => image.setPosition(this.scale.width / 2, this.scale.height / 2).setDisplaySize(this.scale.width, this.scale.height);
        fit(); this.scale.on('resize', fit);
      } else image.setScale(Math.max(1440 / image.width, 900 / image.height));
    }
    if (props.sceneryOnly) { this.renderState(); return; }
    this.add.rectangle(720, 825, 1440, 150, 0x061217, 0.22);
    this.lamp = this.add.ellipse(1030, 300, 270, 170, 0xe8a666, 0.055).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: this.lamp, alpha: { from: 0.04, to: 0.12 }, duration: 2400, yoyo: true, repeat: -1 });
    const table = this.table = this.add.zone(1070, 680, 310, 200).setRectangleDropZone(310, 200);
    const shelf = this.shelf = this.add.zone(320, 420, 300, 270).setRectangleDropZone(300, 270);
    table.setData('target', 'workshop'); shelf.setData('target', 'display');
    this.input.on('drag', (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Image, x: number, y: number) => { if (!props.blocked) object.setPosition(x, y).setDepth(25); });
    this.input.on('drop', (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Image, zone: Phaser.GameObjects.Zone) => {
      if (props.blocked) return;
      const id = object.getData('itemId') as string;
      if (zone.getData('target') === 'display') dispatch({ type: 'display', itemId: id });
      else if (dispatch({ type: 'startRepair', itemId: id })) { selectedOrder.value = state.value.orders.find(o => o.itemId === id && !o.delivered)?.id ?? ''; modal.value = 'workbench'; }
      this.currentStock = ''; this.renderState();
    });
    this.input.on('dragend', (_pointer: Phaser.Input.Pointer, object: Phaser.GameObjects.Image) => { if (object.active) object.setPosition(object.getData('originX'), object.getData('originY')).setDepth(10); });
    this.renderState();
  }
  ensureTexture(id: string) {
    if (this.textures.exists(id) || this.loadingKeys.has(id) || failed.value.includes(id)) return;
    this.loadingKeys.add(id); this.load.image(id, assetUrl(id));
    this.load.once(`filecomplete-image-${id}`, () => { this.loadingKeys.delete(id); this.currentVisit = ''; this.currentStock = ''; this.renderState(); });
    if (!this.load.isLoading()) this.load.start();
  }
  renderState() {
    if (!this.sys.isActive()) return;
    this.input.enabled = !props.blocked;
    if (props.sceneryOnly) return;
    const visitor = state.value.visitors[state.value.visitorIndex];
    const person = CHARACTERS.find(c => c.id === visitor?.characterId);
    const key = visitor && !visitor.resolved ? visitor.id : 'empty';
    const stock = state.value.items.filter(i => i.owner === 'player' && i.location === 'stock').slice(0, 5);
    const canvas = this.game.canvas.getBoundingClientRect();
    const viewport = host.value?.getBoundingClientRect();
    if (!viewport || !canvas.width || !canvas.height) return;
    const scaleX = 1440 / canvas.width, scaleY = 900 / canvas.height;
    const left = (viewport.left - canvas.left) * scaleX, top = (viewport.top - canvas.top) * scaleY;
    const width = viewport.width * scaleX, height = viewport.height * scaleY;
    const stockKey = `${stock.map(i => i.id).join(',')}:${viewport.width}:${viewport.height}`;
    if (key === this.currentVisit && stockKey === this.currentStock) return;
    this.figures.forEach(f => f.destroy()); this.figures = [];
    const isArrival = key !== this.currentVisit; this.currentVisit = key; this.currentStock = stockKey;
    this.shelf?.setPosition(left + width * .22, top + height * .48);
    this.table?.setPosition(left + width * .8, top + height * .7);
    if (person && key !== 'empty') {
      this.ensureTexture(person.id);
      if (this.textures.exists(person.id)) {
        const portrait = this.add.image(780, 705, person.id).setOrigin(0.5, 1).setDepth(5);
        portrait.setScale(Math.min(640 / portrait.height, 560 / portrait.width)); this.figures.push(portrait);
        if (isArrival && !reducedMotion.value) { portrait.setAlpha(0).setX(820); this.tweens.add({ targets: portrait, x: 780, alpha: 1, duration: 500, ease: 'Sine.easeOut' }); }
      }
    }
    stock.forEach((item, index) => {
      this.ensureTexture(item.definitionId);
      if (!this.textures.exists(item.definitionId)) return;
      const x = left + width * (.2 + index * .15); const y = top + height - 125 * scaleY;
      const image = this.add.image(x, y, item.definitionId).setDepth(10).setInteractive({ draggable: true, useHandCursor: true });
      image.setScale(Math.min(125 / image.width, 125 / image.height)); image.setData({ itemId: item.id, originX: x, originY: y });
      image.on('pointerup', (pointer: Phaser.Input.Pointer) => { if (!props.blocked && pointer.getDistance() < 8) { selectedItem.value = item.id; modal.value = 'inventory'; } });
      this.figures.push(image);
    });
  }
  effect(kind: string) {
    if (reducedMotion.value || props.sceneryOnly) return;
    const color = kind === 'repair' ? 0xffc88c : 0x9fffe5;
    for (let n = 0; n < 9; n++) {
      const particle = this.add.circle(1040, 660, 2 + (n % 3), color).setDepth(30);
      this.tweens.add({ targets: particle, x: 1040 + Math.cos(n * 0.7) * 100, y: 610 - n * 11, alpha: 0, duration: 600, onComplete: () => particle.destroy() });
    }
  }
  retry() { failed.value = []; this.currentStock = ''; this.currentVisit = ''; if (!this.textures.exists('scene-shop')) this.scene.restart(); else this.renderState(); }
  update() { this.renderState(); if (this.lamp) this.lamp.visible = !reducedMotion.value; }
}

onMounted(() => {
  game = new Phaser.Game({ type: Phaser.AUTO, parent: host.value, width: 1440, height: 900, backgroundColor: '#0b242b', transparent: false,
    scale: { mode: props.sceneryOnly ? Phaser.Scale.RESIZE : Phaser.Scale.ENVELOP, autoCenter: Phaser.Scale.CENTER_BOTH }, scene: ShopScene,
    render: { antialias: true, roundPixels: false, preserveDrawingBuffer: true }, audio: { noAudio: true }, banner: false });
  window.advanceTime = async (ms: number) => { if (!game || !Number.isFinite(ms) || ms < 0) return; game.loop.stop(); const steps = Math.min(600, Math.max(1, Math.ceil(ms / (1000 / 60)))); const delta = Math.min(ms, 10000) / steps; for (let i = 0; i < steps; i++) game.step(performance.now() + i * delta, delta); };
  stopWatch = watch([state, () => props.blocked], () => scene?.renderState());
  stopListen = listen(events => events.filter(e => ['trade', 'repair', 'display', 'success'].includes(e.type)).forEach(e => scene?.effect(e.type)));
});
onUnmounted(() => { stopWatch?.(); stopListen?.(); game?.destroy(true); game = undefined; scene = undefined; });
</script>

<template><div class="canvas-root"><div ref="host" class="phaser-host" aria-label="店铺场景，可拖动物品到左侧展柜或右侧工作台"></div><div v-if="!ready" class="scene-loading">正在点亮街灯… {{ loading }}%</div><div v-if="failed.length" class="scene-failed">{{ failed.length }} 项资源未载入 <button @click="scene?.retry()">重试</button></div></div></template>
