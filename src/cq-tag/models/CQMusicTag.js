const CQTag = require('../CQTag')

module.exports = class CQMusicTag extends CQTag {
  constructor (type, id) {
    super('music', { type, id })
  }

  get type () {
    return this.data.type
  }

  get id () {
    return this.data.id
  }
}
