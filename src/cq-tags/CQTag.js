/**
 * @abstract
 */
class CQTag {
  constructor (type, options = {}) {
    this.type = type
    this.options = options
  }

  toString () {
    const optStr = Object.keys(this.options).map(k => `${k}=${this.options[k]}`).join(',')
    return `[CQ:${this.type}${optStr ? ',' : ''}${optStr}]`
  }
}

module.exports = CQTag
