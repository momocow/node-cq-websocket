const $get = require('lodash.get')

const $safe = require('./util/typeguard')

let isSocketErrorHandled = false

class CQEventBus {
  constructor (cqbot) {
    // eventType-to-handlers mapping
    // blank keys refer to default keys
    this._EventMap = {
      message: {
        '': [],
        private: [],
        group: {
          '': [],
          '@me': []
        },
        discuss: {
          '': [],
          '@me': []
        }
      },
      event: [],
      request: [],
      ready: [],
      error: [],
      socket: {
        connect: [],
        error: [ onSocketError ], // has a default handler; automatically removed when developers register their own ones
        close: []
      },
      api: {
        response: [],
        send: {
          pre: [],
          post: []
        }
      }
    }

    this._bot = cqbot
  }

  _getHandlerQueue (eventType) {
    let queue = $get(this._EventMap, eventType)
    if (Array.isArray(queue)) {
      return queue
    }
    queue = $get(this._EventMap, `${eventType}.`)
    return Array.isArray(queue) ? queue : undefined
  }

  count (eventType) {
    eventType = $safe.string(eventType)

    let queue = this._getHandlerQueue(eventType)
    return queue ? queue.length : undefined
  }

  has (eventType) {
    eventType = $safe.string(eventType)

    return this._getHandlerQueue(eventType) !== undefined
  }

  emit (eventType, ...args) {
    this._emitThroughHierarchy($safe.string(eventType), ...args)
    return this
  }

  async _emitThroughHierarchy (eventType, ...args) {
    let queue = []
    let isResponsable = eventType.startsWith('message')

    for (let hierarchy = eventType.split('.'); hierarchy.length > 0; hierarchy.pop()) {
      let currentQueue = this._getHandlerQueue(hierarchy.join('.'))
      if (currentQueue && currentQueue.length > 0) {
        queue.push(...currentQueue)
      }
    }

    if (queue && queue.length > 0) {
      let cqevent = new CQEvent()
      for (let handler of queue) {
        if (isResponsable && Array.isArray(args)) {
          args.unshift(cqevent)
        }

        let returned = await handler(...args)

        if (isResponsable && typeof returned === 'string') {
          cqevent.setMessage(returned)
        }

        if (isResponsable && cqevent.isCanceled()) {
          break
        }
      }

      if (isResponsable && cqevent.hasMessage()) {
        this._bot('send_msg', {
          ...args[1],
          message: cqevent.getMessage()
        })
      }
    }
  }

  once (eventType, handler) {
    return this.on(eventType, (...args) => {
      let queue = this._getHandlerQueue(eventType)
      let qidx = queue.indexOf(handler)
      let returned = handler(...args)
      if (returned !== false) {
        queue.splice(qidx, 1)
      }
      return returned
    })
  }

  on (eventType, handler) {
    eventType = $safe.string(eventType)
    handler = $safe.function(handler)

    if (!this.has(eventType)) {
      return this
    }

    if (!isSocketErrorHandled && eventType === 'socket.error') {
      this._EventMap.socket.error = []

      isSocketErrorHandled = true
    }

    let queue = this._getHandlerQueue(eventType)
    if (queue) {
      queue.push(handler)
    }
    return this
  }
}

function onSocketError (which, err) {
  err.which = which
  throw err
}

class CQEvent {
  constructor () {
    this._isCanceled = false
    this._message = ''
  }

  isCanceled () {
    return this._isCanceled
  }

  cancel () {
    this._isCanceled = true
  }

  getMessage () {
    return this._message
  }

  hasMessage () {
    return Boolean(this._message)
  }

  setMessage (msgIn) {
    this._message = $safe.string(msgIn)
  }
}

module.exports = {
  CQEventBus, CQEvent
}
