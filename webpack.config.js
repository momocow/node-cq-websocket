const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'browser.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'cq-websocket.min.js'
  }
}
