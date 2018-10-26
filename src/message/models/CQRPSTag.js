const CQTag = require('../CQTag')

module.exports = class CQRPSTag extends CQTag {
  constructor () {
    super('rps')
  }

  get type () {
    return this.data.type
  }

  coerce () {
    this.data.type = Number(this.data.type)
    return this
  }
}
