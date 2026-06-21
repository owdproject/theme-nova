<script setup>
import { inject } from "vue";
import ContextMenu from "primevue/contextmenu";
import ButtonWindowNavMinimize from "../Button/ButtonWindowNavMinimize.vue";
import ButtonWindowNavMaximize from "../Button/ButtonWindowNavMaximize.vue";
import ButtonWindowNavClose from "../Button/ButtonWindowNavClose.vue";
import { useWindowNavContextMenu } from "../../composables/useWindowNavContextMenu";
import { useToggleWindowMaximize } from "@owdproject/core/runtime/composables/useToggleWindowMaximize";
const windowController = inject("windowController");
const toggleWindowMaximize = useToggleWindowMaximize();
const { menu, items, onNavContextMenu } = useWindowNavContextMenu(windowController);
const windowNavContextMenuPt = {
  root: { class: "nova-window-nav-context-menu" }
};
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
</script>

<template>
  <DesktopCoreWindowNav
    @dblclick="onWindowMaximize"
    @contextmenu="onNavContextMenu"
  >
    <div
      v-if="$slots.prepend"
      class="owd-window-nav__btn-group owd-window-nav__btn-group--prepend"
    >
      <slot name="prepend" />
    </div>

    <div
      v-if="windowController?.windowTitle"
      class="owd-window-nav__title"
    >
      <div
        class="owd-window-nav__title-inner text-ellipsis"
        v-text="windowController?.windowTitle"
      />
    </div>

    <div class="owd-window-nav__btn-group owd-window-nav__btn-group--append">
      <div
        v-if="$slots.append"
        class="owd-window-nav__btn-group owd-window-nav__btn-group--append-inner"
      >
        <slot name="append" />
      </div>

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
    </div>
  </DesktopCoreWindowNav>

  <ContextMenu ref="menu" :model="items" :pt="windowNavContextMenuPt" />
</template>

<style scoped>
@charset "UTF-8";
/* Layout only — colors in window-chrome.scss */
.owd-window-nav__btn-group {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--nova-window-nav-gap, 2px);
  padding: 0 var(--nova-window-nav-padding-x, 8px);
}
.owd-window-nav__title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 8px;
  text-align: left;
}
.owd-window-nav__title-inner {
  margin: 0;
  max-width: 100%;
}
</style>
