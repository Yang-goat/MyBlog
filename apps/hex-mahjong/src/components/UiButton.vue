<script setup lang="ts">
import UiIcon from "./UiIcon.vue";

withDefaults(defineProps<{
  label: string;
  icon?: InstanceType<typeof UiIcon>["$props"]["name"];
  variant?: "primary" | "gold" | "quiet" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}>(), {
  variant: "quiet",
  disabled: false,
  type: "button",
});
</script>

<template>
  <button class="ui-button" :class="`ui-button--${variant}`" :disabled="disabled" :type="type">
    <UiIcon v-if="icon" :name="icon" :size="21" />
    <span>{{ label }}</span>
  </button>
</template>

<style scoped>
.ui-button {
  position: relative;
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  border: 1px solid color-mix(in srgb, var(--gold-500) 58%, transparent);
  border-radius: 5px;
  padding: 0.72rem 1.25rem;
  background: linear-gradient(180deg, rgb(10 35 53 / 94%), rgb(5 19 31 / 98%));
  box-shadow: inset 0 0 0 1px rgb(91 203 230 / 8%), 0 8px 24px rgb(0 0 0 / 25%);
  color: var(--gold-200);
  font: 650 1rem/1 var(--font-ui);
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, color 160ms ease;
}

.ui-button::after {
  position: absolute;
  inset: 3px;
  border: 1px solid rgb(207 166 83 / 12%);
  content: "";
  pointer-events: none;
}

.ui-button:hover:not(:disabled),
.ui-button:focus-visible {
  border-color: var(--gold-300);
  box-shadow: inset 0 0 0 1px rgb(91 203 230 / 12%), 0 0 20px rgb(29 181 224 / 13%);
  color: var(--gold-100);
  transform: translateY(-1px);
}

.ui-button:focus-visible {
  outline: 2px solid var(--cyan-300);
  outline-offset: 3px;
}

.ui-button:active:not(:disabled) { transform: translateY(1px); }
.ui-button:disabled { cursor: not-allowed; opacity: 0.42; }
.ui-button--primary { border-color: var(--cyan-400); color: var(--cyan-100); }
.ui-button--gold { background: linear-gradient(180deg, #8b5b15, #4d2f09); color: #fff2c8; }
.ui-button--danger { border-color: #9f4655; color: #ffc3cb; }
.ui-button--quiet { background: rgb(5 20 32 / 90%); }
</style>
