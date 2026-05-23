import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    '@owdproject/core',
    /^@owdproject\/core\//,
    '@owdproject/kit-theme',
    /^@owdproject\/kit-theme\//,
    '@owdproject/kit-explorer',
    /^@owdproject\/kit-explorer\//,
    '@owdproject/kit-fs',
    /^@owdproject\/kit-fs\//,
  ],
})
