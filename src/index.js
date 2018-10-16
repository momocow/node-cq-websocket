const $WebSocket = require('websocket').w3cwebsocket
const shortid = require('shortid')
const $get = require('lodash.get')
const $CQEventBus = require('./event-bus.js').CQEventBus
const $Callable = require('./util/callable')
const $CQAtTag = require('./cq-tags/CQAtTag')
const $CQ = require('./cq-tags/cq-utils')
const { SocketError, InvalidWsTypeError, InvalidContextError, ApiTimoutError } = require('./errors')

const WebsocketType = {
  API: '/api',
  EVENT: '/event'
}

const WebsocketState = {
  DISABLED: -1, INIT: 0, CONNECTING: 1, CONNECTED: 2, CLOSING: 3, CLOSED: 4
}

const WebSocketProtocols = [
  'https:',
  'http:',
  'ws:',
  'wss:'
]

class CQWebsocket extends $Callable {
  constructor ({
    // connectivity configs
    protocol = 'ws:',
    host = '127.0.0.1',
    port = 6700,
    access_token: accessToken = '',
    baseUrl,

    // application aware configs
    enableAPI = true,
    enableEvent = true,
    qq = -1,

    // reconnection configs
    reconnection = true,
    reconnectionAttempts = Infinity,
    reconnectionDelay = 1000,

    // API request options
    requestOptions = {},

    // underlying websocket configs, only meaningful in Nodejs environment
    fragmentOutgoingMessages = false,
    fragmentationThreshold,
    tlsOptions
  } = {}) {
    super('__call__')

    /// *****************/
    //     poka-yoke 😇
    /// *****************/
    protocol = protocol.toLowerCase()
    if (protocol && !protocol.endsWith(':')) protocol += ':'
    if (
      baseUrl &&
      WebSocketProtocols.filter(proto => baseUrl.startsWith(proto + '//')).length === 0
    ) {
      baseUrl = `${protocol}//${baseUrl}`
    }

    /// *****************/
    //     options
    /// *****************/

    this._token = String(accessToken)
    this._qq = parseInt(qq)
    this._atme = new $CQAtTag(this._qq)
    this._baseUrl = baseUrl || `${protocol}//${host}:${port}`

    this._reconnectOptions = {
      reconnection,
      reconnectionAttempts,
      reconnectionDelay
    }

    this._requestOptions = typeof requestOptions !== 'object' ? {} : requestOptions

    this._wsOptions = { }

    Object
      .entries({
        fragmentOutgoingMessages,
        fragmentationThreshold,
        tlsOptions
      })
      .filter(([ k, v ]) => v !== undefined)
      .forEach(([ k, v ]) => {
        this._wsOptions[k] = v
      })

    /// *****************/
    //     states
    /// *****************/

    this._monitor = {
      EVENT: {
        attempts: 0,
        state: enableEvent ? WebsocketState.INIT : WebsocketState.DISABLED,
        reconnecting: false
      },
      API: {
        attempts: 0,
        state: enableAPI ? WebsocketState.INIT : WebsocketState.DISABLED,
        reconnecting: false
      }
    }

    /**
     * @type {Map<string, {onSuccess:Function,onFailure:Function}>}
     */
    this._responseHandlers = new Map()

    this._eventBus = new $CQEventBus(this)
  }

  off (eventType, handler) {
    this._eventBus.off(eventType, handler)
    return this
  }

  on (eventType, handler) {
    this._eventBus.on(eventType, handler)
    return this
  }

  once (eventType, handler) {
    this._eventBus.once(eventType, handler)
    return this
  }

