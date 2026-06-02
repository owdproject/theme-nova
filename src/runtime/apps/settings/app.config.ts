export default {
  id: 'org.owdproject.nova.settings',
  title: 'Settings',
  category: 'system-tools',
  singleton: true,
  icon: 'mdi:cog-outline',
  provides: {
    name: 'nova-settings',
    entry: 'settings',
  },
  windows: {
    main: {
      component: () => import('./components/Window/WindowSettings.vue'),
      resizable: true,
      size: {
        width: 1080,
        height: 720,
        minWidth: 400,
        minHeight: 480,
      },
      position: {
        x: 280,
        y: 120,
        z: 0,
      },
    },
  },
  entries: {
    settings: {
      command: 'settings',
    },
  },
  commands: {
    settings: (app: IApplicationController) => {
      app.openWindow('main')
    },
  },
}
