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
          '@': {
            '': [],
            'me': []
          }
        },
        discuss: {
          '': [],
          '@': {
            '': [],
            'me': []
          }
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

    /**
     * A function-to-function mapping
     *   from the original listener received via #once(event, listener)
     *   to the once listener wrapper function
     *     which wraps the original listener
     *     and is the listener that is actually registered via #on(event, listener) 
     * @type {WeakMap<Function, Function>}
     */
    this._onceListeners = new WeakMap()

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
      let cqevent = isResponsable ? new CQEvent() : undefined
      if (isResponsable && Array.isArray(args)) {
        args.unshift(cqevent)
      }

      for (let handler of queue) {
        if (isResponsable) {
          // reset
          cqevent._errorHandler = cqevent._responseHandler = cqevent._responseOptions = null
        }

        let returned = await Promise.resolve(handler(...args))

        if (isResponsable && typeof returned === 'string') {
          cqevent.stopPropagation()
          cqevent.setMessage(returned)
        }

        if (isResponsable && cqevent._isCanceled) {
          break
        }
      }

      if (isResponsable && cqevent.hasMessage()) {
        this._bot(
          'send_msg',
          {
            ...args[1],
            message: cqevent.getMessage()
          }, cqevent._responseOptions
        ).then(ctxt => {
          if (typeof cqevent._responseHandler === 'function') {
            cqevent._responseHandler(ctxt)
          }
        }).catch(err => {
          if (typeof cqevent._errorHandler === 'function') {
            cqevent._errorHandler(err)
          } else {
            this.emit('error', err)
          }
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
    this._onceListeners.set(handler, onceWrapper)
    return this.on(eventType, onceWrapper)
  }

  off (eventType, handler) {
    if (typeof eventType !== 'string') {
      this._onceListeners = new WeakMap()
      $traverse(this._EventMap, (value) => {
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
    const wrapperIdx = this._onceListeners.has(handler)
      ? queue.indexOf(this._onceListeners.get(handler)) : -1
    
    // no matter the listener is a once listener wrapper or not,
    // the first occurence of the "handler" (2nd arg passed in) or its wrapper will be removed from the queue
    const victimIdx = idx >= 0 && wrapperIdx >= 0
      ? Math.min(idx, wrapperIdx)
      : idx >= 0
        ? idx
        : wrapperIdx >= 0
          ? wrapperIdx
          : -1

    if (victimIdx >= 0) {
      queue.splice(victimIdx, 1)
      if (victimIdx === wrapperIdx) {
        this._onceListeners.delete(handler)
      }
      if (eventType === 'socket.error' && queue.length === 0) {
        this._installDefaultErrorHandler()
      }
      return this
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

  /**
   * @param {string} eventType
   * @param {function} handler
   */
  on (eventType, handler) {
    // @deprecated
    // keep the compatibility for versions lower than v1.5.0
    if (eventType.endsWith('@me')) {
      eventType = eventType.replace(/\.@me$/, '.@.me')
    }

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
    this._responseHandler = null
    this._responseOptions = null
    this._errorHandler = null
  }

  stopPropagation () {
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

  appendMessage (msgIn) {
    this._message += String(msgIn)
  }

  /**
   * @param {(res: object)=>void} handler
   */
  onResponse (handler, options) {
    if (typeof handler !== 'function') {
      options = handler
      handler = null
    }

    this._responseHandler = handler
    this._responseOptions = options
  }

  /**
   * @param {(error: Error)=>void} handler
   */
  onError (handler) {
    this._errorHandler = handler
  }
}

module.exports = {
  CQEventBus, CQEvent
}
