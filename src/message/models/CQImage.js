const CQTag = require('../CQTag')
const optional = require('../../util/optional')

module.exports = class CQImage extends CQTag {
  constructor (file, cache = true) {
    super('image', { file })
    this.cache = cache
  }

  get file () {
    return this.data.file
  }

  get url () {
    return this.data.url
  }

  get cache () {
    return this.modifier.cache
  }

  set cache (cache) {
    this.modifier.cache = !cache ? 0 : undefined
  }

  coerce () {
    this.data.file = String(this.data.file)
    this.data.url = optional(this.data.url, String)
    return this
  }
}
