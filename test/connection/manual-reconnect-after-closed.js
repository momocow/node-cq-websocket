const { stub } = require('sinon')
const setup = require('../fixture/setup')

const { bot, planCount, assertSpies, done } = setup()

const manualReconnectAfterClosed = stub()
manualReconnectAfterClosed.onCall(0).callsFake(function () {
  bot.disconnect()
})
manualReconnectAfterClosed.onCall(1).callsFake(function () {
  bot.reconnect()
})

module.exports = function (t) {
  t.plan(planCount())

  bot
    .on('ready', function () {
      if (manualReconnectAfterClosed.callCount === 0) {
        manualReconnectAfterClosed()
      } else {
        // Assertion
        assertSpies(t, { connectingCount: 4, connectCount: 4, closingCount: 2, closeCount: 2, reconnectingCount: 2, reconnectCount: 2 })
        t.end()
        done()
      }
    })
    .on('socket.close', function () {
      if (manualReconnectAfterClosed.callCount === 1) {
        manualReconnectAfterClosed()
      }
    })
    .connect()
}
