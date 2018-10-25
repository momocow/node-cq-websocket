const CQTag = require('../CQTag')

module.exports = class CQSFaceTag extends CQTag {
  constructor (id) {
    super('sface', { id })
  }
}
