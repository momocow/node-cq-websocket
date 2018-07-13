const { EventEmitter } = require('events')

module.exports = class FakeConnection extends EventEmitter {
  sendUTF () { }

  /**
   * @param {function} sth
   * @param {number} delay
   */
  do (sth, delay) {
    setTimeout(sth, delay)
    return this
  }
}
