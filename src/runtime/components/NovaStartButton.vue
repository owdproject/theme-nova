<script setup>
import { computed } from "vue";
import { useAppConfig } from "nuxt/app";
import { useNovaStartMenu } from "../composables/useNovaStartMenu";

const { open, toggle } = useNovaStartMenu();
const appConfig = useAppConfig();

const startImg = computed(() => appConfig.desktop?.nova?.startButton?.img);
const startImgStyle = computed(() => appConfig.desktop?.nova?.startButton?.imgStyle);
const startIcon = computed(() => appConfig.desktop?.nova?.startButton?.icon ?? "mdi:view-grid-outline");
const hasCustomLabel = computed(() => appConfig.desktop?.nova?.startButton?.label !== undefined);
const startLabel = computed(() => appConfig.desktop?.nova?.startButton?.label);
const startLabelStyle = computed(() => appConfig.desktop?.nova?.startButton?.labelStyle);
</script>

<template>
  <button
    type="button"
    class="nova-start-btn"
    :class="{ 'nova-start-btn--active': open }"
    :aria-expanded="open"
    aria-haspopup="dialog"
    @click.stop="toggle()"
  >
    <img
      v-if="startImg"
      :src="startImg"
      :style="startImgStyle"
      aria-hidden="true"
    />
    <Icon
      v-else
      :name="startIcon"
      :size="18"
      class="nova-start-btn__icon"
      aria-hidden="true"
    />
    <span class="nova-start-btn__label" :style="startLabelStyle">
      <template v-if="hasCustomLabel">{{ startLabel }}</template>
      <template v-else>{{ $t("systemBar.start.button") }}</template>
    </span>
  </button>
</template>
