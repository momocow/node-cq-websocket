const CQWebsocket = require('../..')
const { WebsocketType } = CQWebsocket
const { spy, stub } = require('sinon')

const WebSocket = require('websocket').w3cwebsocket

const wsStub = stub(WebSocket.prototype, 'constructor')

module.exports = function (options) {
  const bot = new CQWebsocket(options)
  const spies = {
    connecting: spy(),
    connect: spy(),
    failed: spy(),
    reconnecting: spy(),
    reconnect: spy(),
    reconnect_failed: spy(),
    closing: spy(),
    close: spy(),
    error: spy()
  }

  const stubs = {
    EVENT: stub(),
    API: stub()
  }

  wsStub.callsFake(function (url) {
    if (url.includes(WebsocketType.EVENT)) {
      stubs.EVENT(url)
    } else if (url.includes(WebsocketType.API)) {
      stubs.API(url)
    }
  })

  bot
    .on('socket.connecting', spies.connecting)
    .on('socket.connect', spies.connect)
    .on('socket.reconnecting', spies.reconnecting)
    .on('socket.reconnect', spies.reconnect)
    .on('socket.reconnect_failed', spies.reconnect_failed)
    .on('socket.closing', spies.closing)
    .on('socket.close', spies.close)
    .on('socket.failed', spies.failed)
    .on('socket.error', spies.error)

  return {
    bot,
    spies,
    stubs,

    /**
     * 
     * @param {(stubEvent: sinon.SinonStub, stubApi: sinon.SinonStub)=>void} cb 
     */
    stubRemote (cb) {
      cb(stubs.EVENT, stubs.API)
    },

    planCount () {
      return 9
    },

    assertSpies (
      t,
      {
        connectingCount = 0,
        connectCount = 0,
        failedCount = 0,
        reconnectingCount = 0,
        reconnectCount = 0,
        reconnectFailedCount = 0,
        closingCount = 0,
        closeCount = 0,
        errorCount = 0
      } = {}
    ) {
      t.is(spies.connecting.callCount, connectingCount)
      t.is(spies.connect.callCount, connectCount)
      t.is(spies.closing.callCount, closingCount)
      t.is(spies.close.callCount, closeCount)
      t.is(spies.error.callCount, errorCount)
      t.is(spies.failed.callCount, failedCount)
      t.is(spies.reconnecting.callCount, reconnectingCount)
      t.is(spies.reconnect.callCount, reconnectCount)
      t.is(spies.reconnect_failed.callCount, reconnectFailedCount)
    },

    done () {
      wsStub.reset()
    }
  }
}
