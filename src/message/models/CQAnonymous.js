const CQTag = require('../CQTag')

module.exports = class CQAnonymous extends CQTag {
  constructor (shouldIgnoreIfFailed) {
    super('anonymous')
    this.modifier.ignore = Boolean(shouldIgnoreIfFailed)
  }

  get ignore () {
    return this.modifier.ignore
  }

  set ignore (shouldIgnoreIfFailed) {
    this.modifier.ignore = Boolean(shouldIgnoreIfFailed)
  }
}
