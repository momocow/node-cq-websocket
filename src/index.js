const $WebsocketClient = require('websocket').client

const $CQEventBus = require('./event-bus.js').CQEventBus
const $safe = require('./util/typeguard')
const $Callable = require('./util/callable')
const $wrapError = require('./errors')

const WebsocketType = {
  API: '/api',
  EVENT: '/event'
}

module.exports = class CQWebsocket extends $Callable {
  constructor ({
    access_token: accessToken = '',
    enableAPI = true,
    enableEvent = true,
    host = '127.0.0.1',
    port = 6700,
    qq = -1
  } = {}) {
    super('__call__')

    this._host = $safe.string(host)
    this._port = $safe.int(port)
    this._token = $safe.string(accessToken)
    this._event = $safe.boolean(enableEvent)
    this._api = $safe.boolean(enableAPI)
    this._qq = $safe.int(parseInt(qq))

    this._eventBus = new $CQEventBus(this)
    this._eventClient = this._event ? new $WebsocketClient({ fragmentOutgoingMessages: false }) : null
    this._apiClient = this._api ? new $WebsocketClient({ fragmentOutgoingMessages: false }) : null

    if (this._eventClient) {
      this._eventClient
        .on('connect', conn => {
          this._eventSock = conn
          this._eventBus.emit('socket.connect', WebsocketType.EVENT, this._eventSock)

          this._eventSock
            .on('message', (msg) => {
              if (msg.type === 'utf8') {
                this._handle(JSON.parse(msg.utf8Data))
              }
            })
            .on('close', (code, desc) => {
              this._eventSock = conn = null
              this._eventBus.emit('socket.close', WebsocketType.EVENT, code, desc)
            })
            .on('error', err => {
              this._eventBus.emit('socket.error', WebsocketType.EVENT, $wrapError(err))
            })
          this._eventBus.emit('ready', WebsocketType.EVENT, this)
        })
        .on('connectFailed', err => {
          this._eventBus.emit('socket.error', WebsocketType.EVENT, $wrapError(err))
          this._eventClient = null
        })
    }

    if (this._apiClient) {
      this._apiClient
        .on('connect', conn => {
          this._apiSock = conn
          this._eventBus.emit('socket.connect', WebsocketType.API, this._apiSock)

          this._apiSock
            .on('message', msg => {
              if (msg.type === 'utf8') {
                this._eventBus.emit('api.response', WebsocketType.API, JSON.parse(msg.utf8Data))
              }
            })
            .on('close', (code, desc) => {
              this._apiSock = conn = null
              this._eventBus.emit('socket.close', WebsocketType.API, code, desc)
            })
            .on('error', err => {
              this._eventBus.emit('socket.error', WebsocketType.API, $wrapError(err))
            })
          this._eventBus.emit('ready', WebsocketType.API, this)
        })
        .on('connectFailed', err => {
          this._eventBus.emit('socket.error', WebsocketType.API, $wrapError(err))
          this._eventClient = null
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
            if (isBotAtted(msgObj.message, this._qq)) {
              this._eventBus.emit('message.discuss.@me', msgObj)
            } else {
              this._eventBus.emit('message.discuss', msgObj)
            }
            break
          case 'group':
            if (isBotAtted(msgObj.message, this._qq)) {
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

  connect () {
    if (this._event) {
      let tokenQS = this._token ? `?access_token=${this._token}` : ''
      this._eventClient.connect(`ws://${this._host}:${this._port}/event${tokenQS}`)
    }

    if (this._api) {
      let tokenQS = this._token ? `?access_token=${this._token}` : ''
      this._apiClient.connect(`ws://${this._host}:${this._port}/api${tokenQS}`)
    }

    return this
  }

  disconnect () {
    if (this._eventSock) {
      this._eventSock.close()
    }

    if (this._apiSock) {
      this._apiSock.close()
    }

    return this
  }

  isConnected () {
    let isEventReady = this._eventSock ? this._eventSock.connected : !this._event
    let isAPIReady = this._apiSock ? this._apiSock.connected : !this._api

    return isEventReady && isAPIReady
  }
}

function isBotAtted (msg, qq) {
  return msg.includes(`[CQ:at,qq=${qq}]`)
}

module.exports.WebsocketType = WebsocketType
module.exports.CQEvent = require('./event-bus.js').CQEvent
