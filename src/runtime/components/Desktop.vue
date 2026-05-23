<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { useAppConfig } from "nuxt/app";
import { useDesktopWorkspaceStore } from "@owdproject/core/runtime/stores/storeDesktopWorkspace";
import NovaTopBar from "./NovaTopBar.vue";
import NovaLauncherOverlay from "./NovaLauncherOverlay.vue";
import NovaWorkspaceStack from "./NovaWorkspaceStack.vue";
import NovaWorkspaceEdgeHints from "./NovaWorkspaceEdgeHints.vue";
import { useNovaStartMenu } from "../composables/useNovaStartMenu";
import { useNovaAccentTheme } from "../composables/useNovaAccentTheme";
import { useNovaWorkspaces } from "../composables/useNovaWorkspaces";
const { open: startMenuOpen, close: closeStartMenu } = useNovaStartMenu();
const { accentId } = useNovaAccentTheme();
const { enabled: workspacesEnabled } = useNovaWorkspaces();
const props = defineProps({
  systemBar: { type: null, required: false }
});
const appConfig = useAppConfig();
const desktopWorkspaceStore = useDesktopWorkspaceStore();
const BODY_SHELL_CLASS = "owd-has-nova-desktop";
watch(
  accentId,
  (id) => {
    if (!import.meta.client) return;
    document.body.setAttribute("data-nova-accent", id);
  },
  { immediate: true }
);
watch(startMenuOpen, (isOpen) => {
  if (isOpen && desktopWorkspaceStore.overview) {
    desktopWorkspaceStore.setOverview(false);
  }
});
watch(
  () => desktopWorkspaceStore.overview,
  (isOpen) => {
    if (isOpen) closeStartMenu();
  }
);
onMounted(() => {
  document.body.classList.add(BODY_SHELL_CLASS);
});
onUnmounted(() => {
  document.body.classList.remove(BODY_SHELL_CLASS);
  document.body.removeAttribute("data-nova-accent");
});
</script>

<template>
  <CoreDesktop
    v-bind="$props"
    :workspaces="appConfig.desktop?.workspaces"
    class="owd-desktop--nova"
    :class="{
  'owd-desktop--overview-enabled': desktopWorkspaceStore.overview
}"
    :data-nova-accent="accentId"
  >

    <NovaTopBar />

    <NovaWorkspaceEdgeHints v-if="workspacesEnabled" />

    <div class="nova-shell__stage">
      <Background />

      <NovaWorkspaceStack v-if="workspacesEnabled">
        <slot />
      </NovaWorkspaceStack>

      <template v-else>
        <DesktopContent>
          <slot />
        </DesktopContent>
        <CoreApplicationRender />
      </template>
    </div>

    <DockBar v-if="appConfig.desktop?.dockBar?.enabled" />

    <NovaLauncherOverlay v-if="startMenuOpen" />

    <NovaConfirmDialogs />

  </CoreDesktop>
</template>

<style>
@charset "UTF-8";
/* Default accent (ocean) — also applied when data-nova-accent is unset */
.owd-desktop--nova,
body.owd-has-nova-desktop {
  --nova-accent: var(--owd-primary-color);
  --nova-shell-bar-bg: rgba(6, 10, 16, 0.92);
  --nova-shell-dock-bg: rgba(6, 10, 16, 0.88);
  --nova-accent-muted: rgba(26, 108, 175, 0.32);
  --nova-accent-focus-ring: rgba(26, 108, 175, 0.45);
  --nova-window-header-focused-bg: rgba(14, 24, 38, 0.96);
  --nova-window-frame-bg: rgba(6, 10, 16, 0.94);
  --nova-window-header-bg: rgba(6, 10, 16, 0.92);
  --nova-window-body-bg: rgba(10, 14, 22, 0.98);
  /* Apps launcher (teleported to body) */
  --nova-start-surface: rgba(12, 18, 28, 0.96);
  --nova-start-surface-elevated: rgba(26, 108, 175, 0.1);
  --nova-start-tile-icon-bg: rgba(26, 108, 175, 0.14);
  --nova-start-active-text: #e8f4fc;
  --nova-launcher-backdrop: rgba(4, 10, 18, 0.48);
  /* PrimeVue surfaces inside the Nova shell follow the active accent */
  --p-primary-color: var(--owd-primary-color);
  --p-primary-hover-color: var(--owd-primary-hover-color);
  --p-button-primary-background: var(--owd-button-primary-active-background);
  --p-button-primary-hover-background: var(--owd-primary-hover-color);
  --p-button-primary-active-background: var(--owd-button-primary-active-background);
  --p-button-primary-border-color: var(--owd-button-primary-active-border-color);
  --p-focus-ring-color: var(--nova-accent-focus-ring);
  --p-focus-ring-shadow: 0 0 0 2px var(--nova-accent-focus-ring);
  --p-card-background: var(--nova-window-frame-bg);
  --p-card-border-color: var(--owd-surface-700);
  --p-content-background: var(--nova-window-frame-bg);
  --p-content-border-color: var(--owd-surface-700);
  --owd-surface-700: #1d293d;
  --owd-surface-900: rgba(6, 10, 16, 0.9);
  --owd-primary-color: #1a6caf;
  --owd-primary-hover-color: #1a6caf;
  --owd-button-primary-active-background: #4593d8;
  --owd-button-primary-active-border-color: #4593d8;
}

