const CQTag = require('../CQTag')
const optional = require('../../util/optional')

module.exports = class CQCustomMusic extends CQTag {
  constructor (url, audio, title, content, image) {
    super('music', { type: 'custom', url, audio, title, content, image })
  }

  get url () {
    return this.data.url
  }

  get audio () {
    return this.data.audio
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
    this.data.type = 'custom'
    this.data.url = String(this.data.url)
    this.data.audio = String(this.data.audio)
    this.data.title = String(this.data.title)
    this.data.content = optional(this.data.content, String)
    this.data.image = optional(this.data.image, String)
    return this
  }
}
