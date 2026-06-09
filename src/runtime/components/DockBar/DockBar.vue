<script setup>
import { computed } from "vue";
import DockBarButtonApp from "./DockBarButtonApp.vue";
import DockBarButtonMenu from "./DockBarButtonMenu.vue";
import { useApplicationManager } from "@owdproject/core/runtime/composables/useApplicationManager";
import { useDesktopWorkspaceStore } from "@owdproject/core/runtime/stores/storeDesktopWorkspace";
import { useNovaWorkspaces } from "../../composables/useNovaWorkspaces";
const applicationManager = useApplicationManager();
const desktopWorkspaceStore = useDesktopWorkspaceStore();
const { enabled: workspacesEnabled } = useNovaWorkspaces();
const dockApps = computed(() => {
  if (!workspacesEnabled.value) {
    return applicationManager.appsRunning.value;
  }
  const wid = String(desktopWorkspaceStore.active ?? "");
  return applicationManager.appsRunning.value.filter((app) => {
    for (const [, w] of app.windows) {
      if (!wid || w.state.workspace === wid) return true;
    }
    return false;
  });
});
</script>

<template>
  <div class="owd-dock-bar">
    <div class="owd-dock-bar__inner">
      <DockBarButtonMenu />
      <DockBarButtonApp
        v-for="application of dockApps"
        :key="`${application.id}-${application.openWindowCount.value}`"
        :application="application"
      />
    </div>
  </div>
</template>

<style scoped>
.owd-dock-bar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}
.owd-dock-bar__inner {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}
.owd-dock-bar .p-divider-vertical:before {
  color: transparent;
}
</style>
