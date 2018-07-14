// configs
const CONNECT_DELAY = 500
const CLOSE_DELAY = 500

const { spy } = require('sinon')

const setup = require('../fixture/setup')
const FakeConnection = require('../fixture/FakeConnection')

const { bot, stubs, planCount, assertSpies, stubRemote, done } = setup()

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
  t.plan(planCount() + 4)

  let hasRun = false

  bot
    .on('ready', function () {
      if (hasRun) return

      hasRun = true

      bot
        .reconnect()
        .reconnect()
        .reconnect()
        .reconnect()
        .reconnect()

      setTimeout(function () {
        bot
          .reconnect()
          .reconnect()
          .reconnect()
          .reconnect()
          .reconnect()
      }, CONNECT_DELAY + CLOSE_DELAY - 100)

      setTimeout(function () {
        // Assertion
        assertSpies(t, {
          connectingCount: 4,
          connectCount: 4,
          closingCount: 2,
          closeCount: 2,
          reconnectingCount: 2,
          reconnectCount: 2
        })
        t.true(stubs.EVENT.calledTwice)
        t.true(stubs.API.calledTwice)
        t.true(connectionSpies.EVENT.calledOnce)
        t.true(connectionSpies.API.calledOnce)
        t.end()
        done()

        connectionSpies.EVENT.restore()
        connectionSpies.API.restore()
      }, CONNECT_DELAY + CLOSE_DELAY + 500)
    })
    .connect()
}
