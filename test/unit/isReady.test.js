// stuffs of stubbing
const { stub } = require('sinon')

const test = require('ava').default
const { CQWebSocketAPI: { WebSocketType, CQWebSocket } } = require('../fixture/connect-success')()

test.cb('#isReady(): event-enabled, api-enabled, event-connected, api-connected', function (t) {
  t.plan(3)

  const _stub = stub()
  _stub.onCall(0).callsFake(function () {
    t.false(bot.isReady())
  })
  _stub.onCall(1).callsFake(function () {
    t.true(bot.isReady())
    t.end()
  })

  const bot = new CQWebSocket()
    .on('socket.connect', _stub)
    .connect()

  t.false(bot.isReady())
})

test.cb('#isReady(): event-enabled, api-enabled, api-connected', function (t) {
  t.plan(2)

  const _stub = stub()
  _stub.onCall(0).callsFake(function () {
    t.false(bot.isReady())
    t.end()
  })

  const bot = new CQWebSocket()
    .on('socket.connect', _stub)
    .connect(WebSocketType.API)

  t.false(bot.isReady())
})

test('#isReady(): event-disabled, api-disabled', function (t) {
  t.plan(1)

  const bot = new CQWebSocket({ enableEvent: false, enableAPI: false })

  t.true(bot.isReady())
})

test.cb('#isReady(): event-enabled, api-disabled, event-connected', function (t) {
  t.plan(2)

  const bot = new CQWebSocket({ enableAPI: false })
    .on('socket.connect', function () {
      t.true(bot.isReady())
      t.end()
    })
    .connect()

  t.false(bot.isReady())
})
