<script setup>
import { computed, watch } from "vue";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";
import { createExplorerWindowMenuItems } from "@owdproject/module-fs/runtime/composables/useExplorerWindowMenu";
import NovaExplorerShell from "../explorer/NovaExplorerShell.vue";

const props = defineProps({
  window: { type: Object, required: true }
});

const { t } = useI18n();
const confirm = useConfirm();
function onAbout() {
  confirm.require({
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
  });
}

const explorerMenu = computed(() =>
  createExplorerWindowMenuItems(() => props.window, t, onAbout)
);

watch(
  explorerMenu,
  (menu) => {
    props.window.setMenu(menu);
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <NovaExplorerShell v-bind="$props" :overflow-menu="explorerMenu" />
</template>
