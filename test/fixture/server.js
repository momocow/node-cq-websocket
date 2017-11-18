const $WebSocketServer = require('websocket').server
const $Promise = require('bluebird')
const $http = require('http')
const $EventEmitter = require('events')

const WebsocketType = {
  API: '/api',
  EVENT: '/event'
}

/**
 * These are events for test cases to verify the server behavior
 * All event listeners will receive a string of either '/api' or '/event' as the first argument
 * Use WebsocketType.API and WebsocketType.EVENT to identify which connection the event belongs to
 * 1. 'connect': once the connection is established
 * 2. 'connectFailed': once the connection is failed
 * 3. 'token': access_token is provided by the client
 * 4. 'listen'
 * 5. 'shutDown'
 * 6. 'close'
 * 7. 'error'
 */

function serveAPIConnection (controller, conn) {
  controller.emit('connect', WebsocketType.API, conn)

  conn.on('message', function (msg) {
    if (msg.type === 'utf8') {
      controller.emit('message', msg.utf8Data)
    }
  })
    .on('close', function () {
      conn = null
      controller.emit('close', WebsocketType.API)
    })
    .on('error', function (err) {
      controller.emit('error', WebsocketType.API, err)
    })
}

function serveEventConnection (controller, conn) {
  controller.emit('connect', WebsocketType.EVENT, conn)

  controller.on('send', function (msg) {
    if (conn) {
      conn.sendUTF(msg)
    }
  })

  conn.on('close', function () {
    conn = null
    controller.emit('close', WebsocketType.EVENT)
  })
    .on('error', function (err) {
      controller.emit('error', WebsocketType.EVENT, err)
    })
}

function _createServer (host, port, resolve, reject) {
  let controller = new $EventEmitter()
  let httpServer = $http.createServer()

  controller._sock =
    new $WebSocketServer({
      httpServer: httpServer,
      autoAcceptConnections: false
    })
    .on('request', function (request) {
      let matched = request.resource.match(/access_token=([^&]*)/)
      let token = (matched) ? matched[1] : ''

      if (request.resource.startsWith('/event')) {
        if (token) controller.emit('token', WebsocketType.EVENT, token)
        serveEventConnection(controller, request.accept(null, request.origin))
      } else if (request.resource.startsWith('/api')) {
        if (token) controller.emit('token', WebsocketType.API, token)
        serveAPIConnection(controller, request.accept(null, request.origin))
      } else {
        controller.emit('connectFailed')
        request.reject()
      }
    })

  controller.send = function (msg) {
    controller.emit('send', msg)
  }
  controller.shutDown = function () {
    return new $Promise(function (resolve) {
      if (controller._sock) {
        controller._sock.shutDown()
        controller._sock = null
      }
      httpServer.close(function () {
        controller.emit('shutDown')
        resolve()
      })
    })
  }
  controller.reset = function () {
    if (controller._sock) {
      controller._sock.closeAllConnections()
    }
    controller.removeAllListeners()
  }
  controller.closeAllConnections = function () {
    if (controller._sock) {
      controller._sock.closeAllConnections()
    }
  }

  try {
    httpServer.listen(port, host, function () {
      let addrObj = httpServer.address()
      controller.emit('listen', addrObj.address, addrObj.port)
      resolve(controller)
    })
  } catch (err) {
    reject(err)
  }
}

/**
 * @throws EADDRINUSE
 */
module.exports = function (host, port) {
  return new $Promise(function (resolve, reject) {
    _createServer(host, port, resolve, reject)
  })
}
