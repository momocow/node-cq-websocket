const CQTag = require('./cq-tag')

class CQAtTag extends CQTag {
  constructor (qq) {
    super('at', { qq })
  }
}

module.exports = CQAtTag
