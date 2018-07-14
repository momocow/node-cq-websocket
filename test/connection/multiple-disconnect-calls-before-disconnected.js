// configs
const CONNECT_DELAY = 500
const CLOSE_DELAY = 500

const { spy } = require('sinon')

const setup = require('../fixture/setup')
const FakeConnection = require('../fixture/FakeConnection')

const { bot, planCount, assertSpies, stubRemote, done } = setup()

/**
 * @type {{[label:string]: sinon.SinonSpy}}
 */
const connectionSpies = {
  EVENT: null,
  API: null
}

function factoryConnectSucceed (label) {
  const conn = new FakeConnection({ CLOSE_DELAY })
  connectionSpies[label] = spy(conn, 'close')
  return function () {
    setTimeout(() => {
      this.emit('connect', conn)
    }, CONNECT_DELAY)
  }
}

stubRemote((stubEvent, stubApi) => {
  stubEvent.callsFake(factoryConnectSucceed('EVENT'))
  stubApi.callsFake(factoryConnectSucceed('API'))
})

module.exports = function (t) {
  t.plan(planCount() + 2)

  bot
    .on('ready', function () {
      bot
        .disconnect()
        .disconnect()
        .disconnect()
        .disconnect()
        .disconnect()

      setTimeout(function () {
        bot
          .disconnect()
          .disconnect()
          .disconnect()
          .disconnect()
          .disconnect()
      }, CLOSE_DELAY - 100)

      setTimeout(function () {
        // Assertion
        assertSpies(t, { connectCount: 2, connectingCount: 2, closingCount: 2, closeCount: 2 })
        t.true(connectionSpies.EVENT.calledOnce)
        t.true(connectionSpies.API.calledOnce)
        t.end()
        done()

        connectionSpies.EVENT.restore()
        connectionSpies.API.restore()
      }, CLOSE_DELAY + 500)
    })
    .connect()
}
