const { EventEmitter } = require('events')

class FakeWebSocket extends EventEmitter {
  constructor ({
    connectBehavior = true,
    CONNECT_DELAY = 500,
    CLOSE_DELAY = 500,
    MSG_DELAY = 500,
    ERROR_DELAY = 500,
  } = {}) {
    super()

    this.options = {
      CONNECT_DELAY,
      CLOSE_DELAY,
      MSG_DELAY,
      ERROR_DELAY
    }

    if (connectBehavior) {
      this.onOpen()
    } else {
      this.onError(true)
    }
  }

  addEventListener (event, listener, { once = false } = {}) {
    return once ? this.once(event, listener) : this.on(event, listener)
  }

  removeEventListener (event, listener) {
    return this.off(event, listener)
  }

  send () {}

  close (code = 1000, reason = 'Normal connection closure') {
    setTimeout (() => {
      this.emit('close', { code, reason })
    }, this.options.CLOSE_DELAY)
  }

  onMessage (data) {
    setTimeout(() => {
      this.emit('message', { data })
    }, this.options.MSG_DELAY)
  }

  onError (wsClean) {
    setTimeout(() => {
      this.emit('error', { type: 'error' })
      if (!wsClean) {
        this.close(5000, 'Closed since the fake error.')
      }
    }, this.options.ERROR_DELAY)
  }

  onOpen () {
    setTimeout(() => {
      this.emit('open')
    }, this.options.CONNECT_DELAY)
  }

  static getSeries (failureCount = 0, options) {
    const it = series(failureCount, options)
    return function fakeWebSocket () {
      return it.next().value
    }
  }
}

function* series (failureCount = 0, options = {}) {
  for (let i = 0; i < failureCount; i++) {
    yield new FakeWebSocket({ ...options, connectBehavior: false })
  }

  while (true) {
    yield new FakeWebSocket()
  }
}

module.exports = FakeWebSocket
