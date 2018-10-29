const CQTag = require('../CQTag')

module.exports = class CQImage extends CQTag {
  constructor (file, ignoreCache) {
    super('image', { file })
    this.modifier.cache = ignoreCache ? 0 : undefined
  }

  get file () {
    return this.data.file
  }

  get url () {
    return this.data.url
  }

  coerce () {
    this.data.file = String(this.data.file)
    this.data.url = String(this.data.url)
    return this
  }
}
