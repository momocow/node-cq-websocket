// configs
const CONNECT_DELAY = 500

const { stub } = require('sinon')
const setup = require('../fixture/setup')
const FakeConnection = require('../fixture/FakeConnection')

const { bot, planCount, assertSpies, stubRemote, done } = setup()

const manualReconnectAfterClosed = stub()
manualReconnectAfterClosed.onCall(0).callsFake(function () {
  bot.disconnect()
})
manualReconnectAfterClosed.onCall(1).callsFake(function () {
  bot.reconnect()
})

function connectSucceed () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, CONNECT_DELAY)
}

stubRemote((stubEvent, stubApi) => {
  stubEvent.callsFake(connectSucceed)
  stubApi.callsFake(connectSucceed)
})

module.exports = function (t) {
  t.plan(planCount())

  let times = 0

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
      times++

      if (times === 2) {
        manualReconnectAfterClosed()
      }
    })
    .connect()
}
