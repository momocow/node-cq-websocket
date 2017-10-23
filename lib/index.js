const $EventEmitter = require('events')
const $WebsocketClient = require('websocket').client
const $util = require('util')

const $safe = require('./util/typeguard')
const $Callable = require('./util/callable')

const ALL_EVENTS = [
  'event.message', 'event.close', 'event.error',
  'api.message', 'api.close', 'api.error',
  'message', 'error'
]

module.exports = class CQWebsocket extends $Callable{
  constructor({
    access_token = '',
    enableAPI = true,
    enableEvent = true,
    host = '127.0.0.1',
    master = null
    port = 6700,
    slaves = [],
  } = {}){
    super('__call__')

    this._host = $safe.string(host)
    this._port = $safe.int(port)
    this._token = $safe.string(access_token)
    this._event = $safe.boolean(enableEvent)
    this._api = $safe.boolean(enableAPI)
    this._master = $safe.either(master, ['null', 'instance'], CQWebsocket)
    this._slaves = []

    if(!Array.isArray(slaves)){
      slaves = [ slaves ]
    }
    this.attach(...slaves)

    this._eventBus = new $EventEmitter().setMaxListeners(20)
    this._eventClient = this._event ? new $WebsocketClient(): null
    this._apiClient = this._api ? new $WebsocketClient(): null

    if(this._eventClient){
      this._eventClient
        .on('connect', conn => {
          this._eventSock = conn
            .on('message', (msg) => {
              this._eventBus.emit('event.message', msg)
              this._eventBus.emit('message', msg)
              // if(this._master){
              //   this._master._eventBus.emit('slave.event.message', msg)
              //   this._master._eventBus.emit('message', msg)
              // }
            })
            .on('close', () => {
              this._eventSock = null
              this._eventBus.emit('event.close')
              // if(this._master){
              //   this._master._eventBus.emit('slave.event.close')
              // }
            })
            .on('error', (err) => {
              let wsError = new WebsocketError('Socket error occurs', err)
              this._eventBus.emit('event.error', wsError)
              this._eventBus.emit('error', wsError)
              // if(this._master){
              //   this._master._eventBus.emit('slave.event.error', wsError)
              //   this._master._eventBus.emit('error', wsError)
              // }
            })
        })
        .on('connectFailed', err => {
          let wsError = new WebsocketError('Connection Failed', err)
          this._eventBus.emit('event.error', wsError)
          this._eventBus.emit('error', wsError)
          // if(this._master){
          //   this._master._eventBus.emit('slave.event.error', wsError)
          //   this._master._eventBus.emit('error', wsError)
          // }
        })
    }

    if(this._apiClient){
      this._apiClient
        .on('connect', conn => {
          this._apiSock = conn
            .on('message', () => {
              this._eventBus.emit('api.message', msg)
              this._eventBus.emit('message', msg)
              // if(this._master){
              //   this._master._eventBus.emit('slave.api.message', msg)
              //   this._master._eventBus.emit('message', msg)
              // }
            })
            .on('close', () => {
              this._apiSock = null
              this._eventBus.emit('api.close')
              // if(this._master){
              //   this._master._eventBus.emit('slave.api.close')
              // }
            })
            .on('error', (err) => {
              let wsError = new WebsocketError('Socket error occurs', err)
              this._eventBus.emit('api.error', wsError)
              this._eventBus.emit('error', wsError)
              // if(this._master){
              //   this._master._eventBus.emit('slave.api.error', wsError)
              //   this._master._eventBus.emit('error', wsError)
              // }
            })
        })
        .on('connectFailed', err => {
          let wsError = new WebsocketError('Connection Failed', err)
          this._eventBus.emit('api.error', wsError)
          this._eventBus.emit('error', wsError)
          // if(this._master){
          //   this._master._eventBus.emit('slave.api.error', wsError)
          //   this._master._eventBus.emit('error', wsError)
          // }
        })
    }
  }

  attach(...slaves){
    this._slaves = [
      ...this._slaves,
      ...$safe.array(slaves, 'instance', CQWebsocket)
    ]

    return this
  }

  on(event_type, handler){
    //prevent unused handlers being registered
    if(ALL_EVENTS.indexOf(event_type) >= 0){
      this._eventBus.on(event_type, handler)
    }
    return this
  }

  setMaxListeners(num){
    this._eventBus.setMaxListeners(num)
    return this
  }

  __call__(method, params){
    this._apiSock.sendUTF(JSON.stringify({
      "action": method,
      "params": params
    }))
  }

  connect(){
    if(this._event){
      let tokenQS = this._token ? `?access_token=${this._token}`: ''
      this._eventClient.connect(`ws://${this._host}:${this.port}/event${tokenQS}`)
    }

    if(this._api){
      let tokenQS = this._token ? `?access_token=${this._token}`: ''
      this._apiClient.connect(`ws://${this._host}:${this.port}/api${tokenQS}`)
    }
  }

}


/**
 * An encapsulation for kinds of errors which occur during interacting with websocket
 */
module.exports.WebsocketError = class WebsocketError{
  constructor(msg, originalError){
    this.msg = msg
    this.origin = originalError
  }
}
