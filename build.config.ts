import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    '@owdproject/core',
    /^@owdproject\/core\//,
  ],
})
