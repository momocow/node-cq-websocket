const CQTag = require('../CQTag')

module.exports = class CQFaceTag extends CQTag {
  constructor (id) {
    super('face', { id })
  }

  get id () {
    return this.data.id
  }
}