.owd-desktop--nova[data-nova-accent=ember],
body.owd-has-nova-desktop[data-nova-accent=ember] {
  --nova-accent: var(--owd-primary-color);
  --nova-shell-bar-bg: rgba(14, 6, 8, 0.92);
  --nova-shell-dock-bg: rgba(18, 8, 10, 0.88);
  --nova-accent-muted: rgba(159, 18, 57, 0.38);
  --nova-accent-focus-ring: rgba(190, 24, 72, 0.5);
  --nova-window-header-focused-bg: rgba(38, 14, 20, 0.96);
  --nova-window-frame-bg: rgba(14, 6, 8, 0.94);
  --nova-window-header-bg: rgba(14, 6, 8, 0.92);
  --nova-window-body-bg: rgba(28, 10, 16, 0.98);
  --nova-start-surface: rgba(18, 8, 12, 0.96);
  --nova-start-surface-elevated: rgba(190, 24, 72, 0.12);
  --nova-start-tile-icon-bg: rgba(190, 24, 72, 0.18);
  --nova-start-active-text: #fce8ef;
  --nova-launcher-backdrop: rgba(12, 4, 8, 0.52);
  --owd-surface-700: #3d1d28;
  --owd-surface-900: rgba(14, 6, 8, 0.92);
  --owd-primary-color: #9f1239;
  --owd-primary-hover-color: #be123c;
  --owd-button-primary-active-background: #e11d48;
  --owd-button-primary-active-border-color: #e11d48;
}

.owd-desktop--nova[data-nova-accent=forest],
body.owd-has-nova-desktop[data-nova-accent=forest] {
  --nova-accent: var(--owd-primary-color);
  --nova-shell-bar-bg: rgba(6, 14, 10, 0.92);
  --nova-shell-dock-bg: rgba(8, 16, 12, 0.88);
  --nova-accent-muted: rgba(22, 101, 52, 0.36);
  --nova-accent-focus-ring: rgba(34, 139, 72, 0.48);
  --nova-window-header-focused-bg: rgba(14, 32, 22, 0.96);
  --nova-window-frame-bg: rgba(6, 12, 9, 0.94);
  --nova-window-header-bg: rgba(6, 12, 9, 0.92);
  --nova-window-body-bg: rgba(10, 24, 16, 0.98);
  --nova-start-surface: rgba(8, 16, 12, 0.96);
  --nova-start-surface-elevated: rgba(34, 139, 72, 0.1);
  --nova-start-tile-icon-bg: rgba(34, 139, 72, 0.16);
  --nova-start-active-text: #e8fcef;
  --nova-launcher-backdrop: rgba(4, 12, 8, 0.5);
  --owd-surface-700: #1d3d2a;
  --owd-surface-900: rgba(6, 12, 9, 0.92);
  --owd-primary-color: #166534;
  --owd-primary-hover-color: #15803d;
  --owd-button-primary-active-background: #22c55e;
  --owd-button-primary-active-border-color: #22c55e;
}

.owd-desktop--nova[data-nova-accent=violet],
body.owd-has-nova-desktop[data-nova-accent=violet] {
  --nova-shell-bar-bg: rgba(10, 6, 16, 0.92);
  --nova-shell-dock-bg: rgba(12, 8, 18, 0.88);
  --nova-accent-muted: rgba(109, 40, 217, 0.34);
  --nova-accent-focus-ring: rgba(124, 58, 237, 0.48);
  --nova-window-header-focused-bg: rgba(24, 14, 38, 0.96);
  --nova-window-frame-bg: rgba(10, 6, 16, 0.94);
  --nova-window-header-bg: rgba(10, 6, 16, 0.92);
  --nova-window-body-bg: rgba(18, 10, 28, 0.98);
  --nova-start-surface: rgba(14, 8, 20, 0.96);
  --nova-start-surface-elevated: rgba(124, 58, 237, 0.1);
  --nova-start-tile-icon-bg: rgba(124, 58, 237, 0.16);
  --nova-start-active-text: #f0e8fc;
  --nova-launcher-backdrop: rgba(8, 4, 14, 0.5);
  --owd-surface-700: #2a1d3d;
  --owd-surface-900: rgba(10, 6, 16, 0.92);
  --owd-primary-color: #6d28d9;
  --owd-primary-hover-color: #7c3aed;
  --owd-button-primary-active-background: #8b5cf6;
  --owd-button-primary-active-border-color: #8b5cf6;
}

/* Nova UI portaled to document.body (launcher, quick settings). */
.owd-desktop--nova, body.owd-has-nova-desktop {
  --nova-start-panel-radius: 14px;
  --nova-start-tile-radius: 12px;
  --nova-start-search-radius: 10px;
  --nova-start-border: var(--owd-surface-700);
  --nova-start-hover: rgba(255, 255, 255, 0.08);
  --nova-start-active: var(--nova-accent-muted);
  --owd-color: #e8eef6;
}

.owd-desktop--nova .nova-launcher, body.owd-has-nova-desktop .nova-launcher {
  position: fixed;
  inset: 0;
  z-index: 10070;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  box-sizing: border-box;
  color: var(--owd-color, #e8eef6);
}
.owd-desktop--nova .nova-launcher__backdrop, body.owd-has-nova-desktop .nova-launcher__backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 0;
  padding: 0;
  margin: 0;
  background: var(--nova-launcher-backdrop);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  cursor: pointer;
}
.owd-desktop--nova .nova-launcher__panel, body.owd-has-nova-desktop .nova-launcher__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  margin: 12px;
  border-radius: var(--nova-start-panel-radius);
  background: var(--nova-start-surface);
  border: 1px solid var(--nova-start-border);
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}
.owd-desktop--nova .nova-launcher__header, body.owd-has-nova-desktop .nova-launcher__header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 14px 10px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.owd-desktop--nova .nova-launcher__header-row, body.owd-has-nova-desktop .nova-launcher__header-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.owd-desktop--nova .nova-launcher__heading, body.owd-has-nova-desktop .nova-launcher__heading {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.2;
}
.owd-desktop--nova .nova-launcher__close, body.owd-has-nova-desktop .nova-launcher__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background 0.15s ease;
}
.owd-desktop--nova .nova-launcher__close:hover, body.owd-has-nova-desktop .nova-launcher__close:hover {
  background: var(--nova-start-hover);
}
.owd-desktop--nova .nova-launcher__body, body.owd-has-nova-desktop .nova-launcher__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px 14px 16px;
  -webkit-overflow-scrolling: touch;
}
.owd-desktop--nova .nova-launcher__section + .owd-desktop--nova .nova-launcher__section, .owd-desktop--nova .nova-launcher__section + body.owd-has-nova-desktop .nova-launcher__section, body.owd-has-nova-desktop .nova-launcher__section + .owd-desktop--nova .nova-launcher__section, body.owd-has-nova-desktop .nova-launcher__section + body.owd-has-nova-desktop .nova-launcher__section {
  margin-top: 14px;
}
.owd-desktop--nova .nova-launcher__section-label, body.owd-has-nova-desktop .nova-launcher__section-label {
  display: block;
  margin: 0 0 8px 2px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--nova-accent);
  opacity: 0.55;
}
.owd-desktop--nova .nova-launcher__grid, body.owd-has-nova-desktop .nova-launcher__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 8px;
}
@media (min-width: 769px) {
  .owd-desktop--nova .nova-launcher, body.owd-has-nova-desktop .nova-launcher {
    padding: 28px;
  }
  .owd-desktop--nova .nova-launcher__panel, body.owd-has-nova-desktop .nova-launcher__panel {
    flex: 0 1 auto;
    align-self: center;
    width: min(720px, 100%);
    max-height: min(640px, 100dvh - 56px);
    margin: auto;
  }
  .owd-desktop--nova .nova-launcher__grid, body.owd-has-nova-desktop .nova-launcher__grid {
    grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
    gap: 10px;
  }
}

