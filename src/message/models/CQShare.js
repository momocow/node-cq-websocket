const CQTag = require('../CQTag')
const optional = require('../../util/optional')

module.exports = class CQShare extends CQTag {
  constructor (url, title, content, image) {
    super('share', { url, title, content, image })
  }

  get url () {
    return this.data.url
  }

  get title () {
    return this.data.title
  }

  get content () {
    return this.data.content
  }

  get image () {
    return this.data.image
  }

  coerce () {
    this.data.url = String(this.data.url)
    this.data.title = String(this.data.title)
    this.data.content = optional(this.data.content, String)
    this.data.image = optional(this.data.image, String)
    return this
  }
}
