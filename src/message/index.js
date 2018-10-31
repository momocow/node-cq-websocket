const isSupportedTag = require('./isSupportedTag')
const parse = require('./parse')
const models = require('./models')

module.exports = {
  parse,
  isSupportedTag,
  ...models
}
