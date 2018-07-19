const CQTag = require('./CQTag')

class CQAtTag extends CQTag {
  constructor (qq = -1) {
    super('at', { qq: parseInt(qq) })
  }

  getQQ () {
    return parseInt(this.meta.qq)
  }
}

module.exports = CQAtTag
