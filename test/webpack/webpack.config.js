const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'app.js'),
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js'
  }
}