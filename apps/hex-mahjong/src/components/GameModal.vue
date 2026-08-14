<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import UiButton from "./UiButton.vue";

const props = withDefaults(defineProps<{
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: "primary" | "gold" | "quiet" | "danger";
  confirmDisabled?: boolean;
  showCancel?: boolean;
  cancelLabel?: string;
}>(), {
  description: "",
  confirmLabel: "确认",
  confirmVariant: "gold",
  confirmDisabled: false,
  showCancel: true,
  cancelLabel: "取消",
});

const emit = defineEmits<{ confirm: []; cancel: [] }>();
const shell = ref<HTMLElement | null>(null);
let previousFocus: HTMLElement | null = null;

function focusableElements() {
  return Array.from(shell.value?.querySelectorAll<HTMLElement>(
    "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
  ) ?? []);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    if (props.showCancel) emit("cancel");
    else if (!props.confirmDisabled) emit("confirm");
    return;
  }
  if (event.key !== "Tab") return;
  const elements = focusableElements();
  if (!elements.length) {
    event.preventDefault();
    shell.value?.focus();
    return;
  }
  const active = document.activeElement;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && (active === first || active === shell.value)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

onMounted(() => {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  shell.value?.focus();
});

onBeforeUnmount(() => {
  if (previousFocus?.isConnected) previousFocus.focus();
});
</script>

<template>
  <div class="modal-layer" role="dialog" aria-modal="true" :aria-label="title" @click.self="showCancel && emit('cancel')" @keydown="handleKeydown">
    <section ref="shell" class="modal-shell hex-panel" tabindex="-1">
      <header>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </header>
      <div class="modal-body"><slot /></div>
      <footer>
        <UiButton v-if="showCancel" :label="cancelLabel" variant="quiet" @click="emit('cancel')" />
        <UiButton :label="confirmLabel" :variant="confirmVariant" :disabled="confirmDisabled" @click="emit('confirm')" />
      </footer>
    </section>
  </div>
</template>

<style scoped>
.modal-layer {
  position: fixed;
  z-index: 80;
  display: grid;
  inset: 0;
  place-items: center;
  overflow: auto;
  padding: 1rem;
  background: rgb(1 7 12 / 82%);
  backdrop-filter: blur(10px);
}
.modal-shell { width: min(720px, 100%); max-height: calc(100vh - 2rem); overflow: auto; outline: none; padding: clamp(1rem, 2.5vw, 1.6rem); }
header { border-bottom: 1px solid rgb(213 172 84 / 22%); padding-bottom: 0.85rem; text-align: center; }
h2 { margin: 0; color: var(--gold-100); font: 700 clamp(1.35rem, 3vw, 2rem)/1.1 var(--font-display); letter-spacing: 0.09em; }
p { margin: 0.45rem 0 0; color: var(--muted); font-size: 0.82rem; line-height: 1.5; }
.modal-body { padding: 1.1rem 0; }
footer { display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid rgb(213 172 84 / 18%); padding-top: 0.9rem; }
</style>
