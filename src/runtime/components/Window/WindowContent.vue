<template>
  <CoreWindowContent>
    <slot />
  </CoreWindowContent>
</template>

<style scoped>
.owd-window__content--centered {
  align-content: center;
}
.owd-window__content--padded {
  padding: var(--owd-card-body-padding);
}
</style>
