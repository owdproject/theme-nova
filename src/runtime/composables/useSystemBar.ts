import { useApplicationManager } from '@owdproject/core/runtime/composables/useApplicationManager'
import { useAppConfig } from 'nuxt/app'
import { computed } from 'vue'

export function useSystemBar(_config?: DesktopSystemBarConfig | undefined) {
    const applicationManager = useApplicationManager()
    const appConfig = useAppConfig()

    const config = computed(
        () =>
            ({ ...appConfig.desktop?.systemBar, ..._config }) as DesktopSystemBarConfig,
    )

    const windows = computed(() => applicationManager.windowsOpened)

    const menu = computed(() => {
        const systemBarMenu: any = []

        return systemBarMenu
    })

    return {
        config,
        windows,
        menu,
    }
}
