process.chdir('../..')

module.exports = require('../../rollup.config.js').createRollupConfig(
  '@rhino-project/vite-plugin-rhino',
)
