<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useDesktopWorkspaceStore } from "@owdproject/core/runtime/stores/storeDesktopWorkspace";
import { useNovaStartMenu } from "../composables/useNovaStartMenu";
import { useNovaQuickSettings } from "../composables/useNovaQuickSettings";
import { useNovaWorkspaces } from "../composables/useNovaWorkspaces";

const { t } = useI18n();
const desktopWorkspaceStore = useDesktopWorkspaceStore();
const { close: closeStartMenu } = useNovaStartMenu();
const { close: closeQuickSettings } = useNovaQuickSettings();
const { enabled } = useNovaWorkspaces();

const workspaceIds = computed(() => desktopWorkspaceStore.list);

const activeIndex = computed(() => {
  const index = desktopWorkspaceStore.workspaceActiveIndex;
  return index >= 0 ? index : 0;
});

const ariaLabel = computed(() => {
  const total = workspaceIds.value.length;
  if (total === 0) return t("systemBar.tray.workspaces");
  return t("systemBar.tray.workspacesActive", {
    n: activeIndex.value + 1,
    total,
  });
});

function toggleOverview() {
  const next = !desktopWorkspaceStore.overview;
  if (next) {
    closeStartMenu();
    closeQuickSettings();
  }
  desktopWorkspaceStore.setOverview(next);
}
</script>

<template>
  <button
    v-if="enabled"
    type="button"
    class="nova-tray-btn"
    :class="{ 'nova-tray-btn--active': desktopWorkspaceStore.overview }"
    :aria-pressed="desktopWorkspaceStore.overview"
    :aria-label="ariaLabel"
    @click="toggleOverview()"
  >
    <span class="nova-tray-workspace-icon" aria-hidden="true">
      <span
        v-for="(workspaceId, index) in workspaceIds"
        :key="workspaceId"
        class="nova-tray-workspace-icon__segment"
        :class="
          index === activeIndex
            ? 'nova-tray-workspace-icon__segment--active'
            : 'nova-tray-workspace-icon__segment--available'
        "
      />
    </span>
  </button>
</template>
