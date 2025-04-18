<script setup lang="ts">
import '#/desktop.config'

const props = defineProps<{
  systemBar?: DesktopSystemBarConfig
}>()

const desktop = useDesktopManager()
const desktopWorkspaceStore = useDesktopWorkspaceStore()
</script>

<template>
  <CoreDesktop
      v-bind="$props"
      :class="{
        'owd-desktop--overview-enabled': desktopWorkspaceStore.overview
    }"
  >

    <!--
    <SystemBar
        v-if="desktop.config.systemBar?.enabled"
    />
    -->

    <Background/>

    <DesktopContent>
      <CoreApplicationRender/>
      <slot/>
    </DesktopContent>

    <DockBar v-if="desktop.config.dockBar?.enabled"/>

  </CoreDesktop>
</template>

<style lang="scss">
@use '../assets/styles/index.scss';

.owd-desktop {
  background: var(--owd-surface-900);
  font-family: var(--owd-font-family), serif;
  color: var(--owd-color);
  overflow: hidden;

  /*
  display: flex;
  flex-direction: column;

  &__system-bar {
    flex: 0;

    &--position-bottom {
      flex-direction: column-reverse;
    }
  }

  &__workspace-container {
    flex: 1;
    overflow: hidden;
  }

   */
}
</style>