<script setup>
const props = defineProps({
  config: { type: null, required: false },
  window: { type: null, required: false },
  src: { type: String, required: true }
});
</script>

<template>
  <DesktopWindow v-bind="$props">
    <iframe :src="src" />
  </DesktopWindow>
</template>

<style scoped>
iframe {
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
