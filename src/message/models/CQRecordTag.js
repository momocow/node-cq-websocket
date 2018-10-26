const CQTag = require('../CQTag')

module.exports = class CQRecordTag extends CQTag {
  constructor (file, magic) {
    super('record', { file })
    this.modifier.magic = magic ? true : undefined
  }

  get file () {
    return this.data.file
  }

  hasMagic () {
    return Boolean(this.modifier.magic)
  }

  coerce () {
    this.data.file = String(this.data.file)
  }
}