body.owd-has-nova-desktop .nova-top-bar__settings-anchor {
  position: fixed;
  top: calc(var(--owd-system-bar-height, 32px) + var(--owd-system-bar-padding, 4px) + 8px);
  right: 10px;
  z-index: 10071;
  color: var(--owd-color, #e8eef6);
}

/* Shared Start components inside portaled launcher */
body.owd-has-nova-desktop .nova-start-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-radius: var(--nova-start-search-radius);
  background: var(--nova-start-surface-elevated);
  border: 1px solid transparent;
  transition: border-color 0.15s ease, background 0.15s ease;
}
body.owd-has-nova-desktop .nova-start-search:focus-within {
  border-color: var(--nova-accent-focus-ring, rgba(26, 108, 175, 0.45));
  background: rgba(255, 255, 255, 0.06);
}
body.owd-has-nova-desktop .nova-start-search--large {
  min-height: 44px;
  padding: 0 14px;
}
body.owd-has-nova-desktop .nova-start-search__icon {
  flex-shrink: 0;
  opacity: 0.55;
}
body.owd-has-nova-desktop .nova-start-search__input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  outline: none;
}
body.owd-has-nova-desktop .nova-start-search__input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
.nova-start-search--large body.owd-has-nova-desktop .nova-start-search__input {
  font-size: 16px;
}
body.owd-has-nova-desktop .nova-start-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px 16px;
  text-align: center;
  font-size: 13px;
  opacity: 0.55;
  line-height: 1.4;
}
body.owd-has-nova-desktop .nova-start-empty__icon {
  opacity: 0.35;
}
body.owd-has-nova-desktop .nova-start-tile {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  border-radius: var(--nova-start-tile-radius);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s ease;
}
body.owd-has-nova-desktop .nova-start-tile:hover, body.owd-has-nova-desktop .nova-start-tile:focus-visible {
  background: var(--nova-start-hover);
  outline: none;
}
body.owd-has-nova-desktop .nova-start-tile:hover .nova-start-tile__icon-wrap, body.owd-has-nova-desktop .nova-start-tile:focus-visible .nova-start-tile__icon-wrap {
  background: var(--nova-start-surface-elevated);
}
body.owd-has-nova-desktop .nova-start-tile:active {
  background: var(--nova-start-active);
}
body.owd-has-nova-desktop .nova-start-tile:active .nova-start-tile__icon-wrap {
  background: var(--nova-start-tile-icon-bg);
  box-shadow: 0 0 0 1px var(--nova-accent-focus-ring);
}
body.owd-has-nova-desktop .nova-start-tile__icon-wrap {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: var(--nova-start-tile-icon-bg);
  transition: background 0.12s ease, box-shadow 0.12s ease;
}
body.owd-has-nova-desktop .nova-start-tile__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
body.owd-has-nova-desktop .nova-start-tile__title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
body.owd-has-nova-desktop .nova-start-tile__meta {
  font-size: 11px;
  opacity: 0.5;
  line-height: 1.2;
}
body.owd-has-nova-desktop .nova-start-tile--grid {
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  text-align: center;
}
body.owd-has-nova-desktop .nova-start-tile--grid .nova-start-tile__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}
body.owd-has-nova-desktop .nova-start-tile--grid .nova-start-tile__text {
  align-items: center;
  width: 100%;
}
body.owd-has-nova-desktop .nova-start-tile--grid .nova-start-tile__title {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
body.owd-has-nova-desktop .nova-start-tile--grid .nova-start-tile__meta {
  display: none;
}

/* Nova generic window surfaces (About, Todo, … — not explorer frame). */
.owd-desktop--nova {
  --nova-window-radius: var(--owd-card-border-radius, 8px);
  --nova-window-nav-height: var(--owd-system-bar-height, 32px);
  --nova-window-control-size: 28px;
  --nova-window-control-radius: 8px;
  --nova-window-nav-padding-x: 8px;
  --nova-window-nav-gap: 2px;
  /* frame / header / body backgrounds are defined per accent in accent.scss */
  --nova-window-text: var(--owd-color, #e8eef6);
  --nova-window-text-muted: rgba(200, 212, 228, 0.52);
  --nova-window-text-inactive: rgba(200, 212, 228, 0.42);
  --nova-window-border: var(--owd-surface-700, #1d293d);
  --nova-window-nav-divider: color-mix(
    in srgb,
    var(--nova-window-border) 20%,
    transparent
  );
  --nova-window-border-focused: var(--nova-accent-focus-ring);
  --nova-window-accent: var(--owd-button-primary-active-background);
  --nova-window-accent-line: var(--owd-primary-color);
  --nova-window-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
  --nova-window-shadow-focused:
    0 12px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px var(--nova-accent-muted);
  --nova-window-control-hover: rgba(255, 255, 255, 0.12);
  --nova-window-control-active: rgba(255, 255, 255, 0.16);
  --nova-window-close-hover: rgba(196, 43, 52, 0.88);
  --nova-window-close-hover-border: rgba(255, 120, 120, 0.35);
  --nova-window-inactive-opacity: 0.94;
}

/* Nova Explorer — surfaces follow the active accent (see accent.scss / window-tokens.scss). */
.owd-desktop--nova {
  --nova-explorer-text: var(--nova-window-text);
  --nova-explorer-text-muted: var(--nova-window-text-muted);
  --nova-explorer-text-inactive: var(--nova-window-text-inactive);
  --nova-explorer-surface: var(--nova-window-body-bg);
  --nova-explorer-surface-elevated: var(--nova-window-header-bg);
  --nova-explorer-toolbar: color-mix(
    in srgb,
    var(--nova-window-header-bg) 55%,
    var(--nova-window-body-bg)
  );
  --nova-explorer-caption-bg: var(--nova-window-frame-bg);
  --nova-explorer-caption-control: #ffffff;
  --nova-explorer-border: var(--nova-window-border);
  --nova-explorer-border-subtle: color-mix(
    in srgb,
    var(--nova-window-border) 55%,
    transparent
  );
  --nova-explorer-pane-divider: var(--nova-window-border);
  --nova-explorer-control-border: color-mix(
    in srgb,
    var(--nova-window-border) 75%,
    transparent
  );
  --nova-explorer-accent: var(--nova-window-accent);
  --nova-explorer-accent-line: var(--nova-window-accent-line);
  --nova-explorer-accent-muted: var(--nova-accent-muted);
  --nova-explorer-focus-ring: var(--nova-accent-focus-ring);
  --nova-explorer-icon-desktop: #5eb8ff;
  --nova-explorer-icon-downloads: #3fd4e8;
  --nova-explorer-icon-documents: #c8c8c8;
  --nova-explorer-icon-pictures: #5eb8ff;
  --nova-explorer-icon-music: #f07ec7;
  --nova-explorer-icon-videos: #a78bfa;
  --nova-explorer-icon-folder-generic: #f3c84b;
  --nova-explorer-icon-file: rgba(235, 235, 235, 0.88);
  --nova-explorer-icon-image: #5eb8ff;
  --nova-explorer-icon-video: #a78bfa;
  --nova-explorer-icon-audio: #f07ec7;
  --nova-explorer-icon-pdf: #ff8585;
  --nova-explorer-icon-archive: #ffb84d;
  --nova-explorer-icon-document: #d2d2d2;
  --nova-explorer-icon-code: #7eb8ff;
  --nova-explorer-icon-disc: #9aa0a6;
  --owd-explorer-drop-outline: var(--nova-explorer-accent-line);
  --owd-explorer-drop-surface: color-mix(
    in srgb,
    var(--owd-explorer-drop-outline) 14%,
    transparent
  );
}
.owd-desktop--nova :deep(.kit-fs-explorer-dropzone--active),
.owd-desktop--nova :deep(.kit-fs-explorer-folder-drop-target--active) {
  outline-color: var(--owd-explorer-drop-outline);
  background: var(--owd-explorer-drop-surface);
}

.nova-explorer-shell :deep(.nova-explorer-content-pane) {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--nova-explorer-text) 28%, transparent) transparent;
}
.nova-explorer-shell :deep(.nova-explorer-content-pane::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}
.nova-explorer-shell :deep(.nova-explorer-content-pane::-webkit-scrollbar-thumb) {
  border-radius: 999px;
  background: color-mix(in srgb, var(--nova-explorer-text) 28%, transparent);
}
.nova-explorer-shell :deep(.p-datatable) {
  border: none;
  box-shadow: none;
  background: transparent;
}

/*
 * Explorer context menus (PrimeVue portals to body).
 * Applied via :pt root class `nova-explorer-popup-menu`.
 */
.nova-explorer-popup-menu.p-menu,
.nova-explorer-popup-menu.p-tieredmenu {
  font-family: var(--owd-font-family);
  font-size: 13px !important;
  line-height: 1.35;
  min-width: 200px;
  padding: 0 !important;
  background: var(--nova-start-surface, rgba(12, 18, 28, 0.96)) !important;
  color: var(--nova-explorer-text) !important;
  border: 1px solid var(--nova-explorer-border) !important;
  border-radius: var(--nova-window-radius, 8px) !important;
  box-shadow: var(--nova-window-shadow) !important;
}

.nova-explorer-popup-menu.p-menu .p-menu-list {
  padding: 4px !important;
  gap: 2px !important;
}
.nova-explorer-popup-menu.p-menu .p-menu-item-link {
  min-height: 32px;
  padding: 6px 12px !important;
  border-radius: 6px;
  gap: 10px !important;
}
.nova-explorer-popup-menu.p-menu .p-menu-item-icon {
  color: var(--nova-explorer-text-muted) !important;
}
.nova-explorer-popup-menu.p-menu .p-menu-item.p-focus .p-menu-item-content,
.nova-explorer-popup-menu.p-menu .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
  background: var(--nova-accent-muted) !important;
  color: var(--nova-explorer-text) !important;
}
.nova-explorer-popup-menu.p-menu .p-menu-item.p-focus .p-menu-item-icon,
.nova-explorer-popup-menu.p-menu .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {
  color: var(--nova-explorer-accent) !important;
}
.nova-explorer-popup-menu.p-menu .p-menu-separator {
  margin: 4px 6px;
  border-block-start-color: var(--nova-explorer-border-subtle) !important;
}

