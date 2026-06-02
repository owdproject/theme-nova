import {
  createResolver,
  addComponent,
  addComponentsDir,
  installModule,
  addImportsDir,
  addPlugin,
} from '@nuxt/kit'
import { registerTailwindPath } from '@owdproject/core/runtime/utils/utilApp'
import { defineDesktopTheme } from '@owdproject/core/runtime/utils/defineDesktopTheme'
import Material from '@primeuix/themes/material'
import {
  NOVA_EXPLORER_QUICK_ACCESS_SEED,
  NOVA_EXPLORER_SPECIAL_FOLDERS,
} from './explorerNav.defaults'
import { installNovaBuiltInApps } from './runtime/apps/installBuiltInApps'

/** Pinia-heavy shell chrome: imported only from Desktop.client.vue, not global. */
const CHROME_COMPONENT_IGNORE = [
  'Desktop.client.vue',
  '**/Nova*.vue',
  '**/DockBar/**',
  '**/SystemBar/**',
  '**/Desktop/**',
]

export default defineDesktopTheme({
  meta: {
    name: 'owd-theme-nova',
  },
  defaults: {
    name: 'nova',
    systemBar: {
      enabled: true,
      position: 'top',
      startButton: true,
    },
    dockBar: {
      enabled: true,
      position: 'bottom',
    },
    workspaces: {
      enabled: true,
    },
    motion: {
      animation: true,
    },
    launcher: {
      animation: true,
    },
    explorer: {
      quickAccess: NOVA_EXPLORER_QUICK_ACCESS_SEED,
      quickAccessExtra: [],
      quickAccessOverride: [],
      specialFolders: NOVA_EXPLORER_SPECIAL_FOLDERS,
      specialFoldersExtra: [],
      specialFoldersOverride: [],
      mountLabels: {
        '/home': 'Local Disk',
      },
    },
  },
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await installModule('@owdproject/kit-theme')

    nuxt.options.primevue = nuxt.options.primevue || {}
    nuxt.options.primevue.options = {
      theme: {
        preset: Material,
      },
    }

    addComponent({
      name: 'Desktop',
      filePath: resolve('./runtime/components/Desktop.client.vue'),
      global: true,
    })

    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      global: true,
      ignore: CHROME_COMPONENT_IGNORE,
    })

    registerTailwindPath(
      nuxt,
      resolve('./runtime/components/**/*.{vue,mjs,ts}'),
    )

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        langDir: resolve('./i18n'),
        locales: [
          {
            code: 'en',
            file: 'locales/en.json',
          },
        ],
      })
    })

    addImportsDir(resolve('./runtime/composables'))
    addImportsDir(resolve('./runtime/consts'))
    addImportsDir(resolve('./runtime/stores'))
    addImportsDir(resolve('./runtime/utils'))

    addPlugin({
      src: resolve('./runtime/plugins/50.desktop-theme-nova-dialogs.client.ts'),
      mode: 'client',
    })

    nuxt.options.css.push(resolve('./runtime/assets/styles/index.scss'))

    if (nuxt.options.modules.includes('@owdproject/module-fs')) {
      await installModule('@owdproject/kit-explorer')
    }

    installNovaBuiltInApps(nuxt, import.meta.url)
  },
})
