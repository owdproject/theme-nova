import { defineNuxtPlugin } from 'nuxt/app'
import ConfirmationService from 'primevue/confirmationservice'
import { useConfirm } from 'primevue/useconfirm'
import { DESKTOP_DIALOG_PROVIDER_KEY } from '@owdproject/core/runtime/dialogs/desktopDialogProvider'
import { createDesktopDialogs } from '@owdproject/kit-primevue/runtime/dialogs/createDesktopDialogs'

export default defineNuxtPlugin({
  name: 'desktop-theme-nova-dialogs',
  enforce: 'post',
  setup(nuxtApp) {
    nuxtApp.vueApp.use(ConfirmationService)
    const confirm = nuxtApp.runWithContext(() => useConfirm())
    nuxtApp.vueApp.provide(
      DESKTOP_DIALOG_PROVIDER_KEY,
      createDesktopDialogs(confirm),
    )
  },
})
