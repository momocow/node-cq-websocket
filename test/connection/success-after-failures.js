// configs
const FAILURE_COUNT = 5

const setup = require('../fixture/setup')
const FakeWebSocket = require('../fixture/FakeWebSocket')
// since there should be 5 failed /event socks and 5 failed /api socks
const fws = FakeWebSocket.getSeries(FAILURE_COUNT * 2)

const { wsStub, bot, planCount, assertSpies, done } = setup()
wsStub.callsFake(fws)

module.exports = function (t) {
  t.plan(planCount())

  bot
    .on('socket.error', () => {})
    .on('ready', function () {
      // Assertion
      assertSpies(t, {
        connectCount: 2,
        connectingCount: FAILURE_COUNT * 2 + 2,
        failedCount: FAILURE_COUNT * 2,
        errorCount: FAILURE_COUNT * 2,
        reconnectingCount: FAILURE_COUNT * 2,
        reconnectCount: 2,
        reconnectFailedCount: (FAILURE_COUNT - 1) * 2
      })
      t.end()
      done()
    })
    .connect()
}
