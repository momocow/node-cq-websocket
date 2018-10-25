const CQTag = require('../CQTag')

module.exports = class CQRecordTag extends CQTag {
  constructor (file, magic) {
    magic = magic ? true : undefined
    super('record', { file, magic })
  }

  get file () {
    return this.data.file
  }

  get magic () {
    return Boolean(this.data.magic)
  }
}
