<script setup>
import { computed, onMounted, toRef } from "vue";
import { useI18n } from "vue-i18n";
import Background from "./Background/DesktopBackground.vue";
import DesktopContent from "./Desktop/DesktopContent.vue";
import { useApplicationManager } from "@owdproject/core/runtime/composables/useApplicationManager";
import { useDesktopDialogs } from "@owdproject/core/runtime/composables/useDesktopDialogs";
import { useWorkspaceManager } from "@owdproject/core/runtime/composables/useWorkspaceManager";
import { useDesktopWorkspaceStore } from "@owdproject/core/runtime/stores/storeDesktopWorkspace";
import { countWindowsOnWorkspace } from "@owdproject/core/runtime/utils/utilWorkspaceWindows";
import { useNovaWorkspaceReconcile } from "../composables/useNovaWorkspaceReconcile";
import { useNovaWorkspaceOverviewViewport } from "../composables/useNovaWorkspaceOverviewViewport";
import { useNovaWorkspacePanelLongPress } from "../composables/useNovaWorkspacePanelLongPress";

const props = defineProps({
  stageRef: {
    type: Object,
    default: null,
  },
});

const shellStageRef = toRef(props, "stageRef");

const applicationManager = useApplicationManager();
const desktopWorkspaceStore = useDesktopWorkspaceStore();
const { reconcileOrphanWindows } = useNovaWorkspaceReconcile();
const { t } = useI18n();
const dialogs = useDesktopDialogs();
const { onWorkspaceDragOver, onWorkspaceDrop, removeWorkspace } =
  useWorkspaceManager();
const { setViewportRef, scaleShellStyle, innerOverviewStyle, overviewStackStyle } =
  useNovaWorkspaceOverviewViewport(shellStageRef);
const {
  dismissReveal,
  onPanelPointerDown,
  onPanelPointerEnd,
  isRevealActive,
} = useNovaWorkspacePanelLongPress();

const canRemoveWorkspace = computed(
  () => desktopWorkspaceStore.list.length > 2,
);

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
  return countWindowsOnWorkspace(
    applicationManager.apps.values(),
    workspaceId,
    desktopWorkspaceStore.active,
  );
}
async function onRemoveWorkspace(workspaceId, index) {
  if (!canRemoveWorkspace.value) return;

  const fallbackId = desktopWorkspaceStore.resolveWorkspaceFallback(workspaceId);
  if (!fallbackId) return;

  const count = windowsOnWorkspace(workspaceId);
  if (count > 0) {
    const fallbackIndex = desktopWorkspaceStore.list.indexOf(fallbackId);
    const accepted = await dialogs.confirm({
      title: t("systemBar.workspaces.removeDesktopConfirmTitle"),
      message: t("systemBar.workspaces.removeDesktopConfirmMessage", {
        count,
        target: desktopLabel(fallbackIndex),
      }),
      danger: true,
    });
    if (!accepted) return;
  }

  removeWorkspace(workspaceId);
  dismissReveal();
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
      @click="
        dismissReveal();
        closeOverview();
      "
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
          'nova-workspace-panel--reveal-remove': isRevealActive(workspaceId),
        }"
        role="listitem"
        :tabindex="desktopWorkspaceStore.overview ? 0 : -1"
        @drop="onWorkspaceDrop($event, workspaceId)"
        @dragover="onWorkspaceDragOver"
        @pointerdown="onPanelPointerDown(workspaceId, $event)"
        @pointerup="onPanelPointerEnd"
        @pointercancel="onPanelPointerEnd"
        @pointerleave="onPanelPointerEnd"
        @click="onWorkspacePanelClick(workspaceId, $event)"
        @keydown.enter.prevent="
          desktopWorkspaceStore.overview && selectWorkspace(workspaceId)
        "
        @keydown.space.prevent="
          desktopWorkspaceStore.overview && selectWorkspace(workspaceId)
        "
      >
        <span
          v-if="desktopWorkspaceStore.overview"
          class="nova-workspace-panel__label"
        >
          {{ desktopLabel(index) }}
        </span>
        <button
          v-if="desktopWorkspaceStore.overview && canRemoveWorkspace"
          type="button"
          class="nova-workspace-panel__remove"
          :aria-label="t('systemBar.workspaces.removeDesktop', { n: index + 1 })"
          @click.stop="onRemoveWorkspace(workspaceId, index)"
        >
          <Icon name="mdi:close" :size="16" aria-hidden="true" />
        </button>
        <div
          class="nova-workspace-panel__viewport"
          :ref="(el) => setViewportRef(workspaceId, el)"
        >
          <div
            class="nova-workspace-panel__scale"
            :style="scaleShellStyle(workspaceId)"
          >
            <div
              class="nova-workspace-panel__inner"
              :data-workspace-id="workspaceId"
              :style="innerOverviewStyle(workspaceId)"
            >
              <Background
                v-if="desktopWorkspaceStore.overview"
                class="nova-workspace-panel__bg"
              />
              <DesktopContent
                v-if="
                  desktopWorkspaceStore.overview ||
                  workspaceId === desktopWorkspaceStore.active
                "
              >
                <slot />
              </DesktopContent>
              <DesktopCoreApplicationRender :workspace-filter="workspaceId" />
            </div>
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
