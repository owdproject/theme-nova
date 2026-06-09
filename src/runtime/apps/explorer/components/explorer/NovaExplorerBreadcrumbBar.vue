<script setup>
import ExplorerBreadcrumbBase from "@owdproject/kit-primevue/runtime/components/explorer/BreadcrumbBase.vue";
import { useI18n } from "vue-i18n";
const props = defineProps({
  path: { type: String, required: true }
});
const emit = defineEmits(["navigate", "commit"]);
const { t } = useI18n();
</script>

<template>
  <div class="nova-explorer-breadcrumb-row">
    <ExplorerBreadcrumbBase
      class="nova-explorer-breadcrumb-row__base"
      :path="props.path"
      :root-label="t('apps.explorer.tabs.thisPc')"
      :aria-label="t('apps.explorer.breadcrumb.ariaLabel')"
      :show-address="false"
      :search-placeholder="t('apps.explorer.search.placeholder')"
      @navigate="emit('navigate', $event)"
      @commit="emit('commit', $event)"
    />
  </div>
</template>

<style scoped>
.nova-explorer-breadcrumb-row {
  display: flex;
  min-width: 0;
}

.nova-explorer-breadcrumb-row__base {
  width: 100%;
}
.nova-explorer-breadcrumb-row__base :deep([data-part='breadcrumb-root']) {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 1;
  min-width: 0;
  padding: 1px 6px 1px 0;
  color: var(--nova-explorer-text, rgba(245, 245, 245, 0.96));
  background: transparent;
  flex-wrap: nowrap;
}
.nova-explorer-breadcrumb-row__base :deep([data-part='breadcrumb-crumbs']) {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0;
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid var(--nova-explorer-control-border);
  background: color-mix(in srgb, var(--nova-explorer-surface) 92%, var(--nova-explorer-toolbar));
}
.nova-explorer-breadcrumb-row__base :deep([data-part='breadcrumb-chevron']) {
  flex-shrink: 0;
  margin: 0 2px;
  color: color-mix(in srgb, var(--nova-explorer-text, #fff) 46%, transparent);
}
.nova-explorer-breadcrumb-row__base :deep([data-part='breadcrumb-segment']) {
  max-width: 160px;
  padding: 2px 4px;
  margin: 0;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nova-explorer-breadcrumb-row__base :deep([data-part='breadcrumb-segment']):hover {
  background: color-mix(in srgb, var(--nova-explorer-text, #fff) 8%, transparent);
}
.nova-explorer-breadcrumb-row__base :deep([data-part='breadcrumb-segment'])[aria-current=page] {
  color: var(--nova-explorer-text, rgba(245, 245, 245, 0.96));
}
.nova-explorer-breadcrumb-row__base :deep([data-part='breadcrumb-search']) {
  width: 170px;
  flex: 0 1 170px;
  border-radius: 4px;
  opacity: 0.85;
  font-size: 12px;
  color: var(--nova-explorer-text, rgba(245, 245, 245, 0.96));
  background: color-mix(in srgb, var(--nova-explorer-surface) 92%, var(--nova-explorer-toolbar));
  border-color: var(--nova-explorer-control-border);
  border-width: 1px;
  border-style: solid;
  padding: 5px 8px;
}
</style>
