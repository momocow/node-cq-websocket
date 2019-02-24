const path = require('path')
const KaomojifyWebpackPlugin = require('kaomojify-webpack-plugin')

const COMMON_CONFIG = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    library: {
      root: 'CQWebSocketSDK',
      amd: 'cq-websocket',
      commonjs: 'cq-websocket'
    },
    libraryTarget: 'umd',
    libraryExport: '',
    path: path.join(__dirname, 'dist')
  }
}

module.exports = [
  { // minified bundle
    ...COMMON_CONFIG,
    output: {
      ...COMMON_CONFIG.output,
      filename: 'cq-websocket.min.js'
    }
  },
  { // kaomojified bundle (x100 in size) (*´∇｀*)/
    ...COMMON_CONFIG,
    output: {
      ...COMMON_CONFIG.output,
      filename: 'cq-websocket.kaomojified.js'
    },
    plugins: [
      new KaomojifyWebpackPlugin()
    ]
  }
]
