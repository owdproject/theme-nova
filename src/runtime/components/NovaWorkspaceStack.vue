<script setup>
import { inject, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useApplicationManager } from "@owdproject/core/runtime/composables/useApplicationManager";
import { useWorkspaceManager } from "@owdproject/core/runtime/composables/useWorkspaceManager";
import { useDesktopWorkspaceStore } from "@owdproject/core/runtime/stores/storeDesktopWorkspace";
import { useNovaWorkspaceReconcile } from "../composables/useNovaWorkspaceReconcile";
import { useNovaWorkspaceOverviewViewport } from "../composables/useNovaWorkspaceOverviewViewport";

const shellStageRef = inject("novaShellStage");
if (!shellStageRef) {
  throw new Error("NovaWorkspaceStack requires provide('novaShellStage') from Desktop.client.vue");
}

const applicationManager = useApplicationManager();
const desktopWorkspaceStore = useDesktopWorkspaceStore();
const { reconcileOrphanWindows } = useNovaWorkspaceReconcile();
const { t } = useI18n();
const { onWorkspaceDragOver, onWorkspaceDrop } = useWorkspaceManager();
const { setViewportRef, innerOverviewStyle, overviewStackStyle } =
  useNovaWorkspaceOverviewViewport(shellStageRef);

function desktopLabel(index) {
  return t("systemBar.workspaces.desktopN", { n: index + 1 });
}
function closeOverview() {
  desktopWorkspaceStore.setOverview(false);
}
function onWorkspacePanelClick(workspaceId, e) {
  if (!desktopWorkspaceStore.overview) return;
  const target = e.target;
  if (target?.closest(".owd-window")) return;
  desktopWorkspaceStore.setWorkspace(workspaceId);
  closeOverview();
}
function selectWorkspace(workspaceId) {
  if (desktopWorkspaceStore.active === workspaceId) {
    closeOverview();
    return;
  }
  desktopWorkspaceStore.setWorkspace(workspaceId);
}
function addDesktop() {
  desktopWorkspaceStore.createWorkspace();
}
function windowsOnWorkspace(workspaceId) {
  let count = 0;
  for (const win of applicationManager.windowsOpened.value.values()) {
    const ws = win.state.workspace;
    if (!ws && workspaceId === desktopWorkspaceStore.active) {
      count++;
      continue;
    }
    if (ws === workspaceId) count++;
  }
  return count;
}
onMounted(() => {
  reconcileOrphanWindows();
});
</script>

<template>
  <div
    class="nova-workspace-stack"
    :class="{
      'nova-workspace-stack--overview': desktopWorkspaceStore.overview,
    }"
    :style="overviewStackStyle()"
  >
    <button
      v-if="desktopWorkspaceStore.overview"
      type="button"
      class="nova-workspace-stack__backdrop"
      :aria-label="t('systemBar.workspaces.closeOverview')"
      @click="closeOverview"
    />

    <div
      class="nova-workspace-stack__grid"
      role="list"
      :aria-label="t('systemBar.workspaces.overview')"
    >
      <div
        v-for="(workspaceId, index) in desktopWorkspaceStore.list"
        :key="workspaceId"
        class="nova-workspace-panel"
        :class="{
          'nova-workspace-panel--active':
            workspaceId === desktopWorkspaceStore.active,
        }"
        role="listitem"
        @drop="onWorkspaceDrop($event, workspaceId)"
        @dragover="onWorkspaceDragOver"
        @click="onWorkspacePanelClick(workspaceId, $event)"
      >
        <span
          v-if="desktopWorkspaceStore.overview"
          class="nova-workspace-panel__label"
        >
          {{ desktopLabel(index) }}
        </span>
        <div
          class="nova-workspace-panel__viewport"
          :ref="(el) => setViewportRef(workspaceId, el)"
        >
          <div
            class="nova-workspace-panel__inner"
            :data-workspace-id="workspaceId"
            :style="innerOverviewStyle(workspaceId)"
          >
            <DesktopContent
              v-if="
                desktopWorkspaceStore.overview ||
                workspaceId === desktopWorkspaceStore.active
              "
            >
              <slot />
            </DesktopContent>
            <DesktopApplicationRender :workspace-filter="workspaceId" />
          </div>
        </div>
        <p
          v-if="
            desktopWorkspaceStore.overview &&
            windowsOnWorkspace(workspaceId) === 0
          "
          class="nova-workspace-panel__empty"
        >
          {{ $t("systemBar.workspaces.emptyDesktop") }}
        </p>
      </div>
    </div>

    <nav
      v-if="desktopWorkspaceStore.overview"
      class="nova-workspace-switcher"
      :aria-label="t('systemBar.workspaces.switcher')"
    >
      <button
        v-for="(workspaceId, index) in desktopWorkspaceStore.list"
        :key="`switch-${workspaceId}`"
        type="button"
        class="nova-workspace-switcher__pill"
        :class="{
          'nova-workspace-switcher__pill--active':
            workspaceId === desktopWorkspaceStore.active,
        }"
        @click.stop="selectWorkspace(workspaceId)"
      >
        {{ desktopLabel(index) }}
      </button>
      <button
        type="button"
        class="nova-workspace-switcher__pill nova-workspace-switcher__pill--add"
        :aria-label="t('systemBar.workspaces.addDesktop')"
        @click.stop="addDesktop"
      >
        <Icon name="mdi:plus" :size="16" aria-hidden="true" />
      </button>
    </nav>
  </div>
</template>
