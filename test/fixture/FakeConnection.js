const { EventEmitter } = require('events')

module.exports = class FakeConnection extends EventEmitter {
  constructor (options = {}) {
    super()

    this.options = {
      CLOSE_DELAY: 500,
      ...options
    }
  }

  sendUTF () { }

  close (code = 1000, desc = 'Hakuna matata. There\'s nothing to worry about.') {
    setTimeout(() => {
      this.emit('close', code, desc)
    }, this.options.CLOSE_DELAY)
  }

  /**
   * @param {function} sth
   * @param {number} delay
   */
  do (sth, delay) {
    setTimeout(sth.bind(this), delay)
    return this
  }
}
