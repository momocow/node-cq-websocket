const CQTag = require('../CQTag')

module.exports = class CQSFaceTag extends CQTag {
  constructor (id) {
    super('sface', { id })
  }

  coerce () {
    this.data.id = Number(this.data.id)
    return this
  }
}
