const CQTag = require('../CQTag')

module.exports = class CQFaceTag extends CQTag {
  constructor (id) {
    super('face', { id })
  }

  get id () {
    return this.data.id
  }

  coerce () {
    this.data.id = Number(this.data.id)
    return this
  }
}
