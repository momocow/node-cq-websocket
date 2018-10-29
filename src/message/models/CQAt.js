const CQTag = require('../CQTag')

module.exports = class CQAt extends CQTag {
  constructor (qq) {
    super('at', { qq })
  }

  get qq () {
    return this.data.qq
  }

  coerce () {
    this.data.qq = Number(this.data.qq)
    return this
  }
}
