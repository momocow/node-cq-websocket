import * as CQWebsocket from '../../..'
import { spy, stub } from 'sinon'

export default function () {
  const bot = new CQWebsocket()
  const spies = {
    connecting: spy(),
    connect: spy(),
    failed: spy(),
    closing: spy(),
    close: spy(),
    error: spy()
  }

  bot
    .on('socket.connecting', spies.connecting)
    .on('socket.connect', spies.connecting)
    .on('socket.closing', spies.closing)
    .on('socket.close', spies.close)
    .on('socket.failed', spies.failed)
    .on('socket.error', spies.error)

  return {
    bot,
    spies,

    /**
     * @param {function} fakeEventConnect
     * @param {function} fakeApiConnect
     */
    stubRemote (fakeEventConnect, fakeApiConnect) {
      stub(bot._eventClient, 'connect').callsFake(fakeEventConnect)
      stub(bot._apiClient, 'connect').callsFake(fakeApiConnect)
    },

    /**
     * @param {number} connectingCount
     * @param {number} connectCount
     * @param {number} failedCount
     * @param {number} closingCount
     * @param {number} closeCount
     * @param {number} errorCount
     */
    assertSpies (connectingCount = 0, connectCount, failedCount, closingCount, closeCount, errorCount) {

    },

    done () {
      Object.values(spies).forEach(_spy => {
        _spy.restore()
      })
    }
  }
}
