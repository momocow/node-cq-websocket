// stuffs of stubbing
const { spy } = require('sinon')

const test = require('ava').default
const { CQWebSocketAPI: { CQWebSocket } } = require('../fixture/connect-success')()

test.cb('#reconnect() returns the bot itself', function (t) {
  t.plan(1)

  const bot = new CQWebSocket()
    .on('ready', function () {
      t.end()
    })
  t.is(bot.reconnect(), bot)
})

test.cb('#reconnect()', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebSocket()
    .on('socket.reconnecting', _spy)
    .on('ready', function () {
      t.end()
    })
    .reconnect()

  t.true(bot._monitor.API.reconnecting)
  t.true(bot._monitor.EVENT.reconnecting)
  t.true(_spy.calledTwice)
})
