import {defineDesktopConfig} from '@owdproject/core'

export default defineDesktopConfig({
    theme: '@owdproject/theme-nova',
    modules: [
    ],
    apps: [
        '@owdproject/app-about',
        '@owdproject/app-terminal',
    ],
    systemBar: {enabled: true, startButton: true},
    terminal: {
        welcomeMessage: "Welcome to Nova OS",
        prompt: "$"
    },
    fs: {
        mounts: {
            '/mnt/test': '/test-small.zip',
        },
    },
})
