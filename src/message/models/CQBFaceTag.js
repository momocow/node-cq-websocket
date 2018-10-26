const CQTag = require('../CQTag')

module.exports = class CQBFaceTag extends CQTag {
  /**
   * @param {number} id
   * @param {string} p
   * @see https://github.com/richardchien/coolq-http-api/wiki/CQ-%E7%A0%81%E7%9A%84%E5%9D%91
   */
  constructor (id, p) {
    super('bface', { id })
    this.modifier.p = p
  }

  get id () {
    return this.data.id
  }

  coerce () {
    this.data.id = Number(this.data.id)
    return this
  }
}
