<script setup>
import { computed, inject } from "vue";
const windowController = inject("windowController");
const icon = computed(
  () => windowController?.isMaximized ? "mdi:window-restore" : "mdi:window-maximize"
);
</script>

<template>
  <DesktopWindowNavButton title="Maximize" class="owd-window-nav__button--maximize">
    <Icon :name="icon" :size="14" />
  </DesktopWindowNavButton>
</template>
