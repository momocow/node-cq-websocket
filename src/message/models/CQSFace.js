const CQTag = require('../CQTag')

module.exports = class CQSFace extends CQTag {
  constructor (id) {
    super('sface', { id })
  }

  get id () {
    return this.data.id
  }

  coerce () {
    this.data.id = Number(this.data.id)
    return this
  }
}
