const { stub } = require('sinon')

const setup = require('../fixture/setup')
const { bot, planCount, assertSpies, onError, done } = setup()

const errorStub = stub()
errorStub.onCall(0).callsFake(onError)

module.exports = function (t) {
  t.plan(planCount())

  bot
    .on('ready', function () {
      errorStub()

      if (errorStub.calledTwice) {
        // Assertion
        assertSpies(t, { connectCount: 4, connectingCount: 4, closingCount: 2, closeCount: 2, errorCount: 2, reconnectingCount: 2, reconnectCount: 2 })
        t.end()
        done()
      }
    })
    .connect()
}
