// stuffs of stubbing
const { stub, spy } = require('sinon')
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
const { WebsocketType, WebsocketState } = CQWebsocket

test.after.always(function () {
  fakeConnect.restore()
})

test.cb('#isSockConnected(wsType=/event)', function (t) {
  t.plan(2)

  const bot = new CQWebsocket()
  bot
    .on('socket.connect', function () {
      t.true(bot.isSockConnected(WebsocketType.EVENT))
      t.end()
    })
    .connect(WebsocketType.EVENT)
  
  t.false(bot.isSockConnected(WebsocketType.EVENT))
})

test.cb('#isSockConnected(wsType=/api)', function (t) {
  t.plan(2)

  const bot = new CQWebsocket()
  bot
    .on('socket.connect', function () {
      t.true(bot.isSockConnected(WebsocketType.API))
      t.end()
    })
    .connect(WebsocketType.API)
  
  t.false(bot.isSockConnected(WebsocketType.API))
})

test('#isSockConnected(): should have thrown', function (t) {
  t.plan(2)

  const bot = new CQWebsocket()
  spy(bot, 'isSockConnected')

  let res
  try {
    res = bot.isSockConnected()
  } catch (e) { }

  t.true(bot.isSockConnected.threw())
  t.is(typeof res, 'undefined')
})
