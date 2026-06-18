import {
  addComponentsDir,
  addPlugin,
  createResolver,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { registerTailwindPath } from '@owdproject/kit-tailwind/kit/registerTailwindPath'
import { NOVA_THEME_BUILTIN_APPS } from './registry'

/** Register autoload built-in apps from `runtime/apps/<name>/`. */
export function installNovaBuiltInApps(nuxt: Nuxt, themeRoot: string) {
  const { resolve } = createResolver(themeRoot)

  for (const app of NOVA_THEME_BUILTIN_APPS) {
    if (!app.autoload) continue
    if (app.when && !app.when(nuxt)) continue

    const appRoot = resolve(`./runtime/apps/${app.name}`)

    addPlugin({
      src: resolve(appRoot, 'plugin.ts'),
      mode: 'client',
      name: `owd-nova-${app.name}`,
    })

    addComponentsDir({
      path: resolve(appRoot, 'components'),
    })

    registerTailwindPath(
      nuxt,
      resolve(appRoot, 'components/**/*.{vue,mjs,ts}'),
    )
  }
}
