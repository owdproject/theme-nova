<script setup>
import WorkspaceEdgeHintsBase from "@owdproject/kit-theme/runtime/components/WorkspaceEdgeHintsBase.vue";
import { useNovaWorkspaces } from "../composables/useNovaWorkspaces";
const { enabled: workspacesEnabled } = useNovaWorkspaces();
</script>

<template>
  <WorkspaceEdgeHintsBase :enabled="workspacesEnabled" />
</template>
