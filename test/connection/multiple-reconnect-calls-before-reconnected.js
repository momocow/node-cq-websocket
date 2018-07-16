const { spy } = require('sinon')

const setup = require('../fixture/setup')
const { bot, wsStub, planCount, assertSpies, done } = setup()

module.exports = function (t) {
  t.plan(planCount() + 3)

  let hasRun = false

  bot
    .on('ready', function () {
      if (hasRun) return

      hasRun = true

      const closeSpies = {
        EVENT: spy(bot._eventSock, 'close'),
        API: spy(bot._apiSock, 'close')
      }

      bot
        .reconnect()
        .reconnect()
        .reconnect()
        .reconnect()
        .reconnect()

      setTimeout(function () {
        bot
          .reconnect()
          .reconnect()
          .reconnect()
          .reconnect()
          .reconnect()
      }, 900) // connect_delay + close_delay - 100 (tolerance)

      setTimeout(function () {
        // Assertion
        assertSpies(t, {
          connectingCount: 4,
          connectCount: 4,
          closingCount: 2,
          closeCount: 2,
          reconnectingCount: 2,
          reconnectCount: 2
        })
        t.is(wsStub.callCount, 4) // API and EVENT of #connect() + API and EVENT of #reconnect()
        t.true(closeSpies.EVENT.calledOnce)
        t.true(closeSpies.API.calledOnce)
        t.end()
        done()

        closeSpies.EVENT.restore()
        closeSpies.API.restore()
      }, 1500) // connect_delay + close_delay + 500 (tolerance)
    })
    .connect()
}
