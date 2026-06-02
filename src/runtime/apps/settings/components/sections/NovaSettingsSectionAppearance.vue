<script setup>
import {
  useNovaAccentTheme,
  NOVA_ACCENT_ORDER,
  NOVA_ACCENT_META,
} from "../../../../composables/useNovaAccentTheme";
import { useNovaMotion } from "../../../../composables/useNovaMotion";

const { accentId, setAccent } = useNovaAccentTheme();
const { enabled: motionEnabled, setEnabled: setMotionEnabled } = useNovaMotion();

function accentLabel(id) {
  return `systemBar.tray.accents.${id}`;
}
</script>

<template>
  <div class="nova-settings-section">
    <section class="nova-settings-group">
      <header class="nova-settings-group__head">
        <h2 class="nova-settings-group__title">
          {{ $t("apps.settings.appearance.accentTitle") }}
        </h2>
        <p class="nova-settings-group__desc">
          {{ $t("apps.settings.appearance.accentDesc") }}
        </p>
      </header>
      <div
        class="nova-settings-group__content nova-settings-accent-grid"
        role="radiogroup"
        :aria-label="$t('apps.settings.appearance.accentTitle')"
      >
        <button
          v-for="id in NOVA_ACCENT_ORDER"
          :key="id"
          type="button"
          role="radio"
          class="nova-settings-accent"
          :class="{ 'nova-settings-accent--active': accentId === id }"
          :aria-checked="accentId === id"
          @click="setAccent(id)"
        >
          <span class="nova-settings-accent__swatch" :data-accent="id">
            <Icon :name="NOVA_ACCENT_META[id].icon" :size="32" />
          </span>
          <span class="nova-settings-accent__label">{{
            $t(accentLabel(id))
          }}</span>
        </button>
      </div>
    </section>

    <section class="nova-settings-group">
      <header class="nova-settings-group__head">
        <h2 class="nova-settings-group__title">
          {{ $t("apps.settings.appearance.motionTitle") }}
        </h2>
        <p class="nova-settings-group__desc">
          {{ $t("apps.settings.appearance.motionDesc") }}
        </p>
      </header>
      <div class="nova-settings-group__content">
        <label class="nova-settings-toggle">
          <ToggleSwitch
            :model-value="motionEnabled"
            @update:model-value="setMotionEnabled"
          />
          <span class="nova-settings-toggle__text">
            <span class="nova-settings-toggle__label">{{
              $t("apps.settings.appearance.motionLabel")
            }}</span>
            <span class="nova-settings-toggle__hint">{{
              $t("apps.settings.appearance.motionHint")
            }}</span>
          </span>
        </label>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.nova-settings-accent-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(12px, 2vw, 20px);
  width: 100%;
  max-width: min(36rem, 100%);
}

@media (max-width: 520px) {
  .nova-settings-accent-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.nova-settings-accent {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: clamp(20px, 3vw, 28px) 16px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.12s ease;

  &:hover {
    opacity: 0.92;
    transform: translateY(-2px);
  }

  &--active {
    .nova-settings-accent__swatch {
      box-shadow: 0 0 0 3px var(--nova-accent-focus-ring, rgba(26, 108, 175, 0.5));
    }

    .nova-settings-accent__label {
      opacity: 1;
      color: var(--owd-primary-color, #5eb8ff);
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

.nova-settings-accent__swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(72px, 10vw, 88px);
  height: clamp(72px, 10vw, 88px);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.06);
  transition: box-shadow 0.15s ease, background 0.15s ease;

  &[data-accent="ocean"] {
    color: #5eb8ff;
    background: rgba(26, 108, 175, 0.22);
  }
  &[data-accent="ember"] {
    color: #fb7185;
    background: rgba(190, 24, 72, 0.18);
  }
  &[data-accent="forest"] {
    color: #4ade80;
    background: rgba(34, 139, 72, 0.18);
  }
  &[data-accent="violet"] {
    color: #c4b5fd;
    background: rgba(124, 58, 237, 0.18);
  }
}

.nova-settings-accent__label {
  font-size: clamp(0.95rem, 1.3vw, 1.0625rem);
  font-weight: 500;
  text-align: center;
  line-height: 1.25;
  opacity: 0.65;
  transition: opacity 0.15s ease, color 0.15s ease;
}
</style>
