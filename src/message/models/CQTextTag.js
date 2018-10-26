const CQTag = require('../CQTag')

module.exports = class CQTextTag extends CQTag {
  constructor (text) {
    super('text', { text })
  }

  get text () {
    return this.data.text
  }

  coerce () {
    this.data.text = String(this.data.text)
    return this
  }

  toString () {
    return this.data.text
  }
}
