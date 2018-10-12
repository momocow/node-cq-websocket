// stuffs of stubbing
const { spy } = require('sinon')

const { test } = require('ava')
const { CQWebSocketAPI: { CQWebSocket, WebSocketType } } = require('../fixture/connect-success')()

test.cb('#isSockConnected(wsType=/event)', function (t) {
  t.plan(2)

  const bot = new CQWebSocket()
  bot
    .on('socket.connect', function () {
      t.true(bot.isSockConnected(WebSocketType.EVENT))
      t.end()
    })
    .connect(WebSocketType.EVENT)
  
  t.false(bot.isSockConnected(WebSocketType.EVENT))
})

test.cb('#isSockConnected(wsType=/api)', function (t) {
  t.plan(2)

  const bot = new CQWebSocket()
  bot
    .on('socket.connect', function () {
      t.true(bot.isSockConnected(WebSocketType.API))
      t.end()
    })
    .connect(WebSocketType.API)
  
  t.false(bot.isSockConnected(WebSocketType.API))
})

test('#isSockConnected(): should have thrown', function (t) {
  t.plan(2)

  const bot = new CQWebSocket()
  spy(bot, 'isSockConnected')

  let res
  try {
    res = bot.isSockConnected()
  } catch (e) { }

  t.true(bot.isSockConnected.threw())
  t.is(typeof res, 'undefined')
})
