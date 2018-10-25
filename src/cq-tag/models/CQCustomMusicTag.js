const CQTag = require('../CQTag')

module.exports = class CQCustomMusicTag extends CQTag {
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
}
