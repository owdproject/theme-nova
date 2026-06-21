<script setup>
defineProps({
  title: { type: String, required: false },
});
</script>

<template>
  <DesktopWindowNavButton :title="title">
    <slot />
  </DesktopWindowNavButton>
</template>
