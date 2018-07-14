// configs
const CONNECT_DELAY = 500
const RECONNECT_ATTEMPTS = 10

const setup = require('../fixture/setup')
const FakeConnection = require('../fixture/FakeConnection')

const { bot, planCount, assertSpies, stubRemote, done } = setup({ reconnectionAttempts: RECONNECT_ATTEMPTS })

function connectFail () {
  setTimeout(() => {
    this.emit('connectFailed', 'connection failed')
  }, CONNECT_DELAY)
}

stubRemote((stubEvent, stubApi) => {
  stubEvent.callsFake(connectFail)
  stubApi.callsFake(connectFail)
})

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
