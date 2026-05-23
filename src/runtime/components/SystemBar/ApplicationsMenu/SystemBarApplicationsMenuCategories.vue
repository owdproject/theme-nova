<script setup>
const props = defineProps({
  categories: { type: Array, required: true },
  active: { type: String, required: false }
});
const emit = defineEmits(["select"]);
function onCategorySelect(category) {
  emit("select", category);
}
</script>

<template>
  <List>
    <ListItem
      v-for="category of categories"
      :key="category"
      :class="{ 'owd-system-bar__category--active': category === props.active }"
      @mouseenter="onCategorySelect(category)"
      @click="onCategorySelect(category)"
    >
      {{ $t(`applications.categories.${category}`) }}
    </ListItem>
  </List>
</template>

<style scoped>
.owd-system-bar__category--active,
.owd-list-item:hover {
  border-radius: 8px;
  background: rgba(var(--owd-hover-background-color));
}
</style>
