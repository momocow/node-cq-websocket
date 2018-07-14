// stuffs of stubbing
const { spy, stub } = require('sinon')
const { client } = require('websocket')
const FakeConnection = require('../fixture/FakeConnection')
const fakeConnect = stub(client.prototype, 'connect')
fakeConnect.callsFake(function () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, 500)
})

const { test } = require('ava')
const CQWebsocket = require('../..')

test.after.always(function () {
  fakeConnect.restore()
})

test('#reconnect() returns the bot itself', function (t) {
  t.plan(1)

  const bot = new CQWebsocket()
  t.is(bot.reconnect(), bot)
})

test('#reconnect()', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebsocket()
    .on('socket.reconnecting', _spy)
    .reconnect()

  t.true(bot._monitor.API.reconnecting)
  t.true(bot._monitor.EVENT.reconnecting)
  t.true(_spy.calledTwice)
})
