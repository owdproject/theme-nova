<script setup>
import { ref, watch, computed } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useDesktopVolumeStore } from "@owdproject/core/runtime/stores/storeDesktopVolume";

const desktopVolumeStore = useDesktopVolumeStore();
const volume = ref(desktopVolumeStore.master);

const saveMasterVolumeDebounced = useDebounceFn(
  () => desktopVolumeStore.setMasterVolume(volume.value),
  250,
);

watch(volume, () => saveMasterVolumeDebounced());

const volumeIcon = computed(() => {
  if (volume.value <= 0) return "mdi:volume-off";
  if (volume.value < 35) return "mdi:volume-low";
  if (volume.value < 70) return "mdi:volume-medium";
  return "mdi:volume-high";
});
</script>

<template>
  <div class="nova-settings-section">
    <section class="nova-settings-group">
      <header class="nova-settings-group__head">
        <h2 class="nova-settings-group__title">
          {{ $t("apps.settings.sound.title") }}
        </h2>
        <p class="nova-settings-group__desc">
          {{ $t("apps.settings.sound.desc") }}
        </p>
      </header>
      <div class="nova-settings-group__content nova-settings-volume">
        <Icon :name="volumeIcon" :size="32" class="nova-settings-volume__icon" />
        <div class="nova-settings-volume__slider-wrap">
          <Slider
            v-model="volume"
            :min="0"
            :max="100"
            class="nova-prime-slider"
          />
        </div>
        <span class="nova-settings-volume__value">{{ volume }}%</span>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.nova-settings-volume {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(16px, 2.5vw, 24px);
  width: 100%;
  max-width: none;
  padding: 4px 0 8px;
}

.nova-settings-volume__icon {
  flex-shrink: 0;
  opacity: 0.65;
}

.nova-settings-volume__slider {
  width: 100%;
  margin-inline-end: 8px;
}

.nova-settings-volume__value {
  flex-shrink: 0;
  min-width: 3.25rem;
  font-size: clamp(1.1rem, 1.8vw, 1.35rem);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-align: right;
  opacity: 0.75;
}

@media (max-width: 480px) {
  .nova-settings-volume {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    row-gap: 12px;
  }

  .nova-settings-volume__slider-wrap {
    grid-column: 1 / -1;
  }

  .nova-settings-volume__value {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
  }
}
</style>
