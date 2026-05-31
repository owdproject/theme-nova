<script setup>
import { inject } from "vue";
import ContextMenu from "primevue/contextmenu";
import ButtonWindowNavMinimize from "../Button/ButtonWindowNavMinimize.vue";
import ButtonWindowNavMaximize from "../Button/ButtonWindowNavMaximize.vue";
import ButtonWindowNavClose from "../Button/ButtonWindowNavClose.vue";
import { useWindowNavContextMenu } from "../../composables/useWindowNavContextMenu";
const windowController = inject("windowController");
const { menu, items, onNavContextMenu } = useWindowNavContextMenu(windowController);
const windowNavContextMenuPt = {
  root: { class: "nova-window-nav-context-menu" }
};
function onWindowMinimize() {
  if (!windowController?.instanced) return;
  windowController.actions.minimize();
}
function onWindowMaximize() {
  if (!windowController?.instanced) return;
  windowController.actions.toggleMaximize();
}
function onWindowNavDestroy() {
  if (!windowController?.instanced) return;
  windowController.actions.destroy();
}
</script>

<template>
  <DesktopWindowNav
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
      v-if="windowController?.title"
      class="owd-window-nav__title"
    >
      <div
        class="owd-window-nav__title-inner text-ellipsis"
        v-text="windowController?.title"
      />
    </div>

    <div class="owd-window-nav__btn-group owd-window-nav__btn-group--append">
      <slot name="append" />

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
  </DesktopWindowNav>

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
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 8px;
  text-align: center;
}
.owd-window-nav__title-inner {
  margin: 0 auto;
  max-width: 100%;
}
</style>
