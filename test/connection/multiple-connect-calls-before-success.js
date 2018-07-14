// configs
const CONNECT_DELAY = 500

const setup = require('../fixture/setup')
const FakeConnection = require('../fixture/FakeConnection')

const { bot, planCount, stubs, assertSpies, stubRemote, done } = setup()

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
  t.plan(planCount() + 2)

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
  }, CONNECT_DELAY - 100)

  setTimeout(function () {
    // Assertion
    assertSpies(t, { connectCount: 2, connectingCount: 2 })
    t.true(stubs.EVENT.calledOnce)
    t.true(stubs.API.calledOnce)
    t.end()
    done()
  }, CONNECT_DELAY + 500)
}
