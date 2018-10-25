const CQTag = require('../CQTag')

module.exports = class CQEmojiTag extends CQTag {
  constructor (id) {
    super('emoji', { id })
  }

  get id () {
    return this.data.id
  }
}
