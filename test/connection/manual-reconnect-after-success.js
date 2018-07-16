const { stub } = require('sinon')
const setup = require('../fixture/setup')

const { bot, planCount, assertSpies, done } = setup()

const manualReconnect = stub()
manualReconnect.callsFake(function () {
  bot.reconnect()
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
