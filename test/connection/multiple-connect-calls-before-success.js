const setup = require('../fixture/setup')

const { bot, planCount, wsStub, assertSpies, done } = setup()

module.exports = function (t) {
  t.plan(planCount() + 1)

  bot
    .connect()
    .connect()
    .connect()
    .connect()
    .connect()
  
  setTimeout(function () {
    bot
    .connect()
    .connect()
    .connect()
    .connect()
    .connect()
  }, 400) // CONNECT_DELAY (500) - 100 (tolerance)

  setTimeout(function () {
    // Assertion
    assertSpies(t, { connectCount: 2, connectingCount: 2 })
    t.true(wsStub.calledTwice)
    t.end()
    done()
  }, 1000) // CONNECT_DELAY (500) + 500 (tolerance
}
