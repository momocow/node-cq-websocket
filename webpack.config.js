const path = require('path')

const { version } = require('./package.json')

const filename = `cq-websocket-${version}.min.js`

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'browser.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename
  }
}
