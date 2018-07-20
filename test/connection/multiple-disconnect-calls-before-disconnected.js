const { spy } = require('sinon')

const setup = require('../fixture/setup')
const { bot, planCount, assertSpies, done } = setup()

module.exports = function (t) {
  t.plan(planCount() + 2)

  bot
    .on('ready', function () {
      const closeSpies = {
        EVENT: spy(bot._eventSock, 'close'),
        API: spy(bot._apiSock, 'close')
      }

      bot
        .disconnect()
        .disconnect()
        .disconnect()
        .disconnect()
        .disconnect()

      setTimeout(function () {
        bot
          .disconnect()
          .disconnect()
          .disconnect()
          .disconnect()
          .disconnect()
      }, 400) // close_delay - 100

      setTimeout(function () {
        // Assertion
        assertSpies(t, { connectCount: 2, connectingCount: 2, closingCount: 2, closeCount: 2 })
        t.true(closeSpies.EVENT.calledOnce)
        t.true(closeSpies.API.calledOnce)
        t.end()
        done()

        closeSpies.EVENT.restore()
        closeSpies.API.restore()
      }, 1000) // close_delay + 500
    })
    .connect()
}
