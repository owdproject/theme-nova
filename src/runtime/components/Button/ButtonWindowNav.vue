<script setup>
defineProps({
  title: { type: String, required: false }
});
</script>

<template>
  <div
    class="owd-window-nav__button"
    role="button"
    tabindex="0"
    :title="title"
    :aria-label="title"
  >
    <slot />
  </div>
</template>

<style scoped>
@charset "UTF-8";
/* Sizing only — hover/focus colors in window-chrome.scss */
.owd-window-nav__button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--nova-window-control-size, 28px);
  height: var(--nova-window-control-size, 28px);
  padding: 0;
  cursor: pointer;
}
.owd-window-nav__button :deep(.iconify) {
  position: relative;
  pointer-events: none;
}
</style>
