<template>
  <DesktopCoreWindowContent>
    <slot />
  </DesktopCoreWindowContent>
</template>

<style scoped>
.owd-window__content--centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.owd-window__content--padded {
  padding: var(--owd-card-body-padding);
}
</style>
