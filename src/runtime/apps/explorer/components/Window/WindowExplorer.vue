<script setup>
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";
import { createExplorerWindowMenuItems } from "@owdproject/kit-explorer/runtime/composables/useExplorerWindowMenu";
import NovaExplorerShell from "../explorer/NovaExplorerShell.vue";
const props = defineProps({
  window: { type: Object, required: true }
});
const { t } = useI18n();
const confirm = useConfirm();
const explorerMenu = createExplorerWindowMenuItems(
  () => props.window,
  t,
  () => confirm.require({
    group: "about",
    header: "About",
    acceptProps: {
      label: "OK",
      class: "p-button--primary"
    },
    rejectProps: {
      class: "hidden"
    },
    accept: () => {
    }
  })
);
props.window.setMenu(explorerMenu);
</script>

<template>
  <NovaExplorerShell v-bind="$props" :overflow-menu="explorerMenu" />
</template>
