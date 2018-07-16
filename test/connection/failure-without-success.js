const RECONNECT_ATTEMPTS = 10

const setup = require('../fixture/setup')
const { wsStub, bot, planCount, assertSpies, done } = setup({ reconnectionAttempts: RECONNECT_ATTEMPTS })

const FakeWebSocket = require('../fixture/FakeWebSocket')
const fws = FakeWebSocket.getSeries(Infinity)
wsStub.callsFake(fws)

module.exports = function (t) {
  t.plan(planCount() + 2)

  const wsTypes = [ '/api', '/event' ]

  bot
    .on('socket.max_reconnect', function (wsType, attempts) {
      wsTypes.splice(wsTypes.indexOf(wsType), 1)

      // Assertion
      // plus 1 is because "re"-connect means it has already tried to connect once
      t.is(attempts, RECONNECT_ATTEMPTS + 1)

      if (wsTypes.length === 0) {
        const expectedAttempts = (RECONNECT_ATTEMPTS + 1) * 2
        assertSpies(t, {
          connectCount: 0,
          connectingCount: expectedAttempts,
          failedCount: expectedAttempts,
          errorCount: expectedAttempts,
          reconnectingCount: RECONNECT_ATTEMPTS * 2,
          reconnectFailedCount: RECONNECT_ATTEMPTS * 2
        })
        t.end()
        done()
      }
    })
    .connect()
}
