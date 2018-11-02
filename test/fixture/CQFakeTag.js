const shortid = require('shortid')
const CQTag = require('../../src/message/CQTag')

module.exports = class CQFakeTag extends CQTag {
  constructor () {
    super('fake', { id: shortid() })
  }

  get id () {
    return this.data.id
  }

  coerce () {
    this.data.id = String(this.data.id)
    return this
  }
}
