<script setup>
import { ref, computed } from "vue";
import NovaSettingsSectionAppearance from "./sections/NovaSettingsSectionAppearance.vue";
import NovaSettingsSectionSound from "./sections/NovaSettingsSectionSound.vue";
import NovaSettingsSectionDesktop from "./sections/NovaSettingsSectionDesktop.vue";

const activeId = ref("appearance");

const sections = computed(() => [
  {
    id: "appearance",
    icon: "mdi:palette-outline",
    labelKey: "apps.settings.sections.appearance",
    component: NovaSettingsSectionAppearance,
  },
  {
    id: "sound",
    icon: "mdi:volume-high",
    labelKey: "apps.settings.sections.sound",
    component: NovaSettingsSectionSound,
  },
  {
    id: "desktop",
    icon: "mdi:monitor",
    labelKey: "apps.settings.sections.desktop",
    component: NovaSettingsSectionDesktop,
  },
]);

const activeSection = computed(
  () => sections.value.find((s) => s.id === activeId.value) ?? sections.value[0],
);
</script>

<template>
  <div class="nova-settings">
    <header class="nova-settings__hero">
      <h1 class="nova-settings__title">
        {{ $t("apps.settings.title") }}
      </h1>
      <p class="nova-settings__subtitle">
        {{ $t("apps.settings.subtitle") }}
      </p>
    </header>

    <div class="nova-settings__layout">
      <nav
        class="nova-settings__nav"
        :aria-label="$t('apps.settings.navLabel')"
      >
        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="nova-settings__nav-item"
          :class="{ 'nova-settings__nav-item--active': section.id === activeId }"
          @click="activeId = section.id"
        >
          <Icon :name="section.icon" :size="22" class="nova-settings__nav-icon" />
          <span>{{ $t(section.labelKey) }}</span>
        </button>
      </nav>

      <main class="nova-settings__main">
        <Transition name="nova-settings-panel" mode="out-in">
          <component
            :is="activeSection.component"
            :key="activeSection.id"
            class="nova-settings__panel"
          />
        </Transition>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nova-settings {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: clamp(28px, 5vw, 48px) clamp(28px, 5vw, 56px);
  gap: clamp(32px, 5vh, 48px);
  color: var(--owd-color, #e8eef6);
  box-sizing: border-box;
}

.nova-settings__hero {
  flex-shrink: 0;
}

.nova-settings__title {
  margin: 0;
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.nova-settings__subtitle {
  margin: clamp(10px, 1.5vh, 14px) 0 0;
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  font-weight: 400;
  opacity: 0.48;
  line-height: 1.45;
  max-width: 36rem;
}

.nova-settings__layout {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(140px, 188px) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 56px);
  align-items: start;
}

.nova-settings__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0;
  position: sticky;
  top: 0;
}

.nova-settings__nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 4px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: clamp(1rem, 1.5vw, 1.125rem);
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.15s ease, color 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &--active {
    opacity: 1;
    color: var(--owd-primary-color, #5eb8ff);
  }
}

.nova-settings__nav-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.nova-settings__main {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.nova-settings__panel {
  display: block;
}

/* Shared section layout (borderless groups) */
:deep(.nova-settings-section) {
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 8vh, 72px);
}

:deep(.nova-settings-group) {
  display: flex;
  flex-direction: column;
}

:deep(.nova-settings-group__head) {
  margin: 0 0 clamp(20px, 3vh, 32px);
}

:deep(.nova-settings-group__title) {
  margin: 0;
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

:deep(.nova-settings-group__desc) {
  margin: clamp(8px, 1vh, 12px) 0 0;
  font-size: clamp(0.95rem, 1.4vw, 1.0625rem);
  font-weight: 400;
  opacity: 0.45;
  line-height: 1.5;
  max-width: 32rem;
}

:deep(
  .nova-settings-group__content:not(.nova-settings-accent-grid):not(
      .nova-settings-volume
    )
) {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

:deep(.nova-settings-toggle) {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  cursor: pointer;
  max-width: 40rem;
}

:deep(.nova-settings-toggle__text) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

:deep(.nova-settings-toggle__label) {
  font-size: clamp(1.05rem, 1.6vw, 1.2rem);
  font-weight: 500;
  line-height: 1.3;
}

:deep(.nova-settings-toggle__hint) {
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  opacity: 0.45;
  line-height: 1.45;
}

:deep(.nova-settings-stat) {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px 24px;
  margin: 0;
  padding: 0;
}

:deep(.nova-settings-stat__label) {
  font-size: clamp(1rem, 1.4vw, 1.125rem);
  opacity: 0.45;
}

:deep(.nova-settings-stat__value) {
  font-size: clamp(1.1rem, 1.6vw, 1.25rem);
  font-weight: 600;
}

:deep(.nova-settings-note) {
  margin: 0;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  opacity: 0.4;
  line-height: 1.5;
  max-width: 32rem;
}

.nova-settings-panel-enter-active,
.nova-settings-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nova-settings-panel-enter-from,
.nova-settings-panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 900px) {
  .nova-settings {
    padding: clamp(20px, 4vw, 28px) clamp(20px, 4vw, 32px);
    gap: clamp(24px, 4vh, 36px);
  }

  .nova-settings__layout {
    grid-template-columns: minmax(120px, 160px) minmax(0, 1fr);
    gap: clamp(20px, 4vw, 32px);
  }

  .nova-settings__title {
    font-size: clamp(1.65rem, 5vw, 2.1rem);
  }
}

@media (max-width: 640px) {
  .nova-settings {
    padding: 20px 16px 28px;
    gap: 20px;
  }

  .nova-settings__hero {
    padding-bottom: 4px;
  }

  .nova-settings__subtitle {
    max-width: none;
  }

  .nova-settings__layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .nova-settings__nav {
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    position: static;
    gap: 4px;
    margin: 0 -4px;
    padding: 0 4px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .nova-settings__nav-item {
    flex: 0 0 auto;
    width: auto;
    white-space: nowrap;
    padding: 10px 12px;
    font-size: 0.95rem;
    opacity: 0.5;

    &--active {
      opacity: 1;
      box-shadow: inset 0 -2px 0 var(--owd-primary-color, #5eb8ff);
    }
  }

  :deep(.nova-settings-section) {
    gap: clamp(32px, 6vh, 48px);
  }

  :deep(.nova-settings-group__title) {
    font-size: 1.2rem;
  }

  :deep(.nova-settings-toggle) {
    max-width: none;
  }
}

@media (max-width: 400px) {
  .nova-settings__title {
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nova-settings-panel-enter-active,
  .nova-settings-panel-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
