<script setup>
defineProps({
  application: { type: null, required: true }
});
</script>

<template>
  <ListItem>
    {{application.config.name}}
  </ListItem>
</template>
