<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { withBase } from "vuepress/client";
import { createKnotRenderer } from "./kinetic-knot";

const emit = defineEmits<{ "active-change": [active: boolean] }>();
const canvas = ref<HTMLCanvasElement | null>(null);
const fallback = ref<HTMLDivElement | null>(null);
const rendered = ref(false);
const active = ref(false);

let renderer: ReturnType<typeof createKnotRenderer> = null;
let intersection: IntersectionObserver | undefined;
let resize: ResizeObserver | undefined;
let visible = false, unavailable = false, sizeDirty = true;
let frame = 0, previous = 0, seconds = 0;
let x = 0, y = 0, targetX = 0, targetY = 0;
let width = 0, height = 0;
let quality = 1, sampleMs = 0, samples = 0;
let pointerDirty = false;

function movePointer(event: PointerEvent) {
  if (!active.value || event.pointerType === "touch") return;
  targetX = Math.max(-1, Math.min(1, 2 * event.clientX / window.innerWidth - 1));
  targetY = Math.max(-1, Math.min(1, 2 * event.clientY / window.innerHeight - 1));
  pointerDirty = true;
  schedule();
}

function centerPointer() {
  targetX = 0;
  targetY = 0;
  pointerDirty = true;
  schedule();
}

defineExpose({ movePointer, centerPointer });

function schedule() {
  if (active.value && !frame && (!unavailable || pointerDirty)) {
    frame = requestAnimationFrame(paint);
  }
}

function syncActivity() {
  if (!canvas.value) return;
  const next = visible && !document.hidden;
  if (next !== active.value) {
    active.value = next;
    emit("active-change", next);
  }
  if (next) {
    schedule();
  } else {
    cancelAnimationFrame(frame);
    frame = previous = sampleMs = samples = 0;
    x = y = targetX = targetY = 0;
    pointerDirty = false;
    if (fallback.value) fallback.value.style.removeProperty("transform");
  }
}

function paint(now: number) {
  frame = 0;
  const target = canvas.value;
  if (!target || !active.value) return;
  if (!renderer && !unavailable) {
    renderer = createKnotRenderer(target);
    unavailable = !renderer;
  }
  if (!renderer) {
    if (pointerDirty && fallback.value) {
      fallback.value.style.transform = `perspective(900px) translate(${targetX * 7}px, ${targetY * 5}px) rotateX(${-targetY * 4}deg) rotateY(${targetX * 6}deg)`;
    }
    pointerDirty = false;
    return;
  }
  if (!width || !height) return;
  const elapsed = previous ? now - previous : 0;
  previous = now;
  // Back off only after a run of missed frames. Keep this scale until the viewport changes.
  if (elapsed > 0 && quality > 0.65) {
    sampleMs += elapsed;
    samples++;
    if (sampleMs >= 600 && samples >= 8) {
      if (sampleMs / samples > 25) {
        quality = Math.max(0.65, quality * 0.8);
        sizeDirty = true;
      }
      sampleMs = samples = 0;
    }
  }
  if (sizeDirty) {
    const density = quality * Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(540000 / (width * height)));
    target.width = Math.max(1, Math.round(width * density));
    target.height = Math.max(1, Math.round(height * density));
    sizeDirty = false;
  }
  const delta = Math.min(elapsed / 1000, 0.12);
  seconds += delta;
  const blend = 1 - Math.exp(-7 * delta);
  x += (targetX - x) * blend;
  y += (targetY - y) * blend;
  pointerDirty = false;
  renderer.draw(seconds, x, y);
  if (!rendered.value) rendered.value = true;
  schedule();
}

function contextLost(event: Event) {
  event.preventDefault();
  cancelAnimationFrame(frame);
  frame = previous = 0;
  renderer = null;
  unavailable = true;
  rendered.value = false;
  pointerDirty = true;
  schedule();
}

function contextRestored() {
  unavailable = false;
  sizeDirty = true;
  schedule();
}

onMounted(() => {
  const target = canvas.value;
  if (!target) return;
  target.addEventListener("webglcontextlost", contextLost);
  target.addEventListener("webglcontextrestored", contextRestored);
  document.addEventListener("visibilitychange", syncActivity);
  resize = new ResizeObserver(([entry]) => {
    width = entry.contentRect.width;
    height = entry.contentRect.height;
    sizeDirty = true;
    quality = 1;
    sampleMs = samples = 0;
    schedule();
  });
  resize.observe(target);
  intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncActivity();
  });
  intersection.observe(target);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  intersection?.disconnect();
  resize?.disconnect();
  document.removeEventListener("visibilitychange", syncActivity);
  canvas.value?.removeEventListener("webglcontextlost", contextLost);
  canvas.value?.removeEventListener("webglcontextrestored", contextRestored);
  renderer?.dispose();
});
</script>

<template>
  <div class="kinetic-knot" aria-hidden="true">
    <div ref="fallback" v-show="!rendered" class="kinetic-knot__fallback">
      <img
        class="kinetic-knot__poster" :class="{ 'is-active': active }" alt="" draggable="false"
        :src="withBase('/assets/ai-portfolio/kinetic-knot.webp')" width="912" height="800"
      >
    </div>
    <canvas ref="canvas" class="kinetic-knot__surface" :class="{ 'is-ready': rendered }" />
  </div>
</template>

<style scoped>
.kinetic-knot {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.kinetic-knot__surface, .kinetic-knot__fallback, .kinetic-knot__poster {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}
.kinetic-knot__fallback { transition: transform 160ms ease-out; }
.kinetic-knot__poster {
  object-fit: contain;
  animation: knot-drift 14s ease-in-out infinite alternate paused;
}
.kinetic-knot__poster.is-active { animation-play-state: running; }
@keyframes knot-drift {
  from { transform: translateY(0) rotate(0deg); }
  to { transform: translateY(-1.1%) rotate(2.4deg); }
}
.kinetic-knot__surface { opacity: 0; }
.kinetic-knot__surface.is-ready { opacity: 1; }
</style>
