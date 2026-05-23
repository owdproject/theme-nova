<script setup>
defineProps({
  entry: { type: null, required: true }
});
</script>

<template>
  <ListItem>
    <Icon :name="entry.icon" />
    {{ entry.title }}
  </ListItem>
</template>

<style scoped>
.iconify {
  vertical-align: -3px;
  font-size: 18px;
  margin-right: 8px;
}
</style>
