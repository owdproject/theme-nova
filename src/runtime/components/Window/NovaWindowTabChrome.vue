<script setup>
import { inject, useSlots, computed } from "vue";
import ContextMenu from "primevue/contextmenu";
import ButtonWindowNavMinimize from "../Button/ButtonWindowNavMinimize.vue";
import ButtonWindowNavMaximize from "../Button/ButtonWindowNavMaximize.vue";
import ButtonWindowNavClose from "../Button/ButtonWindowNavClose.vue";
import { useWindowNavContextMenu } from "../../composables/useWindowNavContextMenu";
import { useToggleWindowMaximize } from "@owdproject/core/runtime/composables/useToggleWindowMaximize";

const props = defineProps({
  showWindowControls: { type: Boolean, default: true },
  newTabAriaLabel: { type: String, default: "New tab" },
  showDefaultNewTab: { type: Boolean, default: false },
});

const emit = defineEmits(["add-tab"]);

const slots = useSlots();
const windowController = inject("windowController");
const toggleWindowMaximize = useToggleWindowMaximize();
const { menu, items, onNavContextMenu } = useWindowNavContextMenu(windowController);

const windowNavContextMenuPt = {
  root: { class: "nova-window-nav-context-menu" },
};

const hasLeadingSlot = computed(() => typeof slots.leading === "function");
const hasTrailingSlot = computed(() => typeof slots.trailing === "function");
const showDefaultNewTab = computed(
  () => props.showDefaultNewTab && !hasTrailingSlot.value,
);

const navGridClass = computed(() =>
  hasLeadingSlot.value
    ? "nova-window-tab-chrome__nav--with-leading"
    : "nova-window-tab-chrome__nav--tabs-only",
);

function onWindowMinimize() {
  if (!windowController?.instanced) return;
  windowController.actions.minimize();
}

function onWindowMaximize() {
  toggleWindowMaximize(windowController);
}

function onWindowNavDestroy() {
  if (!windowController?.instanced) return;
  windowController.actions.destroy();
}

function onNewTab() {
  emit("add-tab");
}
</script>

<template>
  <DesktopCoreWindowNav
    class="nova-window-tab-chrome__nav"
    :class="navGridClass"
    @dblclick="onWindowMaximize"
    @contextmenu="onNavContextMenu"
  >
    <div
      v-if="hasLeadingSlot"
      class="nova-window-tab-chrome__leading owd-window-nav__btn-group"
    >
      <slot name="leading" />
    </div>

    <div class="nova-window-tab-chrome__tabs">
      <div class="nova-window-tab-chrome__tabs-scroll">
        <slot name="tabs" />
      </div>

      <div
        v-if="hasTrailingSlot || showDefaultNewTab"
        class="nova-window-tab-chrome__trailing"
      >
        <slot name="trailing">
          <button
            v-if="showDefaultNewTab"
            type="button"
            class="nova-window-tab-chrome__new-tab"
            data-part="tab-new"
            :aria-label="newTabAriaLabel"
            @click.stop="onNewTab"
          >
            +
          </button>
        </slot>
      </div>
    </div>

    <div
      v-if="showWindowControls"
      class="nova-window-tab-chrome__controls owd-window-nav__btn-group owd-window-nav__btn-group--append"
    >
      <slot name="controls">
        <ButtonWindowNavMinimize
          v-if="!windowController?.instanced || windowController?.isMinimizable"
          @mousedown.stop
          @click.stop="onWindowMinimize"
        />
        <ButtonWindowNavMaximize
          v-if="windowController?.isMaximizable"
          @mousedown.stop
          @click.stop="onWindowMaximize"
        />
        <ButtonWindowNavClose
          v-if="!windowController?.instanced || windowController?.isDestroyable"
          @mousedown.stop
          @click.stop="onWindowNavDestroy"
        />
      </slot>
    </div>
  </DesktopCoreWindowNav>

  <ContextMenu ref="menu" :model="items" :pt="windowNavContextMenuPt" />
</template>

<style scoped>
.nova-window-tab-chrome__nav.owd-window-nav {
  display: grid;
  align-items: stretch;
  width: 100%;
  min-height: var(--nova-window-nav-height, 32px);
}

.nova-window-tab-chrome__nav--tabs-only {
  grid-template-columns: minmax(0, 1fr) auto;
}

.nova-window-tab-chrome__nav--with-leading {
  grid-template-columns: auto minmax(0, 1fr) auto;
}

.nova-window-tab-chrome__leading {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 0 4px 0 8px;
}

.nova-window-tab-chrome__nav--tabs-only .nova-window-tab-chrome__tabs {
  grid-column: 1;
}

.nova-window-tab-chrome__nav--tabs-only .nova-window-tab-chrome__controls {
  grid-column: 2;
}

.nova-window-tab-chrome__nav--with-leading .nova-window-tab-chrome__leading {
  grid-column: 1;
}

.nova-window-tab-chrome__nav--with-leading .nova-window-tab-chrome__tabs {
  grid-column: 2;
}

.nova-window-tab-chrome__nav--with-leading .nova-window-tab-chrome__controls {
  grid-column: 3;
}

.nova-window-tab-chrome__tabs {
  display: flex;
  align-items: flex-end;
  min-width: 0;
  gap: 4px;
  padding: 4px 4px 0 8px;
}

.nova-window-tab-chrome__tabs-scroll {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.nova-window-tab-chrome__tabs-scroll :deep([data-part='tab']),
.nova-window-tab-chrome__tabs-scroll :deep([data-part='tab-close']) {
  pointer-events: auto;
}

.nova-window-tab-chrome__trailing {
  display: flex;
  flex-shrink: 0;
  align-items: flex-end;
  padding-bottom: 2px;
}

.nova-window-tab-chrome__trailing,
.nova-window-tab-chrome__new-tab {
  pointer-events: auto;
}

.nova-window-tab-chrome__controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--nova-window-nav-gap, 2px);
  padding: 0 var(--nova-window-nav-padding-x, 8px) 0 4px;
}

.nova-window-tab-chrome__new-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 30px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: var(--nova-window-control-radius, 8px);
  background: transparent;
  color: var(--nova-explorer-text-muted, rgba(255, 255, 255, 0.65));
  font-size: 18px;
  line-height: 1;
  opacity: 0.65;
  cursor: default;
  transition: background 0.12s ease, opacity 0.12s ease, color 0.12s ease;
}

.nova-window-tab-chrome__new-tab:hover {
  background: var(--nova-window-control-hover, rgba(255, 255, 255, 0.08));
  color: var(--nova-explorer-text, #e8eef6);
  opacity: 1;
}
</style>
