<script setup>
import DockBarButton from "./DockBarButton.vue";
import { useNovaStartMenu } from "../../composables/useNovaStartMenu";
const { open, toggle } = useNovaStartMenu();
</script>

<template>
  <DockBarButton
    class="owd-dock-bar__button-menu"
    :class="{ 'owd-dock-bar__button-menu--active': open }"
    :aria-expanded="open"
    aria-haspopup="dialog"
    :aria-label="$t('systemBar.start.panelLabel')"
    @click.stop="toggle()"
  >
    <Icon name="lucide:grip" :size="22" />
  </DockBarButton>
</template>

<style scoped>
.owd-dock-bar__button-menu {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  transition: background 0.15s ease;
}
.owd-dock-bar__button-menu:hover {
  background: rgba(255, 255, 255, 0.08);
}
.owd-dock-bar__button-menu--active {
  background: var(--nova-accent-muted, rgba(26, 108, 175, 0.35));
}
</style>
