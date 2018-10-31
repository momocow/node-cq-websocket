const CQTag = require('../CQTag')

module.exports = class CQRecord extends CQTag {
  constructor (file, magic) {
    super('record', { file })
    this.magic = magic
  }

  get file () {
    return this.data.file
  }

  hasMagic () {
    return Boolean(this.modifier.magic)
  }

  get magic () {
    return this.modifier.magic
  }

  set magic (magic) {
    this.modifier.magic = magic ? true : undefined
  }

  coerce () {
    this.data.file = String(this.data.file)
    return this
  }
}