  __call__ (method, params, optionsIn) {
    if (!this._apiSock) return Promise.reject(new Error('API socket has not been initialized.'))

    let options = {
      timeout: Infinity,
      ...this._requestOptions
    }

    if (typeof optionsIn === 'number') {
      options.timeout = optionsIn
    } else if (typeof optionsIn === 'object') {
      options = {
        ...options,
        ...optionsIn
      }
    }

    return new Promise((resolve, reject) => {
      let ticket
      const apiRequest = {
        action: method,
        params: params
      }

      this._eventBus.emit('api.send.pre', apiRequest)

      const onSuccess = (ctxt) => {
        if (ticket) {
          clearTimeout(ticket)
          ticket = undefined
        }
        this._responseHandlers.delete(reqid)
        delete ctxt.echo
        resolve(ctxt)
      }

      const onFailure = (err) => {
        this._responseHandlers.delete(reqid)
        reject(err)
      }

      const reqid = shortid.generate()

      this._responseHandlers.set(reqid, { onFailure, onSuccess })
      this._apiSock.send(JSON.stringify({
        ...apiRequest,
        echo: { reqid }
      }))

      this._eventBus.emit('api.send.post')

      if (options.timeout < Infinity) {
        ticket = setTimeout(() => {
          this._responseHandlers.delete(reqid)
          onFailure(new ApiTimoutError(options.timeout, apiRequest))
        }, options.timeout)
      }
    })
  }

  _handle (msgObj) {
    switch (msgObj.post_type) {
      case 'message':
        // parsing coolq tags
        const tags = $CQ.parse(msgObj.raw_message)

        switch (msgObj.message_type) {
          case 'private':
            this._eventBus.emit('message.private', msgObj)
            break
          case 'discuss':
            {
              // someone is @-ed
              const attags = tags.filter(t => t instanceof $CQAtTag)
              if (attags.length > 0) {
                if (attags.filter(t => t.equals(this._atme)).length > 0) {
                  this._eventBus.emit('message.discuss.@.me', msgObj)
                } else {
                  this._eventBus.emit('message.discuss.@', msgObj, attags)
                }
              } else {
                this._eventBus.emit('message.discuss', msgObj)
              }
            }
            break
          case 'group':
            {
              const attags = tags.filter(t => t instanceof $CQAtTag)
              if (attags.length > 0) {
                if (attags.filter(t => t.equals(this._atme)).length > 0) {
                  this._eventBus.emit('message.group.@.me', msgObj)
                } else {
                  this._eventBus.emit('message.group.@', msgObj, attags)
                }
              } else {
                this._eventBus.emit('message.group', msgObj)
              }
            }
            break
          default:
            this._eventBus.emit('error', new Error(`Unexpected "message_type"\n${JSON.stringify(msgObj, null, 2)}`))
        }
        break
      case 'event': // Deprecated, reason: CQHttp 3.X
        this._eventBus.emit('event', msgObj)
        break
      case 'notice': // Added, reason: CQHttp 4.X
        switch (msgObj.notice_type) {
          case 'group_upload':
            this._eventBus.emit('notice.group_upload', msgObj)
            break
          case 'group_admin':
            switch (msgObj.sub_type) {
              case 'set':
                this._eventBus.emit('notice.group_admin.set', msgObj)
                break
              case 'unset':
                this._eventBus.emit('notice.group_admin.unset', msgObj)
                break
              default:
                this._eventBus.emit('error', new Error(`Unexpected "sub_type"\n${JSON.stringify(msgObj, null, 2)}`))
            }
            break
          case 'group_decrease':
            switch (msgObj.sub_type) {
              case 'leave':
                this._eventBus.emit('notice.group_decrease.leave', msgObj)
                break
              case 'kick':
                this._eventBus.emit('notice.group_decrease.kick', msgObj)
                break
              case 'kick_me':
                this._eventBus.emit('notice.group_decrease.kick_me', msgObj)
                break
              default:
                this._eventBus.emit('error', new Error(`Unexpected "sub_type"\n${JSON.stringify(msgObj, null, 2)}`))
            }
            break
          case 'group_increase':
            switch (msgObj.sub_type) {
              case 'approve':
                this._eventBus.emit('notice.group_increase.approve', msgObj)
                break
              case 'invite':
                this._eventBus.emit('notice.group_increase.invite', msgObj)
                break
              default:
                this._eventBus.emit('error', new Error(`Unexpected "sub_type"\n${JSON.stringify(msgObj, null, 2)}`))
            }
            break
          case 'friend_add':
            this._eventBus.emit('notice.friend_add', msgObj)
            break
          default:
            this._eventBus.emit('error', new Error(`Unexpected "notice_type"\n${JSON.stringify(msgObj, null, 2)}`))
        }
        break
      case 'request':
        switch (msgObj.request_type) {
          case 'friend':
            this._eventBus.emit('request.friend', msgObj)
            break
          case 'group':
            switch (msgObj.sub_type) {
              case 'add':
                this._eventBus.emit('request.group.add', msgObj)
                break
              case 'invite':
                this._eventBus.emit('request.group.invite', msgObj)
                break
              default:
                this._eventBus.emit('error', new Error(`Unexpected "sub_type"\n${JSON.stringify(msgObj, null, 2)}`))
            }
            break
          default:
            this._eventBus.emit('error', new Error(`Unexpected "request_type"\n${JSON.stringify(msgObj, null, 2)}`))
        }
        break
      default:
        this._eventBus.emit('error', new Error(`Unexpected "post_type"\n${JSON.stringify(msgObj, null, 2)}`))
    }
  }

