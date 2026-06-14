<script setup>
import WindowSnapHintsBase from '@owdproject/core/runtime/components/window/DesktopCoreWindowSnapHintsBase.vue'

const zoneIcons = {
  maximize: "mdi:window-maximize",
  "left-half": "mdi:arrow-expand-left",
  "right-half": "mdi:arrow-expand-right",
  "bottom-half": "mdi:arrow-expand-down",
  "top-left": "mdi:arrow-top-left",
  "top-right": "mdi:arrow-top-right",
  "bottom-left": "mdi:arrow-bottom-left",
  "bottom-right": "mdi:arrow-bottom-right",
};
</script>

<template>
  <WindowSnapHintsBase v-slot="{ zone }">
    <div class="nova-window-snap-hints__chrome">
      <Icon
        v-if="zoneIcons[zone]"
        :name="zoneIcons[zone]"
        :size="32"
        aria-hidden="true"
      />
    </div>
  </WindowSnapHintsBase>
</template>

<style scoped>
.nova-window-snap-hints__chrome {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.92);
  background: color-mix(
    in srgb,
    var(--nova-accent, #60a5fa) 32%,
    transparent
  );
  backdrop-filter: blur(10px);
  border-radius: inherit;
}

:deep(.owd-window-snap-hints__zone) {
  border-color: color-mix(in srgb, var(--nova-accent, #60a5fa) 85%, white);
  background: color-mix(in srgb, var(--nova-accent, #60a5fa) 18%, transparent);
}
</style>
