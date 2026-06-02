<script setup>
import { useTemplateRef } from "vue";
const props = defineProps({
  size: { type: String, required: false },
  launcher: { type: Boolean, default: false },
  placeholder: { type: String, required: false },
  ariaLabel: { type: String, required: false },
});
const model = defineModel({ type: String, ...{ required: true } });
const inputRef = useTemplateRef("inputRef");
function focus() {
  inputRef.value?.focus();
}
defineExpose({ focus });
</script>

<template>
  <label
    class="nova-start-search"
    :class="{
      'nova-start-search--large': size === 'large',
      'nova-start-search--launcher': launcher,
    }"
  >
    <Icon
      name="mdi:magnify"
      :size="launcher ? 26 : size === 'large' ? 28 : 20"
      class="nova-start-search__icon"
      aria-hidden="true"
    />
    <input
      ref="inputRef"
      v-model="model"
      type="search"
      class="nova-start-search__input"
      :placeholder="placeholder"
      :aria-label="ariaLabel ?? placeholder"
      autocomplete="off"
      :enterkeyhint="size === 'large' ? 'search' : void 0"
    />
  </label>
</template>
