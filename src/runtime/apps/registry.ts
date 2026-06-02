import type { Nuxt } from '@nuxt/schema'

/**
 * Built-in Nova theme apps under `runtime/apps/<name>/`.
 * Each folder mirrors a standalone OWD app (see @owdproject/app-about):
 * - `app.config.ts` — desktop application manifest
 * - `plugin.ts` — registers the app via `defineDesktopApp`
 * - `components/` — window UI
 *
 * Apps with `autoload: true` are wired in theme `module.ts` without listing them in
 * `desktop.config.ts` `apps`.
 */
export type NovaThemeBuiltInApp = {
  name: string
  autoload: boolean
  when?: (nuxt: Nuxt) => boolean
}

export const NOVA_THEME_BUILTIN_APPS: NovaThemeBuiltInApp[] = [
  { name: 'settings', autoload: true },
  {
    name: 'explorer',
    autoload: true,
    when: (nuxt) => nuxt.options.modules.includes('@owdproject/module-fs'),
  },
]