  /**
   * @param {(wsType: "/api"|"/event", label: "EVENT"|"API", client: $WebSocket) => void} cb
   * @param {"/api"|"/event"} [types]
   */
  _forEachSock (cb, types = [ WebsocketType.EVENT, WebsocketType.API ]) {
    if (!Array.isArray(types)) {
      types = [ types ]
    }

    types.forEach((wsType) => {
      cb(wsType, wsType === WebsocketType.EVENT ? 'EVENT' : 'API')
    })
  }

  isSockConnected (wsType) {
    if (wsType === WebsocketType.API) {
      return this._monitor.API.state === WebsocketState.CONNECTED
    } else if (wsType === WebsocketType.EVENT) {
      return this._monitor.EVENT.state === WebsocketState.CONNECTED
    } else {
      throw new InvalidWsTypeError(wsType)
    }
  }

  connect (wsType) {
    this._forEachSock((_type, _label) => {
      if ([ WebsocketState.INIT, WebsocketState.CLOSED ].includes(this._monitor[_label].state)) {
        const tokenQS = this._token ? `?access_token=${this._token}` : ''

        let _sock = new $WebSocket(`${this._baseUrl}/${_label.toLowerCase()}${tokenQS}`, undefined, this._wsOptions)

        if (_type === WebsocketType.EVENT) {
          this._eventSock = _sock
        } else {
          this._apiSock = _sock
        }

        _sock.addEventListener('open', () => {
          this._monitor[_label].state = WebsocketState.CONNECTED
          this._eventBus.emit('socket.connect', WebsocketType[_label], _sock, this._monitor[_label].attempts)
          if (this._monitor[_label].reconnecting) {
            this._eventBus.emit('socket.reconnect', WebsocketType[_label], this._monitor[_label].attempts)
          }
          this._monitor[_label].attempts = 0
          this._monitor[_label].reconnecting = false

          if (this.isReady()) {
            this._eventBus.emit('ready', this)

            // if /api is not disabled, it is ready now.
            // if qq < 0, it is not configured manually by user
            if (this._monitor.API.state !== WebsocketState.DISABLED && this._qq < 0) {
              this('get_login_info')
                .then((ctxt) => {
                  this._qq = parseInt($get(ctxt, 'data.user_id', -1))
                  this._atme = new $CQAtTag(this._qq)
                })
                .catch(err => {
                  this._eventBus.emit('error', err)
                })
            }
          }
        }, {
          once: true
        })

        const _onMessage = (e) => {
          let context
          try {
            context = JSON.parse(e.data)
          } catch (err) {
            this._eventBus.emit('error', new InvalidContextError(_type, e.data))
            return
          }

          if (_type === WebsocketType.EVENT) {
            this._handle(context)
          } else {
            const reqid = $get(context, 'echo.reqid', '')

            let { onSuccess } = this._responseHandlers.get(reqid) || {}

            if (typeof onSuccess === 'function') {
              onSuccess(context)
            }

            this._eventBus.emit('api.response', context)
          }
        }
        _sock.addEventListener('message', _onMessage)

        _sock.addEventListener('close', (e) => {
          this._monitor[_label].state = WebsocketState.CLOSED
          this._eventBus.emit('socket.close', WebsocketType[_label], e.code, e.reason)
          // code === 1000 : normal disconnection
          if (e.code !== 1000 && this._reconnectOptions.reconnection) {
            this.reconnect(this._reconnectOptions.reconnectionDelay, WebsocketType[_label])
          }

          // clean up events
          _sock.removeEventListener('message', _onMessage)

          // clean up refs
          _sock = null
          if (_type === WebsocketType.EVENT) {
            this._eventSock = null
          } else {
            this._apiSock = null
          }
        }, {
          once: true
        })

        _sock.addEventListener('error', () => {
          const errMsg = this._monitor[_label].state === WebsocketState.CONNECTING
            ? 'Failed to establish the websocket connection.'
            : this._monitor[_label].state === WebsocketState.CONNECTED
              ? 'The websocket connection has been hung up unexpectedly.'
              : `Unknown error occured. Conection state: ${this._monitor[_label].state}`
          this._eventBus.emit('socket.error', WebsocketType[_label], new SocketError(errMsg))

          if (this._monitor[_label].state === WebsocketState.CONNECTED) {
            // error occurs after the websocket is connected
            this._monitor[_label].state = WebsocketState.CLOSING
            this._eventBus.emit('socket.closing', WebsocketType[_label])
          } else if (this._monitor[_label].state === WebsocketState.CONNECTING) {
            // error occurs while trying to establish the connection
            this._monitor[_label].state = WebsocketState.CLOSED
            this._eventBus.emit('socket.failed', WebsocketType[_label], this._monitor[_label].attempts)
            if (this._monitor[_label].reconnecting) {
              this._eventBus.emit('socket.reconnect_failed', WebsocketType[_label], this._monitor[_label].attempts)
            }
            this._monitor[_label].reconnecting = false
            if (this._reconnectOptions.reconnection &&
              this._monitor[_label].attempts <= this._reconnectOptions.reconnectionAttempts
            ) {
              this.reconnect(this._reconnectOptions.reconnectionDelay, WebsocketType[_label])
            } else {
              this._eventBus.emit('socket.max_reconnect', WebsocketType[_label], this._monitor[_label].attempts)
            }
          }
        }, {
          once: true
        })

        this._monitor[_label].state = WebsocketState.CONNECTING
        this._monitor[_label].attempts++
        this._eventBus.emit('socket.connecting', _type, this._monitor[_label].attempts)
      }
    }, wsType)
    return this
  }

