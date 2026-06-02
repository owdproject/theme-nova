<script setup>
import { computed, onMounted, onUnmounted, provide, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAppConfig } from "nuxt/app";
import { useDesktopWorkspaceStore } from "@owdproject/core/runtime/stores/storeDesktopWorkspace";
import Background from "./Background/Background.vue";
import DesktopContent from "./Desktop/DesktopContent.vue";
import DockBar from "./DockBar/DockBar.vue";
import NovaConfirmDialogs from "./NovaConfirmDialogs.vue";
import NovaLauncherOverlay from "./NovaLauncherOverlay.vue";
import NovaTopBar from "./NovaTopBar.vue";
import NovaWorkspaceEdgeHints from "./NovaWorkspaceEdgeHints.vue";
import NovaWorkspaceStack from "./NovaWorkspaceStack.vue";
import { useNovaStartMenu } from "../composables/useNovaStartMenu";
import { useNovaAccentTheme } from "../composables/useNovaAccentTheme";
import { useNovaWorkspaces } from "../composables/useNovaWorkspaces";
import { useNovaMotion } from "../composables/useNovaMotion";

defineProps({
  systemBar: { type: null, required: false },
});

const { open: startMenuOpen, close: closeStartMenu } = useNovaStartMenu();
const { accentId } = useNovaAccentTheme();
const { enabled: workspacesEnabled } = useNovaWorkspaces();
useNovaMotion();

const appConfig = useAppConfig();
const desktopWorkspaceStore = useDesktopWorkspaceStore();
const { overview: workspaceOverview } = storeToRefs(desktopWorkspaceStore);
const isOverviewEnabled = computed(() => workspaceOverview.value === true);
const shellStageRef = ref(null);
provide("novaShellStage", shellStageRef);

const BODY_SHELL_CLASS = "owd-has-nova-desktop";

watch(
  accentId,
  (id) => {
    document.body.setAttribute("data-nova-accent", id);
  },
  { immediate: true },
);

watch(startMenuOpen, (isOpen) => {
  if (isOpen && workspaceOverview.value) {
    desktopWorkspaceStore.setOverview(false);
  }
});

watch(workspaceOverview, (isOpen) => {
  if (isOpen) closeStartMenu();
});

onMounted(() => {
  document.body.classList.add(BODY_SHELL_CLASS);
});

onUnmounted(() => {
  document.body.classList.remove(BODY_SHELL_CLASS);
  document.body.removeAttribute("data-nova-accent");
  document.body.removeAttribute("data-nova-motion");
});
</script>

<template>
  <DesktopCore
    v-bind="$props"
    class="owd-desktop--nova"
    :class="{ 'owd-desktop--overview-enabled': isOverviewEnabled }"
    :data-nova-accent="accentId"
  >
    <NovaTopBar />

    <NovaWorkspaceEdgeHints v-if="workspacesEnabled" />

    <div ref="shellStageRef" class="nova-shell__stage">
      <Background />

      <NovaWorkspaceStack v-if="workspacesEnabled">
        <slot />
      </NovaWorkspaceStack>

      <template v-else>
        <DesktopContent>
          <slot />
        </DesktopContent>
        <DesktopApplicationRender />
      </template>
    </div>

    <DockBar v-if="appConfig?.desktop?.dockBar?.enabled" />

    <NovaLauncherOverlay />

    <NovaConfirmDialogs />
  </DesktopCore>
</template>
