const $_get = require('lodash.get')

const $safe = require('./util/typeguard')

const isSocketErrorHandled = false

class CQEventBus{
  constructor(){
    // event_type-to-handlers mapping
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
        send: { // API socket only
          pre: [],
          post: []
        },
        response: [], // API socket only
        error: [ onSocketError ], // has a default handler; automatically removed when developers register their own ones
        close: []
      }
    }
  }

  _getHandlerQueue(event_type){
    let queue = $_get(this._EventMap, event_type)
    if(Array.isArray(queue)){
      return queue
    }
    queue = $_get(this._EventMap, `${event_type}.`)
    return Array.isArray(queue) ? queue: undefined
  }

  count(event_type){
    event_type = $safe.string(event_type)

    let queue = this._getHandlerQueue(event_type)
    return queue ? queue.length: undefined
  }

  has(event_type){
    event_type = $safe.string(event_type)

    return this._getHandlerQueue(event_type) !== undefined
  }

  emit(event_type, ...args){
    this._emitThroughHierarchy($safe.string(event_type), ...args)
    return this
  }

  _emitThroughHierarchy(event_type, ...args){
    let queue = [], isResponsable = event_type.startsWith('message')

    for(let hierarchy = event_type.split('.'); hierarchy.length > 0; hierarchy.pop()){
      let currentQueue = this._getHandlerQueue(hierarchy.join('.'))
      if(currentQueue && currentQueue.length > 0){
        queue.push(...currentQueue)
      }
    }

    if(queue && queue.length > 0){
      let cqevent = new CQEvent()
      for(let handler of queue){
        let returned = handler(cqevent, ...args)

        if(isResponsable && typeof returned === "string"){
          cqevent.setMessage(returned)
        }

        if(isResponsable && cqevent.isCanceled()){
          break
        }
      }

      if(isResponsable && cqevent.hasMessage()){
        this('send_msg', {
          ...args[0],
          message: cqevent.getMessage()
        })
      }
    }
  }

  on(event_type, handler){
    event_type = $safe.string(event_type)
    handler = $safe.Function(handler)

    if(!isSocketErrorHandled && event_type === "socket.error"){
      this._EventMap.socket.error = []

      isSocketErrorHandled = true
    }

    let queue = this._getHandlerQueue(event_type)
    if(queue){
      queue.push(handler)
    }
    return this
  }
}

function onSocketError(e, which, err){
  err.which = which
  throw err
}

class CQEvent{
  constructor(){
    this._isCanceled = false
    this._message = ""
  }

  isCanceled(){
    return this._isCanceled
  }

  cancel(){
    this._isCanceled = true
    this._message = ""
  }

  getMessage(){
    return this._message
  }

  hasMessage(){
    return Boolean(this._message)
  }

  setMessage(msgIn){
    this._message = $safe.string(msgIn)
  }
}

module.exports = {
  CQEventBus, CQEvent
}
