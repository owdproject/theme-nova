import {
  createResolver,
  addComponent,
  addComponentsDir,
  installModule,
  addImportsDir,
  addPlugin,
} from '@nuxt/kit'
import { defu } from 'defu'
import { defineDesktopTheme } from '@owdproject/core'
import { registerThemeTailwindPath } from '@owdproject/kit-primevue/kit/registerTailwindPath'
import { novaAccentBootstrapScript } from './runtime/utils/novaAccent'
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
  '**/Deprecated/**',
]

export default defineDesktopTheme({
  meta: {
    name: 'desktop-theme-nova',
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

    await installModule('@owdproject/kit-primevue')
    registerThemeTailwindPath(nuxt, import.meta.url)

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

    nuxt.options.fonts = defu(
      {
        families: [
          {
            name: 'Cantarell',
            provider: 'google',
            weights: [300, 400, 600, 700],
          },
        ],
      },
      nuxt.options.fonts ?? {},
    )

    nuxt.options.css.push(resolve('./runtime/assets/styles/index.scss'))

    const head = nuxt.options.app.head ?? {}
    const existingScripts = Array.isArray(head.script)
      ? head.script
      : head.script
        ? [head.script]
        : []

    nuxt.options.app.head = {
      ...head,
      htmlAttrs: defu({ 'data-nova-accent': 'ocean' }, head.htmlAttrs ?? {}),
      script: [
        {
          key: 'nova-accent-bootstrap',
          innerHTML: novaAccentBootstrapScript,
          tagPosition: 'head',
          type: 'text/javascript',
        },
        ...existingScripts,
      ],
    }

    addPlugin({
      src: resolve('./runtime/plugins/nova-accent.client.ts'),
      mode: 'client',
      order: 1,
    })

    installNovaBuiltInApps(nuxt, import.meta.url)
  },
})
