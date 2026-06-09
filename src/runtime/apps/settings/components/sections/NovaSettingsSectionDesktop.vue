<script setup>
import { computed } from "vue";
import { useRuntimeConfig } from "nuxt/app";
import { useApplicationManager } from "@owdproject/core/runtime/composables/useApplicationManager";

const runtimeConfig = useRuntimeConfig();
const applicationManager = useApplicationManager();

const coreVersion = computed(
  () => runtimeConfig.public.desktop?.coreVersion ?? "—",
);

async function openAbout() {
  await applicationManager.execAppCommand("org.owdproject.about", "about");
}
</script>

<template>
  <div class="nova-settings-section">
    <section class="nova-settings-group">
      <header class="nova-settings-group__head">
        <h2 class="nova-settings-group__title">
          {{ $t("apps.settings.desktop.aboutTitle") }}
        </h2>
        <p class="nova-settings-group__desc">
          {{ $t("apps.settings.desktop.aboutDesc") }}
        </p>
      </header>
      <div class="nova-settings-group__content nova-settings-about">
        <div
          class="nova-settings-about__version"
          :aria-label="$t('apps.settings.desktop.version')"
        >
          <span class="nova-settings-about__product">Open Web Desktop</span>
          <span class="nova-settings-about__number">{{ coreVersion }}</span>
        </div>
        <button
          type="button"
          class="nova-settings-about__row"
          @click="openAbout"
        >
          <span class="nova-settings-about__row-label">{{
            $t("apps.settings.desktop.openAbout")
          }}</span>
          <Icon name="mdi:chevron-right" :size="22" aria-hidden="true" />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.nova-settings-about {
  gap: clamp(20px, 3vh, 28px) !important;
  max-width: min(36rem, 100%);
}

.nova-settings-about__version {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nova-settings-about__product {
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.4;
}

.nova-settings-about__number {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 300;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--owd-color, #e8eef6);
}

.nova-settings-about__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  margin: 0;
  padding: 14px 2px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  opacity: 0.88;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: none;
    opacity: 1;
    box-shadow: inset 0 -2px 0 var(--owd-primary-color, #5eb8ff);
  }

  :deep(.iconify) {
    flex-shrink: 0;
    opacity: 0.45;
    transition: opacity 0.15s ease, transform 0.15s ease;
  }

  &:hover :deep(.iconify) {
    opacity: 0.75;
    transform: translateX(2px);
  }
}

.nova-settings-about__row-label {
  flex: 1;
  min-width: 0;
}
</style>
