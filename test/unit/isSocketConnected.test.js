// stuffs of stubbing
const { spy } = require('sinon')

const { test } = require('ava')
const { CQWebSocketAPI: { CQWebsocket, WebsocketType } } = require('../fixture/connect-success')()

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
