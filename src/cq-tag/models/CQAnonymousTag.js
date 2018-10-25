const CQTag = require('../CQTag')

module.exports = class CQAnonymousTag extends CQTag {
  constructor (ignore) {
    ignore = ignore ? true : undefined
    super('anonymous', { ignore })
  }

  get ignore () {
    return Boolean(this.data.ignore)
  }
}
