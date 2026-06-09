<script setup>
import { nextTick, ref, useTemplateRef } from "vue";
import TieredMenu from "primevue/tieredmenu";
import Button from "primevue/button";

defineProps({
  model: { type: Array, required: true }
});

const menu = ref(null);
const triggerRef = useTemplateRef("triggerRef");

const explorerOverlayPt = {
  root: { class: "nova-explorer-popup-menu" }
};

function toggle(event) {
  menu.value?.toggle(event);
}

function alignPopupToTriggerEnd() {
  const menuEl = menu.value?.container;
  const trigger = triggerRef.value?.$el ?? triggerRef.value;
  if (!menuEl || !trigger) return;

  const triggerRect = trigger.getBoundingClientRect();
  const menuWidth = menuEl.offsetWidth;
  const left = triggerRect.right - menuWidth + window.scrollX;
  const minLeft = window.scrollX + 8;
  const maxLeft = window.scrollX + window.innerWidth - menuWidth - 8;

  menuEl.style.left = `${Math.min(Math.max(left, minLeft), maxLeft)}px`;
}

async function onMenuShow() {
  await nextTick();
  alignPopupToTriggerEnd();
}
</script>

<template>
  <div class="nova-explorer-overflow">
    <Button
      ref="triggerRef"
      type="button"
      rounded
      variant="text"
      severity="secondary"
      class="nova-explorer-overflow__trigger"
      aria-haspopup="true"
      aria-expanded="false"
      @click="toggle"
    >
      <Icon name="mdi:dots-horizontal" size="20" />
    </Button>
    <TieredMenu
      ref="menu"
      :model="model"
      popup
      :pt="explorerOverlayPt"
      @show="onMenuShow"
    />
  </div>
</template>

<style scoped>
.nova-explorer-overflow {
  display: inline-flex;
  align-items: center;
}

.nova-explorer-overflow__trigger {
  width: var(--nova-window-control-size, 28px);
  height: var(--nova-window-control-size, 28px);
  padding: 0;
  color: var(--nova-explorer-text);
  border-radius: var(--nova-window-control-radius, 8px);
  cursor: pointer;
}

.nova-explorer-overflow :deep(.p-button:hover) {
  background: var(--nova-window-control-hover);
}

.nova-explorer-overflow :deep(.p-button > .iconify) {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: var(--nova-explorer-text) !important;
  opacity: 0.88;
}
</style>
