import {
  createResolver,
  addComponent,
  addComponentsDir,
  addImportsDir,
  addPlugin,
  installModule,
} from '@nuxt/kit'
import { defu } from 'defu'
import { defineDesktopTheme } from '@owdproject/core'
import {
  registerTailwindPath,
  registerThemeTailwindPath,
} from '@owdproject/kit-tailwind/kit/registerTailwindPath'
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

    nuxt.options.primevue = nuxt.options.primevue || {}
    nuxt.options.primevue.options = {
      theme: {
        preset: Material,
      },
    }

    await installModule('@owdproject/kit-primevue')

    registerThemeTailwindPath(nuxt, import.meta.url)
    registerTailwindPath(nuxt, resolve('./runtime/pages/**/*.{vue,mjs,ts}'))

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

    const novaConfig = (_options as any).nova || {}
    const accentDefault = novaConfig.accents?.default ?? 'ocean'
    const accentList = novaConfig.accents?.list ?? ['ocean', 'ember', 'forest', 'violet']
    const bootstrapScript = `(function(){var el=document.documentElement,a=${JSON.stringify(accentList)},d=${JSON.stringify(accentDefault)};try{var s=localStorage.getItem("owd-nova-accent");if(s&&a.indexOf(s)!==-1){el.dataset.novaAccent=s}else{el.dataset.novaAccent=d}}catch(e){el.dataset.novaAccent=d}try{var m=localStorage.getItem("owd-nova-motion");el.dataset.novaMotion=m==='false'?'off':'on'}catch(e){el.dataset.novaMotion='on'}})();`

    nuxt.options.app.head = {
      ...head,
      htmlAttrs: defu({ 'data-nova-accent': accentDefault }, head.htmlAttrs ?? {}),
      script: [
        {
          key: 'nova-accent-bootstrap',
          innerHTML: bootstrapScript,
          tagPosition: 'head',
          type: 'text/javascript',
        },
        ...existingScripts,
      ],
    }

    addPlugin({
      src: resolve('./runtime/plugins/nova-accent.client'),
      mode: 'client',
      order: 1,
    })

    installNovaBuiltInApps(nuxt, import.meta.url)
  },
})