  disconnect (wsType) {
    this._forEachSock((_type, _label) => {
      if (this._monitor[_label].state === WebsocketState.CONNECTED) {
        const _sock = _type === WebsocketType.EVENT ? this._eventSock : this._apiSock

        this._monitor[_label].state = WebsocketState.CLOSING
        // explicitly provide status code to support both browsers and Node environment
        _sock.close(1000, 'Normal connection closure')
        this._eventBus.emit('socket.closing', _type)
      }
    }, wsType)
    return this
  }

  reconnect (delay = 0, wsType) {
    const _reconnect = (_type, _label) => {
      setTimeout(() => {
        this.connect(_type)
      }, delay)
    }

    this._forEachSock((_type, _label) => {
      if (this._monitor[_label].reconnecting) return

      switch (this._monitor[_label].state) {
        case WebsocketState.CONNECTED:
          this._monitor[_label].reconnecting = true
          this._eventBus.emit('socket.reconnecting', _type, this._monitor[_label].attempts)
          this.disconnect(_type)
          this._eventBus.once('socket.close', (_closedType) => {
            return _closedType === _type ? _reconnect(_type, _label) : false
          })
          break
        case WebsocketState.CLOSED:
        case WebsocketState.INIT:
          this._monitor[_label].reconnecting = true
          this._eventBus.emit('socket.reconnecting', _type, this._monitor[_label].attempts)
          _reconnect(_type, _label)
          break
        default:
      }
    }, wsType)
    return this
  }

  isReady () {
    let isEventReady = this._monitor.EVENT.state === WebsocketState.DISABLED || this._monitor.EVENT.state === WebsocketState.CONNECTED
    let isAPIReady = this._monitor.API.state === WebsocketState.DISABLED || this._monitor.API.state === WebsocketState.CONNECTED
    return isEventReady && isAPIReady
  }

  /**
   * @deprecated
   */
  isConnected () {
    return this.isReady()
  }

}

module.exports = CQWebsocket

// [WARN] Circular reference!
// Workaround for https://github.com/momocow/node-cq-websocket/issues/21
// Will be fixed in v2.0.0
module.exports.default = CQWebsocket

module.exports.WebsocketType = WebsocketType
module.exports.WebsocketState = WebsocketState
module.exports.CQEvent = require('./event-bus.js').CQEvent
