<template>
  <Button icon>
    <div class="owd-button__icon" />
  </Button>
</template>

<style scoped>
.owd-button__icon {
  width: 12px;
  height: 14px;
  top: 15px;
  left: 6px;
  position: relative;
}
.owd-button__icon:before {
  position: absolute;
  background: rgb(10, 10, 10);
  content: "";
}
.owd-button__icon:before {
  width: 100%;
  height: 3px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
