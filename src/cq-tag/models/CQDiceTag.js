const CQTag = require('../CQTag')

module.exports = class CQDiceTag extends CQTag {
  constructor () {
    super('dice')
  }

  get type () {
    return this.data.type
  }
}
