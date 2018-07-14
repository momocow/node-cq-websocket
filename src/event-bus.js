const $get = require('lodash.get')

const $traverse = require('./util/traverse')

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
      notice: {
        '': [],
        group_upload: [],
        group_admin: {
          '': [],
          set: [],
          unset: []
        },
        group_decrease: {
          '': [],
          leave: [],
          kick: [],
          kick_me: []
        },
        group_increase: {
          '': [],
          approve: [],
          invite: []
        },
        friend_add: []
      },
      request: {
        '': [],
        friend: [],
        group: {
          '': [],
          add: [],
          invite: []
        }
      },
      ready: [],
      error: [],
      socket: {
        connecting: [],
        connect: [],
        failed: [],
        reconnecting: [],
        reconnect: [],
        reconnect_failed: [],
        max_reconnect: [],
        error: [],
        closing: [],
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

    this._isSocketErrorHandled = false
    this._bot = cqbot

    // has a default handler; automatically removed when developers register their own ones
    this._installDefaultErrorHandler()
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
    let queue = this._getHandlerQueue(eventType)
    return queue ? queue.length : undefined
  }

  has (eventType) {
    return this._getHandlerQueue(eventType) !== undefined
  }

  emit (eventType, ...args) {
    return this._emitThroughHierarchy(eventType, ...args)
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
      if (isResponsable && Array.isArray(args)) {
        args.unshift(cqevent)
      }

      for (let handler of queue) {
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
    const onceWrapper = (...args) => {
      let returned = handler(...args)
      // if the returned value is `false` which indicates the handler have not yet finish its task,
      // keep the handler for next event handling
      if (returned === false) return

      this.off(eventType, onceWrapper)
      return returned
    }
    return this.on(eventType, onceWrapper)
  }

  off (eventType, handler) {
    if (typeof eventType !== 'string') {
      $traverse(this._EventMap, (value, key, obj) => {
        // clean all handler queues
        if (Array.isArray(value)) {
          value.splice(0, value.length)
          return false
        }
      })
      this._installDefaultErrorHandler()
      return this
    }

    const queue = this._getHandlerQueue(eventType)
    if (queue === undefined) {
      return this
    }

    if (typeof handler !== 'function') {
      // clean all handlers of the event queue specified by eventType
      queue.splice(0, queue.length)
      if (eventType === 'socket.error') {
        this._installDefaultErrorHandler()
      }
      return this
    }

    const idx = queue.indexOf(handler)
    if (idx >= 0) {
      queue.splice(idx, 1)
      if (eventType === 'socket.error' && queue.length === 0) {
        this._installDefaultErrorHandler()
      }
    }
    return this
  }

  _installDefaultErrorHandler () {
    if (this._EventMap.socket.error.length === 0) {
      this._EventMap.socket.error.push(onSocketError)
      this._isSocketErrorHandled = false
    }
  }

  _removeDefaultErrorHandler () {
    if (!this._isSocketErrorHandled) {
      this._EventMap.socket.error.splice(0, this._EventMap.socket.error.length)
      this._isSocketErrorHandled = true
    }
  }

  on (eventType, handler) {
    if (!this.has(eventType)) {
      return this
    }

    if (eventType === 'socket.error') {
      this._removeDefaultErrorHandler()
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
  console.error('\nYou should listen on "socket.error" yourself to avoid those unhandled promise warnings.\n')
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
    this._message = String(msgIn)
  }
}

module.exports = {
  CQEventBus, CQEvent
}
