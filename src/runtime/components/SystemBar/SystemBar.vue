<script setup>
import { computed } from "vue";
import { useDesktopWorkspaceStore } from "@owdproject/core/runtime/stores/storeDesktopWorkspace";
const desktopWorkspaceStore = useDesktopWorkspaceStore();
const classes = computed(() => {
  const list = ["owd-desktop__system-bar"];
  if (desktopWorkspaceStore.overview) {
    list.push("owd-desktop__system-bar--workspace-overview-enabled");
  }
  return list;
});
</script>

<template>
  <div :class="classes">

    <div class="owd-desktop__system-bar__left">
      <SystemBarWorkspaces/>
      <SystemBarApplicationsMenu/>
    </div>

    <div class="owd-desktop__system-bar__middle">
      <SystemBarNotificationsMenu/>
    </div>

    <div class="owd-desktop__system-bar__right">
      <SystemBarSettingsMenu />
    </div>

  </div>
</template>

<style scoped>
.owd-desktop__system-bar {
  width: 100%;
  height: var(--owd-system-bar-height);
  padding: var(--owd-system-bar-padding);
  background: black;
  color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  transition: background 0.2s ease-in-out;
  position: relative;
  z-index: 10050;
}
.owd-desktop__system-bar--workspace-overview-enabled {
  background: transparent;
}
.owd-desktop__system-bar > div > div {
  display: inline-block;
}
.owd-desktop__system-bar__left {
  width: 20vw;
}
.owd-desktop__system-bar__left .owd-system-bar__button {
  margin-right: 4px;
}
.owd-desktop__system-bar__middle {
  flex: 1;
  text-align: center;
}
.owd-desktop__system-bar__right {
  width: 20vw;
  text-align: right;
}
.owd-desktop__system-bar__right .owd-system-bar__button {
  margin-left: 4px;
}
.owd-desktop__system-bar__right a {
  font-size: 11px;
}
.owd-desktop__system-bar__right a .v-icon {
  display: inline-block;
  margin-top: -4px;
}
@media (max-width: 800px) {
  .owd-desktop__system-bar__activities {
    display: none;
  }
}
</style>
