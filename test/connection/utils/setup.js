const CQWebsocket = require('../../..')
const { spy, stub } = require('sinon')

module.exports = function (options) {
  const bot = new CQWebsocket(options)
  const spies = {
    connecting: spy(),
    connect: spy(),
    failed: spy(),
    closing: spy(),
    close: spy(),
    error: spy()
  }
  const stubs = {
    EVENT: stub(bot._eventClient, 'connect'),
    API: stub(bot._apiClient, 'connect')
  }

  bot
    .on('socket.connecting', spies.connecting)
    .on('socket.connect', spies.connect)
    .on('socket.closing', spies.closing)
    .on('socket.close', spies.close)
    .on('socket.failed', spies.failed)
    .on('socket.error', spies.error)

  return {
    bot,
    spies,

    /**
     * 
     * @param {(stubEvent: sinon.SinonStub, stubApi: sinon.SinonStub)=>void} cb 
     */
    stubRemote (cb) {
      cb(stubs.EVENT, stubs.API)
    },

    planCount () {
      return 6
    },

    assertSpies (t, { connectingCount = 0, connectCount = 0, failedCount = 0, closingCount = 0, closeCount = 0, errorCount = 0 } = {}) {
      t.is(spies.connecting.callCount, connectingCount)
      t.is(spies.connect.callCount, connectCount)
      t.is(spies.closing.callCount, closingCount)
      t.is(spies.close.callCount, closeCount)
      t.is(spies.error.callCount, errorCount)
      t.is(spies.failed.callCount, failedCount)
    },

    done () {
      stubs.EVENT.restore()
      stubs.API.restore()
    }
  }
}
