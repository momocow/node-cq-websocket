const CQTag = require('../CQTag')

module.exports = class CQAnonymous extends CQTag {
  constructor (shouldIgnoreIfFailed) {
    super('anonymous')
    this.modifier.ignore = Boolean(shouldIgnoreIfFailed)
  }

  shouldIgnoreIfFailed () {
    return this.modifier.ignore
  }
}
