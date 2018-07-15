const $WebsocketClient = this === this.window ? require('websocket').w3cwebsocket : require('websocket').client

const $CQEventBus = require('./event-bus.js').CQEventBus
const $Callable = require('./util/callable')
const { wrapSockError: $wrapSockError, InvalidWsTypeError } = require('./errors')

const WebsocketType = {
  API: '/api',
  EVENT: '/event'
}

const WebsocketState = {
  DISABLED: -1, INIT: 0, CONNECTING: 1, CONNECTED: 2, CLOSING: 3, CLOSED: 4
}

module.exports = class CQWebsocket extends $Callable {
  constructor ({
    access_token: accessToken = '',
    enableAPI = true,
    enableEvent = true,
    host,
    port,
    baseUrl = '127.0.0.1:6700',
    qq = -1,
    reconnection = true,
    reconnectionAttempts = Infinity,
    reconnectionDelay = 1000
  } = {}) {
    super('__call__')

    ///*****************/
    //     options
    ///*****************/

    this._token = String(accessToken)
    this._event = Boolean(enableEvent)
    this._api = Boolean(enableAPI)
    this._qq = parseInt(qq)
    this._baseUrl = host ? `${host}${port ? `:${port}` : '' }` : baseUrl

    this._reconnectOptions = {
      reconnection,
      reconnectionAttempts,
      reconnectionDelay
    }

    ///*****************/
    //     states
    ///*****************/

    this._monitor = {
      EVENT: {
        attempts: 0,
        state: this._event ? WebsocketState.INIT : WebsocketState.DISABLED,
        reconnecting: false
      },
      API: {
        attempts: 0,
        state: this._api ? WebsocketState.INIT : WebsocketState.DISABLED,
        reconnecting: false
      }
    }

    this._eventBus = new $CQEventBus(this)
    this._eventClient = this._event ? new $WebsocketClient({ fragmentOutgoingMessages: false }) : null
    this._apiClient = this._api ? new $WebsocketClient({ fragmentOutgoingMessages: false }) : null

    if (this._eventClient) {
      this._eventClient
        .on('connect', conn => {
          this._eventSock = conn
          this._monitor.EVENT.state = WebsocketState.CONNECTED
          this._eventBus.emit('socket.connect', WebsocketType.EVENT, this._eventSock, this._monitor.EVENT.attempts)
          if (this._monitor.EVENT.reconnecting) {
            this._eventBus.emit('socket.reconnect', WebsocketType.EVENT, this._monitor.EVENT.attempts)
          }
          this._monitor.EVENT.attempts = 0
          this._monitor.EVENT.reconnecting = false

          this._eventSock
            .on('message', (msg) => {
              if (msg.type === 'utf8') {
                this._handle(JSON.parse(msg.utf8Data))
              }
            })
            .on('close', (code, desc) => {
              this._eventSock = conn = null
              this._monitor.EVENT.state = WebsocketState.CLOSED
              this._eventBus.emit('socket.close', WebsocketType.EVENT, code, desc)
              // code === 1000 : normal disconnection
              if (code !== 1000 && this._reconnectOptions.reconnection) {
                this.reconnect(this._reconnectOptions.reconnectionDelay, WebsocketType.EVENT)
              }
            })
            .on('error', err => {
              this._monitor.EVENT.state = WebsocketState.CLOSING
              this._eventBus.emit('socket.closing', WebsocketType.EVENT)
              this._eventBus.emit('socket.error', WebsocketType.EVENT, $wrapSockError(err))
            })
            if (this.isReady()) {
              this._eventBus.emit('ready', this)
            }
        })
        .on('connectFailed', err => {
          this._monitor.EVENT.state = WebsocketState.CLOSED
          this._eventBus.emit('socket.failed', WebsocketType.EVENT, this._monitor.EVENT.attempts)
          this._eventBus.emit('socket.error', WebsocketType.EVENT, $wrapSockError(err))
          if (this._monitor.EVENT.reconnecting) {
            this._eventBus.emit('socket.reconnect_failed', WebsocketType.EVENT, this._monitor.EVENT.attempts)
          }
          this._monitor.EVENT.reconnecting = false
          if (this._reconnectOptions.reconnection &&
            this._monitor.EVENT.attempts <= this._reconnectOptions.reconnectionAttempts
          ) {
            this.reconnect(this._reconnectOptions.reconnectionDelay, WebsocketType.EVENT)
          } else {
            this._eventBus.emit('socket.max_reconnect', WebsocketType.EVENT, this._monitor.EVENT.attempts)
          }
        })
    }

    if (this._apiClient) {
      this._apiClient
        .on('connect', conn => {
          this._apiSock = conn
          this._monitor.API.state = WebsocketState.CONNECTED
          this._eventBus.emit('socket.connect', WebsocketType.API, this._apiSock, this._monitor.API.attempts)
          if (this._monitor.API.reconnecting) {
            this._eventBus.emit('socket.reconnect', WebsocketType.API, this._monitor.API.attempts)
          }
          this._monitor.API.attempts = 0
          this._monitor.API.reconnecting = false

          this._apiSock
            .on('message', msg => {
              if (msg.type === 'utf8') {
                this._eventBus.emit('api.response', WebsocketType.API, JSON.parse(msg.utf8Data))
              }
            })
            .on('close', (code, desc) => {
              this._apiSock = conn = null
              this._monitor.API.state = WebsocketState.CLOSED
              this._eventBus.emit('socket.close', WebsocketType.API, code, desc)
              // code === 1000 : normal disconnection
              if (code !== 1000 && this._reconnectOptions.reconnection) {
                this.reconnect(this._reconnectOptions.reconnectionDelay, WebsocketType.API)
              }
            })
            .on('error', err => {
              this._monitor.API.state = WebsocketState.CLOSING
              this._eventBus.emit('socket.closing', WebsocketType.API)
              this._eventBus.emit('socket.error', WebsocketType.API, $wrapSockError(err))
            })

          if (this.isReady()) {
            this._eventBus.emit('ready', this)
          }
        })
        .on('connectFailed', err => {
          this._monitor.API.state = WebsocketState.CLOSED
          this._eventBus.emit('socket.failed', WebsocketType.API, this._monitor.API.attempts)
          this._eventBus.emit('socket.error', WebsocketType.API, $wrapSockError(err))
          if (this._monitor.API.reconnecting) {
            this._eventBus.emit('socket.reconnect_failed', WebsocketType.API, this._monitor.API.attempts)
          }
          this._monitor.API.reconnecting = false
          if (this._reconnectOptions.reconnection &&
            this._monitor.API.attempts <= this._reconnectOptions.reconnectionAttempts
          ) {
            this.reconnect(this._reconnectOptions.reconnectionDelay, WebsocketType.API)
          } else {
            this._eventBus.emit('socket.max_reconnect', WebsocketType.API, this._monitor.API.attempts)
          }
        })
    }
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

  __call__ (method, params) {
    if (!this._apiSock) return

    let apiRequest = {
      'action': method,
      'params': params
    }

    this._eventBus.emit('api.send.pre', WebsocketType.API, apiRequest)
    this._apiSock.sendUTF(JSON.stringify(apiRequest))
    this._eventBus.emit('api.send.post', WebsocketType.API)

    return this
  }

  _handle (msgObj) {
    switch (msgObj.post_type) {
      case 'message':
        switch (msgObj.message_type) {
          case 'private':
            this._eventBus.emit('message.private', msgObj)
            break
          case 'discuss':
            if (isBotAtted(msgObj.raw_message, this._qq)) {
              this._eventBus.emit('message.discuss.@me', msgObj)
            } else {
              this._eventBus.emit('message.discuss', msgObj)
            }
            break
          case 'group':
            if (isBotAtted(msgObj.raw_message, this._qq)) {
              this._eventBus.emit('message.group.@me', msgObj)
            } else {
              this._eventBus.emit('message.group', msgObj)
            }
            break
          default:
            this._eventBus.emit('message', msgObj)
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
                this._eventBus.emit('notice.group_admin', msgObj)
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
                this._eventBus.emit('notice.group_decrease', msgObj)
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
                this._eventBus.emit('notice.group_increase', msgObj)
            }
            break
          case 'friend_add':
            this._eventBus.emit('notice.friend_add', msgObj)
            break
          default:
            this._eventBus.emit('notice', msgObj)
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
                this._eventBus.emit('request.group', msgObj)
            }
            break
          default:
            this._eventBus.emit('request', msgObj)
        }
        break
      default:
        this._eventBus.emit('error',
          new Error(`The message received from CoolQ HTTP API plugin has invalid property 'post_type'.\n${JSON.stringify(msgObj)}`))
    }
  }

  /**
   * @param {(wsType: "/api"|"/event", label: "EVENT"|"API", client: $WebsocketClient) => void} cb
   * @param {"/api"|"/event"} [types]
   */
  _forEachSock (cb, types = [ WebsocketType.EVENT, WebsocketType.API ]) {
    if (!Array.isArray(types)) {
      if (![ WebsocketType.EVENT, WebsocketType.API ].includes(types)) {
        throw new InvalidWsTypeError(wsType)
      }

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
        const _client = _type === WebsocketType.EVENT ? this._eventClient : this._apiClient
        const tokenQS = this._token ? `?access_token=${this._token}` : ''

        this._monitor[_label].state = WebsocketState.CONNECTING
        this._monitor[_label].attempts++
        _client.connect(`ws://${this._baseUrl}/${_label.toLowerCase()}${tokenQS}`)
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
        _sock.close()
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

function isBotAtted (msg, qq) {
  return msg.includes(`[CQ:at,qq=${qq}]`)
}

module.exports.WebsocketType = WebsocketType
module.exports.WebsocketState = WebsocketState
module.exports.CQEvent = require('./event-bus.js').CQEvent
