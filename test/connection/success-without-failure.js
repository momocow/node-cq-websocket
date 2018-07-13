import setup from './utils/setup'
import FakeConnection from './utils/FakeConnection'

// configs
const CONNECT_DELAY = 500

const { bot, spies, stubRemote, done } = setup()
stubRemote(fakeEventConnect, fakeApiConnect)

module.exports = function (t) {
  t.plan()

  bot
    .on('ready', function () {
      // Assertion
      t.true(spies.connecting.calledTwice)
      t.true(spies.connect.calledTwice)
      t.true(spies.closing.notCalled)
      t.true(spies.closed.notCalled)
      t.true(spies.error.notCalled)
      t.true(spies.failed.notCalled)
    })
    .connect()
}

function complete () {

}

function fakeEventConnect () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, CONNECT_DELAY)
}

function fakeApiConnect () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, CONNECT_DELAY)
}
