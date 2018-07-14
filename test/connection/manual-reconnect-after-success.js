// configs
const CONNECT_DELAY = 500

const { stub } = require('sinon')
const setup = require('../fixture/setup')
const FakeConnection = require('../fixture/FakeConnection')

const { bot, planCount, assertSpies, stubRemote, done } = setup()

const manualReconnect = stub()
manualReconnect.callsFake(function () {
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

  bot
    .on('ready', function () {
      if (manualReconnect.called) {
        // Assertion
        assertSpies(t, {
          connectingCount: 4,
          connectCount: 4,
          closingCount: 2,
          closeCount: 2,
          reconnectingCount: 2,
          reconnectCount: 2
        })
        t.end()
        done()
      } else {
        manualReconnect()
      }
    })
    .connect()
}
