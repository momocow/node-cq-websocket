const CQTag = require('../CQTag')

module.exports = class CQShareTag extends CQTag {
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
}
