const CQTag = require('../CQTag')

module.exports = class CQMusic extends CQTag {
  constructor (type, id) {
    super('music', { type, id })
  }

  get type () {
    return this.data.type
  }

  get id () {
    return this.data.id
  }

  coerce () {
    this.data.type = String(this.data.type)
    this.data.id = Number(this.data.id)
    return this
  }
}
