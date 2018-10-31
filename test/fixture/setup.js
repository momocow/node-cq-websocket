const { spy } = require('sinon')

const connectSuccess = require('./connect-success')

module.exports = function (options) {
  const { wsStub, CQWebSocketAPI: { CQWebSocket, WebSocketType } } = connectSuccess()

  const bot = new CQWebSocket(options)
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
    wsStub,

    onMessage (wsType, data) {
      if (!wsType || wsType === WebSocketType.EVENT) {
        bot._eventSock.onMessage(data)
      }
      if (!wsType || wsType === WebSocketType.API) {
        bot._apiSock.onMessage(data)
      }
    },

    onError (wsType) {
      if (!wsType || wsType === WebSocketType.EVENT) {
        bot._eventSock.onError()
      }
      if (!wsType || wsType === WebSocketType.API) {
        bot._apiSock.onError()
      }
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
