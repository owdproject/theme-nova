<script setup>
import ExplorerTabStripBase from "@owdproject/kit-primevue/runtime/components/explorer/TabStripBase.vue";
import { useI18n } from "vue-i18n";

defineProps({
  tabs: { type: Array, required: true },
  activeTabId: { type: String, required: true },
});

const emit = defineEmits(["select", "close"]);
const { t } = useI18n();
</script>

<template>
  <ExplorerTabStripBase
    class="nova-explorer-tab-strip"
    :tabs="tabs"
    :active-tab-id="activeTabId"
    :show-new-tab="false"
    :aria-label="t('apps.explorer.tabs.ariaLabel')"
    :close-tab-aria-label="t('apps.explorer.tabs.closeTab')"
    @select="emit('select', $event)"
    @close="emit('close', $event)"
  />
</template>

<style scoped>
@charset "UTF-8";
.nova-explorer-tab-strip {
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
  border-bottom: none;
}

.nova-explorer-tab-strip :deep([data-part='tabstrip-root']) {
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
  gap: 2px;
  padding: 0;
  overflow: visible;
  background: transparent;
}

.nova-explorer-tab-strip :deep([data-part='tab']) {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
  max-width: 200px;
  min-height: 30px;
  padding: 0 12px;
  margin: 0;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: color-mix(in srgb, var(--nova-explorer-text) 4%, transparent);
  color: var(--nova-explorer-text-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: default;
  transition: background 0.12s ease, color 0.12s ease;
}

.nova-explorer-tab-strip :deep([data-part='tab'])[aria-selected=true] {
  border-color: var(--nova-explorer-border-subtle);
  border-bottom-color: transparent;
  background: var(--nova-explorer-surface);
  color: var(--nova-explorer-text);
  box-shadow: inset 0 2px 0 var(--nova-explorer-accent-line);
}

.nova-explorer-tab-strip :deep([data-part='tab']):hover {
  background: color-mix(in srgb, var(--nova-explorer-text) 8%, transparent);
  color: var(--nova-explorer-text);
}

.nova-explorer-tab-strip :deep([data-part='tab'])[aria-selected=true]:hover {
  background: var(--nova-explorer-surface);
}

.nova-explorer-tab-strip :deep(.explorer-tab-strip-base__tab-label) {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.nova-explorer-tab-strip :deep([data-part='tab-close']) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: var(--nova-window-control-radius, 8px);
  background: transparent;
  color: inherit;
  font-size: 16px;
  line-height: 1;
  opacity: 0.65;
}

.nova-explorer-tab-strip :deep([data-part='tab-close']):hover {
  opacity: 1;
  background: var(--nova-window-control-hover);
}

.nova-explorer-tab-strip :deep(.explorer-tab-strip-base__close--reserved) {
  visibility: hidden;
  pointer-events: none;
}
</style>
