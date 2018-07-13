// configs
const CONNECT_DELAY = 500
const FAILURE_COUNT = 5

const setup = require('./utils/setup')
const FakeConnection = require('./utils/FakeConnection')

const { bot, planCount, assertSpies, stubRemote, done } = setup()

function connectSucceed () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, CONNECT_DELAY)
}

function connectFail () {
  setTimeout(() => {
    this.emit('connectFailed', 'connection failed')
  }, CONNECT_DELAY)
}

stubRemote((stubEvent, stubApi) => {
  [ stubEvent, stubApi ].forEach(stub => {
    for (let i = 0; i < FAILURE_COUNT; i++) {
      stub.onCall(i).callsFake(connectFail)
    }
    stub.onCall(FAILURE_COUNT).callsFake(connectSucceed)
  })
})

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
        errorCount: FAILURE_COUNT * 2
      })
      t.end()
      done()
    })
    .connect()
}
