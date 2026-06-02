<script setup>
import { computed, watch, useTemplateRef } from "vue";
import { onKeyStroke } from "@vueuse/core";
import { useNovaStartMenu } from "../composables/useNovaStartMenu";
import { useNovaMotion } from "../composables/useNovaMotion";
import NovaStartSearchField from "./NovaStartSearchField.vue";
import NovaStartAppTile from "./NovaStartAppTile.vue";

const props = defineProps({
  /** When set, overrides the user preference from quick settings / localStorage. */
  animated: { type: Boolean, default: undefined },
});

const {
  open,
  searchQuery,
  filteredEntries,
  allEntries,
  close,
  launchEntry
} = useNovaStartMenu();
const { enabled: motionEnabled } = useNovaMotion();
const animate = computed(() => props.animated ?? motionEnabled.value);

const panelRef = useTemplateRef("panelRef");
const searchRef = useTemplateRef("searchRef");

onKeyStroke("Escape", () => {
  if (open.value) close();
});

watch(open, (isOpen) => {
  if (!isOpen) return;
  requestAnimationFrame(() => searchRef.value?.focus());
});
</script>

<template>
  <Teleport to="body">
    <Transition name="nova-launcher" appear>
      <div
        v-if="open"
        class="nova-launcher"
        :class="{ 'nova-launcher--static': !animate }"
        role="dialog"
        :aria-label="$t('systemBar.start.panelLabel')"
      >
        <button
          type="button"
          class="nova-launcher__backdrop"
          :aria-label="$t('systemBar.start.close')"
          @click="close()"
        />

        <div ref="panelRef" class="nova-launcher__panel">
          <header class="nova-launcher__header" @click.stop>
            <div class="nova-launcher__header-inner">
              <NovaStartSearchField
                ref="searchRef"
                v-model="searchQuery"
                size="large"
                launcher
                class="nova-launcher__search"
                :placeholder="$t('systemBar.start.searchPlaceholder')"
                :aria-label="$t('systemBar.start.searchLabel')"
              />
              <button
                type="button"
                class="nova-launcher__close"
                :aria-label="$t('systemBar.start.close')"
                @click="close()"
              >
                <Icon name="mdi:close" :size="20" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div
            class="nova-launcher__body"
            @click="close()"
          >
            <div
              v-if="filteredEntries.length === 0"
              class="nova-start-empty"
              role="status"
            >
              <Icon
                :name="allEntries.length === 0 ? 'mdi:application-outline' : 'mdi:magnify-close'"
                :size="40"
                class="nova-start-empty__icon"
                aria-hidden="true"
              />
              <span>{{
                allEntries.length === 0 ? $t("systemBar.start.emptyApps") : $t("systemBar.start.emptySearch")
              }}</span>
            </div>

            <ul
              v-else
              class="nova-launcher__grid"
              role="listbox"
              @click.stop
            >
              <li
                v-for="(entry, index) in filteredEntries"
                :key="`${entry.application.id}:${entry.command}:${index}`"
                role="presentation"
              >
                <NovaStartAppTile
                  :entry="entry"
                  layout="grid"
                  @select="launchEntry"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
