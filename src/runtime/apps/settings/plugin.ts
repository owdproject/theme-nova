import { defineNuxtPlugin } from 'nuxt/app'
import { defineDesktopApp } from '@owdproject/core/kit/defineDesktopApp'
import configAppSettings from './app.config'

export default defineNuxtPlugin({
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.hook('app:created', async () => {
      await defineDesktopApp(configAppSettings)
    })
  },
})
