// configs
const CONNECT_DELAY = 500
const ERROR_DELAY = 500

const setup = require('../fixture/setup')
const FakeConnection = require('../fixture/FakeConnection')

const { bot, planCount, assertSpies, stubRemote, done } = setup()

function errorAfterSuccess () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection().do(function () {
      this.emit('error', new Error('Fake error'))
      this.close(5000, 'Fake connection closed by error')
    }, ERROR_DELAY))
  }, CONNECT_DELAY)
}

function connectSucceed () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, CONNECT_DELAY)
}

stubRemote((stubEvent, stubApi) => {
  [ stubEvent, stubApi ].forEach(stub => {
    stub.onCall(0).callsFake(errorAfterSuccess)
    stub.onCall(1).callsFake(connectSucceed)
  })
})

module.exports = function (t) {
  t.plan(planCount())

  let times = 0
  bot
    .on('ready', function () {
      times++

      if (times === 2) {
        // Assertion
        assertSpies(t, { connectCount: 4, connectingCount: 4, closingCount: 2, closeCount: 2, errorCount: 2, reconnectingCount: 2, reconnectCount: 2 })
        t.end()
        done()
      }
    })
    .connect()
}
