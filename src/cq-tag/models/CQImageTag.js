const CQTag = require('../CQTag')

module.exports = class CQImageTag extends CQTag {
  constructor (file) {
    super('image', { file })
  }

  get file () {
    return this.data.file
  }

  get url () {
    return this.data.url
  }

  ignoreCache () {
    this.modifier.cache = 0
  }
}
