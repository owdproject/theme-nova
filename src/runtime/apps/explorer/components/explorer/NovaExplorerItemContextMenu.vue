<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import ContextMenu from "primevue/contextmenu";
import { explorerEntryAbsolutePath } from "@owdproject/module-fs/runtime/utils/utilExplorerEntryPath";
const { t } = useI18n();
const props = defineProps({
  fileName: { type: String, required: true },
  window: { type: Object, required: true },
  isDirectory: { type: Boolean, required: false },
  openPathInNewTab: { type: Function, required: false }
});
const emit = defineEmits(["open", "rename"]);
const menu = ref(null);
function entryAbsolutePath() {
  return explorerEntryAbsolutePath(
    props.window.fsExplorer.basePath.value ?? "/",
    props.fileName
  );
}
const items = computed(() => {
  const openItems = [
    {
      label: t("fs.contextMenu.open"),
      icon: "pi pi-folder-open",
      command: () => emit("open", props.fileName)
    }
  ];
  if (props.isDirectory && props.openPathInNewTab) {
    openItems.push({
      label: t("fs.contextMenu.openInNewTab"),
      icon: "pi pi-external-link",
      command: () => props.openPathInNewTab(entryAbsolutePath())
    });
  }
  return [
    ...openItems,
    {
      label: t("fs.contextMenu.sendTo"),
      icon: "pi pi-share-alt",
      command: () => {
        window.alert("To be implemented");
      }
    },
    { separator: true },
    {
      label: t("fs.contextMenu.cut"),
      icon: "pi pi-cut",
      command: () => {
        props.window.fsExplorer.selectFiles([props.fileName]);
        props.window.fsExplorer.cutSelectedFiles();
      }
    },
    {
      label: t("fs.contextMenu.copy"),
      icon: "pi pi-copy",
      command: () => {
        props.window.fsExplorer.selectFiles([props.fileName]);
        props.window.fsExplorer.copySelectedFiles();
      }
    },
    { separator: true },
    {
      label: t("fs.contextMenu.delete"),
      icon: "pi pi-trash",
      command: () => {
        props.window.fsExplorer.selectFiles([entryAbsolutePath()]);
        props.window.fsExplorer.fsController.deleteSelectedFiles();
      }
    },
    {
      label: t("fs.contextMenu.rename"),
      icon: "pi pi-pencil",
      command: () => emit("rename", props.fileName)
    },
    { separator: true },
    {
      label: t("fs.contextMenu.properties"),
      icon: "pi pi-info-circle",
      command: () => {
        props.window.fsExplorer.fileProperties();
      }
    }
  ];
});
function show(event) {
  event.preventDefault();
  menu.value?.show(event);
}
defineExpose({
  show
});
</script>

<template>
  <ContextMenu ref="menu" :model="items" />
</template>
