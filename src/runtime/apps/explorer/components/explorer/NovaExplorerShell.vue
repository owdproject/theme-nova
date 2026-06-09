<script setup>
import { useExplorerTabs } from "@owdproject/module-fs/runtime/composables/useExplorerTabs";
import { useExplorerWindow } from "@owdproject/module-fs/runtime/composables/useExplorerWindow";
import NovaExplorerFrame from "./NovaExplorerFrame.vue";
import NovaExplorerCommandBar from "./NovaExplorerCommandBar.vue";
import NovaExplorerChromeBand from "./NovaExplorerChromeBand.vue";
import NovaExplorerMainPane from "./NovaExplorerMainPane.vue";
import NovaExplorerStatusBar from "./NovaExplorerStatusBar.vue";
import NovaExplorerTabStrip from "./NovaExplorerTabStrip.vue";
import { useI18n } from "vue-i18n";
import { provide } from "vue";
import { useWindowDragHandlers } from "@owdproject/core/runtime/composables/useWindowDragHandlers";

const props = defineProps({
  config: { type: Object, required: false },
  window: { type: Object, required: true },
  overflowMenu: { type: Array, required: true },
});

const { onDragStart, onDragEnd } = useWindowDragHandlers(() => props.window);
const { t } = useI18n();
const fsExplorer = useExplorerWindow(props.window, t);
props.window.fsExplorer = fsExplorer;

const explorerTabs = useExplorerTabs(props.window, fsExplorer, {
  metaKey: "explorerTabs",
  pathToLabel(path) {
    const p = (path || "/").trim() || "/";
    if (p === "/") return t("apps.explorer.tabs.thisPc");
    const parts = p.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? p;
  },
  closeLastTab: () => {
    props.window.destroy();
  },
});

provide("novaExplorerOpenPathInNewTab", (path) => {
  void explorerTabs.openPathInNewTab(path);
});

void fsExplorer.initialize().then(() => {
  explorerTabs.initTabs();
});

async function navigateExplorerTo(target) {
  let normalized = (target || "/").trim();
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  fsExplorer.basePath.value = normalized;
  fsExplorer.fsDirectoryNavigation.hydrate({
    paths: [normalized],
    index: 0,
  });
  await fsExplorer.navigateToDirectory(normalized);
}
</script>

<template>
  <NovaExplorerFrame
    class="nova-explorer-frame"
    :chrome-padding="false"
    :window="window"
    :config="config"
    :new-tab-aria-label="t('apps.explorer.tabs.newTab')"
    @drag:start="onDragStart"
    @drag:end="onDragEnd"
    @add-tab="explorerTabs.addTab"
  >
    <template #tab-chrome-tabs>
      <NovaExplorerTabStrip
        :tabs="explorerTabs.tabsDisplay"
        :active-tab-id="explorerTabs.activeTabId"
        @select="explorerTabs.selectTab"
        @close="explorerTabs.closeTab"
      />
    </template>

    <template #header-below-nav>
      <div class="nova-explorer-top-band">
        <NovaExplorerChromeBand
          :arrows-disabled="
            fsExplorer.fsDirectoryNavigation.history.value.length <= 1
          "
          :path="fsExplorer.basePath.value"
          @back="fsExplorer.directoryBack"
          @forward="fsExplorer.directoryForward"
          @up="fsExplorer.directoryUp"
          @refresh="fsExplorer.refreshDirectory()"
          @navigate="navigateExplorerTo($event)"
          @commit="navigateExplorerTo($event)"
        />
      </div>
    </template>

    <div class="nova-explorer-shell flex flex-col h-full min-h-0 overflow-hidden">
      <NovaExplorerCommandBar
        :window="window"
        :fs-explorer="fsExplorer"
        :overflow-menu="overflowMenu"
      />
      <div class="nova-explorer-shell__content">
        <NovaExplorerMainPane :window="window" :fs-explorer="fsExplorer" />
      </div>
      <NovaExplorerStatusBar
        class="nova-explorer-shell__status"
        :count="fsExplorer.fsEntries.value.length"
        :fs-explorer="fsExplorer"
      />
    </div>
  </NovaExplorerFrame>
</template>

<style scoped>
@charset "UTF-8";
.nova-explorer-shell.h-full {
  overflow-x: hidden;
}

.nova-explorer-shell__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.nova-explorer-shell__content > .nova-explorer-main-pane {
  flex: 1;
  min-height: 0;
}

:deep(.owd-window:not(.owd-window--focused)) iframe {
  pointer-events: none;
}
</style>
