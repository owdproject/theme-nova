<script setup>
import ExplorerChromeBandBase from "@owdproject/kit-primevue/runtime/components/explorer/ChromeBandBase.vue";
import NovaExplorerBreadcrumbBar from "./NovaExplorerBreadcrumbBar.vue";
import NovaExplorerNavRow from "./NovaExplorerNavRow.vue";
defineProps({
  arrowsDisabled: { type: Boolean, required: true },
  path: { type: String, required: true }
});
const emit = defineEmits(["back", "forward", "up", "refresh", "navigate", "commit"]);
</script>

<template>
  <ExplorerChromeBandBase class="nova-explorer-chrome-band__inner">
    <template #nav>
      <div class="nova-explorer-chrome-band__nav">
        <NovaExplorerNavRow
          :arrows-disabled="arrowsDisabled"
          @back="emit('back')"
          @forward="emit('forward')"
          @up="emit('up')"
          @refresh="emit('refresh')"
        />
      </div>
    </template>

    <template #breadcrumb>
      <div class="nova-explorer-chrome-band__crumb">
        <NovaExplorerBreadcrumbBar
          :path="path"
          @navigate="emit('navigate', $event)"
          @commit="emit('commit', $event)"
        />
      </div>
    </template>
  </ExplorerChromeBandBase>
</template>

<style scoped>
.nova-explorer-chrome-band__inner :deep([data-part='chrome-band-root']) {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
}

.nova-explorer-chrome-band__nav {
  flex: 0 0 auto;
}

.nova-explorer-chrome-band__crumb {
  flex: 1;
  min-width: 0;
}
</style>