.nova-explorer-popup-menu.p-tieredmenu {
  min-width: 220px;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-root-list,
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-submenu {
  padding: 4px !important;
  gap: 2px !important;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-submenu {
  background: var(--nova-start-surface, rgba(12, 18, 28, 0.96)) !important;
  border: 1px solid var(--nova-explorer-border) !important;
  border-radius: var(--nova-window-radius, 8px) !important;
  box-shadow: var(--nova-window-shadow) !important;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-item-link {
  min-height: 32px;
  padding: 6px 12px !important;
  border-radius: 6px;
  gap: 10px !important;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-item-icon {
  color: var(--nova-explorer-text-muted) !important;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-submenu-icon {
  color: var(--nova-explorer-text-muted) !important;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover,
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-item.p-focus > .p-tieredmenu-item-content {
  background: var(--nova-accent-muted) !important;
  color: var(--nova-explorer-text) !important;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-item:not(.p-disabled):hover .p-tieredmenu-item-icon,
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-item.p-focus .p-tieredmenu-item-icon {
  color: var(--nova-explorer-accent) !important;
}
.nova-explorer-popup-menu.p-tieredmenu .p-tieredmenu-separator {
  margin: 4px 6px;
  border-block-start-color: var(--nova-explorer-border-subtle) !important;
}

/*
 * Explorer window chrome — same card / header language as generic Nova windows.
 * Frame uses chromePadding=false + .nova-explorer-frame.
 */
.owd-desktop--nova .owd-window.nova-explorer-frame {
  box-sizing: border-box;
  border-radius: var(--nova-window-radius);
  color: var(--nova-explorer-text);
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
}
.owd-desktop--nova .owd-window.nova-explorer-frame:not(.owd-window--focused) {
  opacity: var(--nova-window-inactive-opacity);
}
.owd-desktop--nova .owd-window.nova-explorer-frame > .p-card {
  --p-card-background: var(--nova-explorer-caption-bg);
  --p-card-border-color: var(--nova-explorer-border);
  --p-card-color: var(--nova-explorer-text);
  --p-content-background: var(--nova-explorer-surface);
  --p-content-border-color: var(--nova-explorer-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  border-radius: inherit;
  background: var(--nova-explorer-caption-bg);
  border: 1px solid var(--nova-explorer-border);
  box-shadow: var(--nova-window-shadow);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.owd-desktop--nova .owd-window.nova-explorer-frame.owd-window--focused > .p-card {
  border-color: var(--nova-window-border-focused);
  box-shadow: var(--nova-window-shadow-focused);
}
.owd-desktop--nova .owd-window.nova-explorer-frame > .p-card > .p-card-header {
  flex-shrink: 0;
  padding: 0;
  background: transparent;
  border: 0;
}
.owd-desktop--nova .owd-window.nova-explorer-frame > .p-card > .p-card-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0;
  background: var(--nova-explorer-surface);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--nova-window-nav-height);
  padding: 0;
  font-weight: 600;
  font-size: 13px;
  color: var(--nova-explorer-text-inactive);
  background: var(--nova-explorer-surface-elevated) !important;
  border-bottom: 1px solid var(--nova-window-nav-divider) !important;
  border-radius: var(--nova-window-radius) var(--nova-window-radius) 0 0;
  box-shadow: none;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: var(--nova-window-radius) var(--nova-window-radius) 0 0;
  background: transparent;
  transition: background 0.15s ease;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav--focused {
  color: var(--nova-explorer-text) !important;
  background: var(--nova-window-header-focused-bg) !important;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav--focused::before {
  background: linear-gradient(90deg, var(--nova-explorer-accent-line), var(--nova-explorer-accent));
}
.owd-desktop--nova .owd-window.nova-explorer-frame {
  /* Caption buttons: explorer-caption-controls.scss */
  /*
   * CoreWindow applies overflow on `.owd-window__content`; pin chrome so only
   * nav / content columns scroll internally.
   */
}
.owd-desktop--nova .owd-window.nova-explorer-frame .owd-window__content {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden !important;
  color: var(--nova-explorer-text);
  background: var(--nova-explorer-surface);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .nova-explorer-top-band {
  background: transparent;
  border-bottom: none;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .nova-explorer-top-band :deep(.nova-explorer-chrome-band__inner) {
  padding: 4px 10px 6px;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .nova-explorer-top-band :deep(.nova-explorer-chrome-band__nav) {
  flex: 0 0 auto;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .nova-explorer-top-band :deep(.nova-explorer-chrome-band__crumb) {
  flex: 1;
  min-width: 0;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .nova-explorer-shell {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: var(--nova-explorer-surface);
  padding: 0;
  box-sizing: border-box;
  box-shadow: inset 0 1px 0 var(--nova-explorer-border-subtle);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .nova-explorer-shell .p-button {
  margin: 2px !important;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .nova-explorer-command-bar {
  background: var(--nova-explorer-surface);
  min-height: 36px;
  border-bottom: 1px solid var(--nova-explorer-border-subtle);
  color: var(--nova-explorer-text);
}

/* Explorer caption — always-white controls (glyphs + app icon) */
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav {
  align-items: center;
  min-height: var(--nova-window-nav-height);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__title {
  flex: 1 1 auto;
  min-width: 0;
  padding-left: 10px;
  text-align: left;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__title .owd-window-nav__title-inner {
  margin: 0;
  font-weight: 600;
  font-size: 13px;
  color: var(--nova-explorer-caption-control);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding-left: 8px;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__icon :deep(.iconify),
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__icon :deep(svg) {
  margin: 0;
  vertical-align: middle;
  width: 18px !important;
  height: 18px !important;
  min-width: 18px;
  min-height: 18px;
  color: var(--nova-explorer-caption-control) !important;
  opacity: 1 !important;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__btn-group--append {
  position: relative;
  z-index: 3;
  flex-shrink: 0;
  align-self: center;
  align-items: center;
  gap: var(--nova-window-nav-gap);
  padding: 0 var(--nova-window-nav-padding-x) 0 4px;
  margin: 0;
  pointer-events: auto;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--nova-window-control-size);
  height: var(--nova-window-control-size);
  border-radius: var(--nova-window-control-radius);
  background: transparent;
  border: 0;
  transition: background 0.15s ease;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button .owd-window-nav__glyph {
  color: var(--nova-explorer-caption-control) !important;
  opacity: 1 !important;
  font-family: system-ui, sans-serif;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button .owd-window-nav__glyph-icon,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button :deep(.iconify),
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button :deep(svg) {
  color: var(--nova-explorer-caption-control) !important;
  opacity: 1 !important;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button:hover {
  background: var(--nova-window-control-hover);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button:active {
  background: var(--nova-window-control-active);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button--close:hover {
  background: var(--nova-window-close-hover);
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button--close:hover .owd-window-nav__glyph,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button--close:hover .owd-window-nav__glyph-icon,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button--close:hover :deep(.iconify),
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .owd-window-nav__button--close:hover :deep(svg) {
  color: var(--nova-explorer-caption-control) !important;
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav {
  /* Fallback if kit-fs chrome buttons are still mounted */
}
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .p-button--window-nav-minimize .owd-button__icon::before,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .p-button--window-nav-minimize .owd-button__icon::after,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .p-button--window-nav-maximize .owd-button__icon::before,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .p-button--window-nav-maximize .owd-button__icon::after,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .p-button--window-nav-close .owd-button__icon::before,
.owd-desktop--nova .owd-window.nova-explorer-frame .p-card-header .owd-window-nav .p-button--window-nav-close .owd-button__icon::after {
  background: var(--nova-explorer-caption-control) !important;
}

/*
 * Generic app windows (About, Todo, …).
 * Explorer uses `.nova-explorer-frame` in explorer-chrome.scss.
 */
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) {
  box-sizing: border-box;
  display: inline-block;
  min-width: 160px;
  min-height: 160px;
  border-radius: var(--nova-window-radius);
  color: var(--nova-window-text);
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame):not(.owd-window--focused) {
  opacity: var(--nova-window-inactive-opacity);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) > .p-card {
  --p-card-background: var(--nova-window-frame-bg);
  --p-card-border-color: var(--nova-window-border);
  --p-card-color: var(--nova-window-text);
  --p-content-background: var(--nova-window-frame-bg);
  --p-content-border-color: var(--nova-window-border);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  border-radius: inherit;
  background: var(--nova-window-frame-bg);
  border: 1px solid var(--nova-window-border);
  box-shadow: var(--nova-window-shadow);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) > .p-card > .p-card-header {
  flex-shrink: 0;
  padding: 0;
  background: transparent;
  border: 0;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) > .p-card > .p-card-body {
  flex: 1 1 auto;
  min-height: 0;
  height: auto;
  padding: 0;
  background: var(--nova-window-body-bg);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) > .p-card > .p-card-body > .p-card-content {
  height: 100%;
  min-height: 0;
  color: var(--nova-window-text);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame).owd-window--focused {
  opacity: 1;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame).owd-window--focused > .p-card {
  border-color: var(--nova-window-border-focused);
  box-shadow: var(--nova-window-shadow-focused);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-card-header .owd-window-nav {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--nova-window-nav-height);
  min-height: var(--nova-window-nav-height);
  padding: 0;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.01em;
  color: var(--nova-window-text-inactive);
  background: var(--nova-window-header-bg);
  border-bottom: 1px solid var(--nova-window-nav-divider);
  border-radius: var(--nova-window-radius) var(--nova-window-radius) 0 0;
  box-shadow: none;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-card-header .owd-window-nav::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: var(--nova-window-radius) var(--nova-window-radius) 0 0;
  background: transparent;
  transition: background 0.15s ease;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-card-header .owd-window-nav--focused {
  color: var(--nova-window-text);
  background: var(--nova-window-header-focused-bg);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-card-header .owd-window-nav--focused::before {
  background: linear-gradient(90deg, var(--nova-window-accent-line), var(--nova-window-accent));
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-card-header .owd-window-nav .owd-window-nav__title-inner {
  color: inherit;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__btn-group {
  gap: var(--nova-window-nav-gap);
  padding: 0 var(--nova-window-nav-padding-x);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button {
  width: var(--nova-window-control-size);
  height: var(--nova-window-control-size);
  border-radius: var(--nova-window-control-radius);
  background: transparent;
  border: 0;
  transition: background 0.15s ease;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button .owd-window-nav__glyph,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button .owd-window-nav__glyph-icon,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button :deep(.iconify) {
  opacity: 0.92;
  color: var(--nova-window-text);
  transition: opacity 0.15s ease, color 0.15s ease;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button:hover {
  background: var(--nova-window-control-hover);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button:hover .owd-window-nav__glyph,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button:hover .owd-window-nav__glyph-icon,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button:hover :deep(.iconify) {
  opacity: 1;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__button:active {
  background: var(--nova-window-control-active);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__btn-group--append .owd-window-nav__button--close:hover {
  background: var(--nova-window-close-hover);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__btn-group--append .owd-window-nav__button--close:hover .owd-window-nav__glyph,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__btn-group--append .owd-window-nav__button--close:hover .owd-window-nav__glyph-icon,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window-nav__btn-group--append .owd-window-nav__button--close:hover :deep(.iconify) {
  color: #fff;
  opacity: 1;
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window__content,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window__content--centered {
  color: var(--nova-window-text);
  background: var(--nova-window-body-bg);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window__content a,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window__content--centered a {
  color: var(--owd-primary-color);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window__content a:hover,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .owd-window__content--centered a:hover {
  color: var(--owd-primary-hover-color);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-button.p-button-primary,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-button--primary {
  --p-button-primary-background: var(--owd-button-primary-active-background);
  --p-button-primary-hover-background: var(--owd-primary-hover-color);
  --p-button-primary-active-background: var(--owd-button-primary-active-background);
  --p-button-primary-border-color: var(--owd-button-primary-active-border-color);
}
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-inputtext:focus,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-select:focus,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-checkbox-box:focus-visible,
.owd-desktop--nova .owd-window.resizable-component:not(.nova-explorer-frame) .p-radiobutton-box:focus-visible {
  border-color: var(--nova-window-accent-line);
  box-shadow: 0 0 0 1px var(--nova-accent-focus-ring);
}

/*
 * Window title-bar context menu (PrimeVue portals to body).
 * Scoped via :pt root class `nova-window-nav-context-menu` on WindowNav only.
 */
.nova-window-nav-context-menu.p-contextmenu.p-component {
  font-family: var(--owd-font-family);
  font-size: 12px !important;
  line-height: 1.3;
  min-width: 168px;
  max-width: min(240px, 100vw - 24px);
  padding: 0 !important;
  background: var(--nova-window-frame-bg, rgba(6, 10, 16, 0.96)) !important;
  color: var(--nova-window-text) !important;
  border: 1px solid var(--nova-window-border) !important;
  border-radius: var(--nova-window-radius, 8px) !important;
  box-shadow: var(--nova-window-shadow) !important;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-root-list {
  padding: 2px !important;
  gap: 1px !important;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item-link {
  min-height: 26px;
  padding: 4px 10px !important;
  border-radius: 4px;
  gap: 8px !important;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item-label {
  line-height: 1.3;
  letter-spacing: 0.01em;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item-icon {
  font-size: 0.8125rem;
  width: 1rem;
  text-align: center;
  color: var(--nova-window-text-muted) !important;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover,
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item.p-focus > .p-contextmenu-item-content {
  background: var(--nova-accent-muted) !important;
  color: var(--nova-window-text) !important;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item:not(.p-disabled):hover .p-contextmenu-item-icon,
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item.p-focus .p-contextmenu-item-icon {
  color: var(--nova-window-accent-line) !important;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item.p-disabled > .p-contextmenu-item-content {
  opacity: 0.45;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-item-active > .p-contextmenu-item-content {
  background: color-mix(in srgb, var(--nova-accent-muted) 65%, transparent) !important;
  color: var(--nova-window-text) !important;
}
.nova-window-nav-context-menu.p-contextmenu.p-component .p-contextmenu-separator {
  margin: 2px 4px;
  border-block-start: 1px solid var(--nova-window-border) !important;
}

.owd-desktop--nova .nova-top-bar,
.owd-desktop--nova .owd-desktop__system-bar.nova-top-bar {
  position: relative;
  z-index: 10050;
  flex-shrink: 0;
}
.owd-desktop--nova .nova-top-bar__settings-anchor {
  z-index: 10051;
}
.owd-desktop--nova .nova-launcher {
  z-index: 10070;
}
.owd-desktop--nova .owd-dock-bar {
  z-index: 10050;
  pointer-events: none;
}
.owd-desktop--nova .owd-dock-bar__inner {
  pointer-events: auto;
  padding: 6px 10px;
  border-radius: 14px;
  background: var(--nova-shell-dock-bg, rgba(6, 10, 16, 0.88));
  border: 1px solid var(--owd-surface-700);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
}

.owd-desktop--nova .nova-shell__stage {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}
.owd-desktop--nova .nova-workspace-stack {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}
.owd-desktop--nova .owd-workspace-edge-hints {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10055;
  pointer-events: none;
}
.owd-desktop--nova .owd-workspace-edge-hints__zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.owd-desktop--nova .owd-workspace-edge-hints__zone--left {
  left: 0;
  background: linear-gradient(90deg, var(--nova-accent-muted, rgba(26, 108, 175, 0.42)) 0%, transparent 100%);
}
.owd-desktop--nova .owd-workspace-edge-hints__zone--right {
  right: 0;
  background: linear-gradient(270deg, var(--nova-accent-muted, rgba(26, 108, 175, 0.42)) 0%, transparent 100%);
}
.owd-desktop--nova .owd-workspace-edge-hints__zone--active {
  opacity: 1;
}
.owd-desktop--nova .nova-workspace-stack :deep(.owd-window) {
  pointer-events: auto;
}
.owd-desktop--nova .nova-workspace-stack__backdrop {
  position: fixed;
  inset: 0;
  z-index: 0;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgba(4, 8, 14, 0.72);
  cursor: pointer;
  pointer-events: auto;
}
.owd-desktop--nova .nova-workspace-stack__grid {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.owd-desktop--nova .nova-workspace-panel {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.25s ease;
}
.owd-desktop--nova .nova-workspace-panel__inner {
  width: 100%;
  height: 100%;
}
.owd-desktop--nova .nova-workspace-panel__label {
  display: none;
}
.owd-desktop--nova {
  /* Normal: only the active desktop receives input */
}
.owd-desktop--nova .nova-workspace-stack:not(.nova-workspace-stack--overview) .nova-workspace-panel--active {
  pointer-events: auto;
  z-index: 2;
}
.owd-desktop--nova .nova-workspace-stack:not(.nova-workspace-stack--overview) .nova-workspace-panel:not(.nova-workspace-panel--active) {
  visibility: hidden;
  opacity: 0;
}
.owd-desktop--nova {
  /* Overview: grid of desktops + bottom switcher */
}
.owd-desktop--nova .nova-workspace-stack--overview {
  z-index: 10040;
  pointer-events: auto;
}
.owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-stack__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 16px;
  align-content: start;
  justify-content: center;
  padding: 56px 20px 96px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}
.owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-panel {
  position: relative;
  inset: auto;
  pointer-events: auto;
  border-radius: 14px;
  border: 1px solid var(--owd-surface-700, #1d293d);
  background: var(--owd-surface-900, #0c1218);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  min-height: 180px;
  max-height: min(52vh, 420px);
  aspect-ratio: 16/10;
}
.owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-panel--active {
  border-color: var(--nova-accent, #1a6caf);
  box-shadow: 0 0 0 1px var(--nova-accent-muted, rgba(26, 108, 175, 0.45)), 0 16px 48px rgba(0, 0, 0, 0.5);
}
.owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-panel__label {
  display: block;
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 3;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #e8eef6;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}
.owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-panel__inner {
  position: relative;
  border-radius: inherit;
  overflow: hidden;
  transform: scale(0.52);
  transform-origin: top center;
  width: 192.31%;
  height: 192.31%;
  margin-left: -46.15%;
  min-height: 200px;
}
.owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-panel__empty {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 12px;
  font-size: 12px;
  opacity: 0.45;
  text-align: center;
  pointer-events: none;
}
.owd-desktop--nova .nova-workspace-switcher {
  position: fixed;
  left: 50%;
  bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  z-index: 10042;
  transform: translateX(-50%);
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: calc(100vw - 24px);
  padding: 8px 10px;
  border-radius: 14px;
  background: var(--nova-shell-bar-bg, rgba(6, 10, 16, 0.94));
  border: 1px solid var(--owd-surface-700, #1d293d);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
}
.owd-desktop--nova .nova-workspace-switcher__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: #e8eef6;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}
.owd-desktop--nova .nova-workspace-switcher__pill:hover {
  background: rgba(255, 255, 255, 0.12);
}
.owd-desktop--nova .nova-workspace-switcher__pill--active {
  background: var(--nova-accent-muted, rgba(26, 108, 175, 0.35));
  color: #fff;
}
.owd-desktop--nova .nova-workspace-switcher__pill--add {
  min-width: 32px;
  padding: 0 10px;
}
.owd-desktop--nova.owd-desktop--overview-enabled :deep(.owd-dock-bar) {
  z-index: 10043;
}
@media (max-width: 599px) {
  .owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-stack__grid {
    grid-template-columns: 1fr;
    padding-top: 48px;
    padding-bottom: 108px;
  }
  .owd-desktop--nova .nova-workspace-stack--overview .nova-workspace-panel {
    max-height: min(44vh, 320px);
  }
  .owd-desktop--nova .nova-workspace-switcher {
    bottom: calc(64px + env(safe-area-inset-bottom, 0px));
    gap: 6px;
    padding: 6px 8px;
  }
  .owd-desktop--nova .nova-workspace-switcher__pill {
    min-height: 28px;
    padding: 0 10px;
    font-size: 11px;
  }
}

/* Tray lives in .nova-top-bar; scoped styles in NovaTopBarTray.vue are primary. */
.owd-desktop--nova .nova-tray-btn,
.nova-top-bar .nova-tray-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  transition: background 0.15s ease;
}
.owd-desktop--nova .nova-tray-btn:hover, .owd-desktop--nova .nova-tray-btn--active,
.nova-top-bar .nova-tray-btn:hover,
.nova-top-bar .nova-tray-btn--active {
  background: rgba(255, 255, 255, 0.12);
}
.owd-desktop--nova .nova-tray-btn:disabled,
.nova-top-bar .nova-tray-btn:disabled {
  cursor: default;
  opacity: 0.45;
}
.owd-desktop--nova .nova-tray-btn--accent:hover,
.nova-top-bar .nova-tray-btn--accent:hover {
  background: var(--nova-accent-muted, rgba(255, 255, 255, 0.12));
}

.owd-desktop--nova .nova-start-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 28px;
  min-width: 28px;
  padding: 0 11px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}
.owd-desktop--nova .nova-start-btn:hover, .owd-desktop--nova .nova-start-btn--active {
  background: var(--nova-start-hover);
}
.owd-desktop--nova .nova-start-btn--active {
  background: var(--nova-start-active);
  color: var(--nova-start-active-text, #f1f5f9);
}
.owd-desktop--nova .nova-start-btn__icon {
  flex-shrink: 0;
  opacity: 0.92;
}
.owd-desktop--nova .nova-start-btn__label {
  line-height: 1;
}
@media (max-width: 520px) {
  .owd-desktop--nova .nova-start-btn__label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}

.owd-desktop--nova .owd-desktop__system-bar {
  position: relative;
  z-index: 10050;
  flex-shrink: 0;
}
.owd-desktop--nova .owd-system-bar__menu {
  z-index: 10051;
  background: var(--owd-surface-900);
  border: 1px solid var(--owd-surface-700);
  border-radius: var(--owd-card-border-radius);
  box-shadow: var(--owd-menu-shadow);
  color: var(--owd-color, #fff);
}
.owd-desktop--nova .owd-dock-bar {
  z-index: 10050;
}

:root {
  --owd-font-family: 'Cantarell';
  --owd-color: #e8eef6;
  --owd-background-color: var(--owd-surface-900);
  --owd-card-border-radius: 8px;
  --owd-hover-background-color: 255, 255, 255, 0.05;
  --owd-card-body-padding: 12px;
  --owd-tabs-tab-padding: 0.6rem 1.25rem;
  --owd-tabs-tabpanel-padding: 1.25rem 0 0 0;
  --owd-menu-shadow: 0 0 0 1px var(--owd-surface-700);
  --owd-menubar-submenu-border-radius: var(--owd-card-border-radius);
  --owd-menubar-item-padding: 10px 14px;
  --owd-menubar-submenu-border-color: var(--owd-surface-700);
  --owd-menubar-item-focus-background: rgba(var(--owd-hover-background-color));
  --owd-navigation-item-padding: 0.5rem 1rem;
  --owd-dock-item-padding: 12px;
  --owd-system-bar-height: 32px;
  --owd-system-bar-padding: 4px;
  --owd-system-bar-menu-spacing: 8px;
}

::-webkit-scrollbar {
  width: 8px;
  background-color: transparent;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

:hover::-webkit-scrollbar-thumb,
:focus::-webkit-scrollbar-thumb,
:active::-webkit-scrollbar-thumb,
::-webkit-scrollbar-thumb {
  opacity: 1;
}

.p-menubar {
  border: 0;
}

.p-menu, .p-menubar-submenu {
  margin-top: 12px !important;
}

.p-tablist {
  margin: calc(var(--owd-card-body-padding) * -1 + 1px) calc(var(--owd-card-body-padding) * -1) 0 calc(var(--owd-card-body-padding) * -1);
}

label .p-checkbox {
  margin-right: 8px;
}
label .p-checkbox-box {
  margin-top: -3px;
}

.owd-desktop {
  background: var(--owd-surface-900);
  font-family: var(--owd-font-family), serif;
  color: var(--owd-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.owd-desktop :deep(.owd-desktop__system-bar) {
  flex: 0 0 auto;
  overflow: visible;
  position: relative;
  z-index: 10061;
}
.owd-desktop :deep(.owd-desktop__content) {
  flex: 1 1 auto;
  min-height: 0;
}
.owd-desktop--system-bar-position-bottom {
  flex-direction: column-reverse;
}
</style>
