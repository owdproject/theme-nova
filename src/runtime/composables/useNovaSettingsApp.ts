import { useApplicationManager } from '@owdproject/core/runtime/composables/useApplicationManager'

export const NOVA_SETTINGS_APP_ID = 'org.owdproject.nova.settings'

/** Open the Nova Settings desktop application. */
export function useNovaSettingsApp() {
  const applicationManager = useApplicationManager()

  async function open() {
    await applicationManager.execAppCommand(NOVA_SETTINGS_APP_ID, 'settings')
  }

  return {
    appId: NOVA_SETTINGS_APP_ID,
    open,
  }
}
