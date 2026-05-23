<script setup>
defineProps({
  iconPrepend: { type: String, required: false },
  iconAppend: { type: String, required: false }
});
</script>

<template>
  <div class="owd-system-bar__settings-menu__slider">
    <div v-if="iconPrepend" class="owd-system-bar__settings-menu__slider__icon-prepend">
      <Icon :name="iconPrepend" :size="20" />
    </div>
    <div class="owd-system-bar__settings-menu__slider__content">
      <slot />
    </div>
    <div v-if="iconAppend" class="owd-system-bar__settings-menu__slider__icon-append">
      <Icon :name="iconAppend" />
    </div>
  </div>
</template>

<style scoped>
.owd-system-bar__settings-menu__slider {
  display: flex;
  flex-direction: row;
}
.owd-system-bar__settings-menu__slider__icon-prepend {
  flex: 0;
  padding-right: 16px;
}
.owd-system-bar__settings-menu__slider__icon-append {
  flex: 0;
  padding-left: 16px;
}
.owd-system-bar__settings-menu__slider__content {
  flex: 1;
  align-content: center;
}
.owd-system-bar__settings-menu__slider .iconify {
  vertical-align: -3px;
}
</style>
