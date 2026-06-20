<script setup>
import { useWindowDragHandlers } from "@owdproject/core/runtime/composables/useWindowDragHandlers";
const props = defineProps({
  config: { type: null, required: false },
  window: { type: null, required: false },
  content: { type: null, required: false }
});
const { onDragStart, onDragEnd } = useWindowDragHandlers(
  () => props.window
);
</script>

<template>
  <DesktopCoreWindow
    v-bind="$props"
    v-show="window?.state?.active !== false"
    @drag:start="onDragStart"
    @drag:end="onDragEnd"
  >
    <Card border rounded :pt:body="{ class: 'p-0' }">
      <template #header>
        <DesktopWindowNav>
          <template #prepend>
            <slot name="nav-prepend" />
          </template>

          <template #append>
            <slot name="nav-append" />
          </template>
        </DesktopWindowNav>
      </template>
      <template #content>
        <DesktopCoreWindowContent>
          <slot />
        </DesktopCoreWindowContent>
      </template>
    </Card>
  </DesktopCoreWindow>
</template>

<style scoped>
/* Chrome colors live in assets/styles/partials/window-chrome.scss */
.owd-window {
  box-sizing: border-box;
  min-width: 160px;
  min-height: 160px;
}
</style>
