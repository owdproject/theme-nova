<script setup>
import NovaExplorerItemContextMenu from "./NovaExplorerItemContextMenu.vue";
import NovaExplorerFileIcon from "./NovaExplorerFileIcon.vue";
import { computed, inject } from "vue";
import { explorerEntryAbsolutePath } from "@owdproject/module-fs/runtime/utils/utilExplorerEntryPath";
const props = defineProps({
  window: { type: Object, required: true },
  fsExplorer: { type: null, required: true }
});
const browsePath = computed(
  () => String(props.window.meta?.path ?? props.fsExplorer.basePath.value ?? "").trim()
);
const isWebUrl = computed(() => /^https?:\/\//i.test(browsePath.value));
const openPathInNewTab = inject(
  "novaExplorerOpenPathInNewTab",
  void 0
);
</script>

<template>
  <div class="nova-explorer-content-pane">
    <div class="nova-explorer-content-pane__table h-full">
      <DesktopExplorerSelectableArea
        v-if="!String(window.meta.path ?? '').startsWith('http')"
        :fs-explorer="fsExplorer"
        :drop-enabled="!isWebUrl"
      >
        <DesktopExplorerFileEntry
          v-for="fileName of fsExplorer.fsEntries.value"
          :key="fileName"
          :data-filename="fileName"
          :basePath="fsExplorer.basePath.value"
          :fileName="fileName"
          :layout="fsExplorer.layout.value"
          :selected="
  fsExplorer.selectedFiles.value.includes(
    explorerEntryAbsolutePath(
      fsExplorer.basePath.value,
      fileName
    )
  )
"
          :cutted="
  fsExplorer.fsClipboard.clipboardFiles.value.includes(
    explorerEntryAbsolutePath(
      fsExplorer.basePath.value,
      fileName
    )
  ) && fsExplorer.fsClipboard.clipboardType.value === 'cut'
"
          :window="window"
          :open-path-in-new-tab="openPathInNewTab"
          :contextMenuComponent="NovaExplorerItemContextMenu"
        >
          <template #icon="{ fileName: iconFileName, isDirectory, layout }">
            <NovaExplorerFileIcon
              :file-name="iconFileName"
              :is-directory="isDirectory"
              :layout="layout"
            />
          </template>
        </DesktopExplorerFileEntry>
      </DesktopExplorerSelectableArea>
      <iframe
        v-else
        class="nova-explorer-content-pane__iframe"
        :src="window.meta.path ?? ''"
      />
    </div>
  </div>
</template>

<style scoped>
@charset "UTF-8";
.nova-explorer-content-pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  background: var(--nova-explorer-surface);
}

.nova-explorer-content-pane__iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.nova-explorer-content-pane__table {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  background: var(--nova-explorer-surface);
}

/* Denser grid than the old “airy” pass — still slightly roomier than kit-fs base */
.nova-explorer-content-pane :deep(.owd-file) {
  margin: 8px 10px;
}

.nova-explorer-content-pane :deep(.owd-file > .flex.items-center) {
  padding: 6px 8px;
  justify-content: center;
}

.nova-explorer-content-pane :deep(.owd-file--size-smallIcons) {
  margin: 10px 12px;
}

.nova-explorer-content-pane :deep(.owd-file--size-largeIcons) {
  width: 100px;
  margin: 14px 16px;
}

.nova-explorer-content-pane :deep(.owd-file--size-largeIcons > .flex.items-center) {
  padding: 10px 12px;
}

.nova-explorer-content-pane :deep(.owd-file--size-largeIcons .truncate) {
  max-width: 116px;
}

.nova-explorer-content-pane :deep(.owd-file--size-list),
.nova-explorer-content-pane :deep(.owd-file--size-details) {
  display: block;
  width: 100%;
  margin: 0;
  padding-left: 6px;
  padding-right: 6px;
  box-sizing: border-box;
}
</style>
