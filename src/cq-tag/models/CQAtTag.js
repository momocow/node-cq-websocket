const CQTag = require('../CQTag')

module.exports = class CQAtTag extends CQTag {
  constructor (qq) {
    super('at', { qq })
  }

  get qq () {
    return this.data.qq
  }
}
