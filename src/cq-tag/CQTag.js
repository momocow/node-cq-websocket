const deepEqual = require('deep-equal')

module.exports = class CQTag {
  /**
   * @param {string} type
   * @param {object} data
   */
  constructor (type, data = null) {
    this.data = data
    this._type = type
    this._modifier = null
  }

  get modifier () {
    return this._modifier || new Proxy({}, {
      set: (t, prop, value) => {
        // lazy init
        this._modifier = {
          [prop]: value
        }
        return true
      }
    })
  }

  set modifier (val) {
    this._modifier = val
  }

  /**
   * @param {CQTag} another
   */
  equals (another) {
    if (!(another instanceof CQTag)) return false
    if (this._type !== another._type) return false
    return deepEqual(this.data, another.data, {
      strict: true
    })
  }

  toJSON () {
    return {
      type: this._type,
      data: this.data,
      modifier: this._modifier
    }
  }

  valueOf () {
    return this.toString()
  }

  toString () {
    let ret = `[CQ:${this._type}`

    for (let k of Object.keys(this.data || {})) {
      if (this.data[k] !== undefined) {
        ret += `,${k}=${this.data[k]}`
      }
    }

    for (let k of Object.keys(this._modifier || {})) {
      if (this._modifier[k] !== undefined) {
        ret += `,${k}=${this._modifier[k]}`
      }
    }

    ret += ']'
    return ret
  }
}
