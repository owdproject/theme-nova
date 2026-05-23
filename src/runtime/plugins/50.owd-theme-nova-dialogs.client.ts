import { defineNuxtPlugin } from 'nuxt/app'
import ConfirmationService from 'primevue/confirmationservice'
import { useConfirm } from 'primevue/useconfirm'
import { OWD_DIALOG_PROVIDER_KEY } from '@owdproject/core/runtime/dialogs/owdDialogProvider'
import { createPrimeVueOwdDialogs } from '@owdproject/kit-theme/runtime/dialogs/createPrimeVueOwdDialogs'

export default defineNuxtPlugin({
  name: 'owd-theme-nova-dialogs',
  enforce: 'post',
  setup(nuxtApp) {
    nuxtApp.vueApp.use(ConfirmationService)
    const confirm = nuxtApp.runWithContext(() => useConfirm())
    nuxtApp.vueApp.provide(
      OWD_DIALOG_PROVIDER_KEY,
      createPrimeVueOwdDialogs(confirm),
    )
  },
})
