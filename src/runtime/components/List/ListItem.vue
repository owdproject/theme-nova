<template>
  <div class="owd-list-item">
    <slot />
  </div>
</template>

<style scoped>
.owd-list-item {
  width: 100%;
  cursor: pointer;
  padding: 8px 16px;
}
.owd-list-item:hover {
  background: var(--owd-elevation-inactive);
}
</style>
