<script setup>
import { computed } from "vue";
const props = defineProps({
  density: { type: String, required: false }
});
const classes = computed(() => {
  const list = ["owd-list"];
  if (props.density) {
    list.push(`owd-list--density-${props.density}`);
  }
  return list;
});
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<style scoped>
.owd-list {
  width: 100%;
  text-align: left;
}
</style>
