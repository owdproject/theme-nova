<script setup>
import WorkspaceEdgeHintsBase from '@owdproject/core/runtime/components/workspace/WorkspaceEdgeHintsBase.vue'
import { useNovaWorkspaces } from "../composables/useNovaWorkspaces";

const { enabled: workspacesEnabled } = useNovaWorkspaces();
</script>

<template>
  <WorkspaceEdgeHintsBase :enabled="workspacesEnabled">
    <template #left="{ desktopIndex }">
      <div class="nova-edge-hint">
        <span>{{ desktopIndex }}</span>
      </div>
    </template>
    <template #right="{ desktopIndex }">
      <div class="nova-edge-hint">
        <span>{{ desktopIndex }}</span>
      </div>
    </template>
  </WorkspaceEdgeHintsBase>
</template>

<style scoped>
.nova-edge-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  background: color-mix(
    in srgb,
    var(--nova-accent, #60a5fa) 35%,
    transparent
  );
  backdrop-filter: blur(12px);
}
</style>
