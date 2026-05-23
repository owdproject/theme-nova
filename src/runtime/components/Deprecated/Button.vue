<script setup>
const props = defineProps({
  primary: { type: Boolean, required: false },
  bolded: { type: Boolean, required: false },
  disabled: { type: Boolean, required: false },
  active: { type: Boolean, required: false },
  size: { type: String, required: false },
  icon: { type: Boolean, required: false }
});
const classes = computed(() => {
  const list = ["owd-button"];
  if (props.primary) {
    list.push("owd-button--primary");
  }
  if (props.bolded) {
    list.push("owd-button--bolded");
  }
  if (props.disabled) {
    list.push("owd-button--disabled");
  }
  if (props.active) {
    list.push("owd-button--active");
  }
  if (props.size) {
    list.push(`owd-button--size-${props.size}`);
  }
  if (props.icon) {
    list.push("owd-button--icon");
  }
  return list;
});
</script>

<template>
  <Card :class="classes">
    <slot />
  </Card>
</template>

<style scoped>
.owd-button {
  position: relative;
  display: inline-block;
  min-width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 17px;
  border: 0;
  padding: 0;
  border: 1px solid #1b1b1b #1b1b1b #151515 #1b1b1b;
}
.owd-button:active :deep(.owd-button__icon), .owd-button--active :deep(.owd-button__icon) {
  margin-top: 2px;
}
.owd-button:not(.owd-button--disabled) {
  cursor: pointer;
}
.owd-button--primary:before {
  left: 2px;
  top: 2px;
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  outline: var(--owd-win95-sheet-color) solid 2px;
}
.owd-button--bolded {
  font-weight: bold;
}
.owd-button--disabled {
  color: rgb(132, 133, 132);
  text-shadow: rgb(254, 254, 254) 1px 1px;
}
.owd-button:not(.owd-button--icon) {
  padding: 0 8px;
}
.owd-button--size-sb {
  height: 34px;
  line-height: 36px;
}
.owd-button--size-sm {
  min-width: 24px;
  height: 24px;
}
.owd-button--size-lg {
  min-width: 44px;
  height: 44px;
}
.owd-button :deep(.iconify) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: black;
}
</style>
