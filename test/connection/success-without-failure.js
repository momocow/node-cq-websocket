// configs
const CONNECT_DELAY = 500

const setup = require('./utils/setup')
const FakeConnection = require('./utils/FakeConnection')

const { bot, planCount, assertSpies, stubRemote, done } = setup()

function connectSucceed () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, CONNECT_DELAY)
}

stubRemote((stubEvent, stubApi) => {
  stubEvent.callsFake(connectSucceed)
  stubApi.callsFake(connectSucceed)
})

module.exports = function (t) {
  t.plan(planCount())

  bot
    .on('ready', function () {
      // Assertion
      assertSpies(t, { connectCount: 2, connectingCount: 2 })
      t.end()
      done()
    })
    .connect()
}
