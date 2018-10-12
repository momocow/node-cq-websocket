// stuffs of stubbing
const { stub, spy } = require('sinon')

const { test } = require('ava')
const { CQWebSocketAPI } = require('../fixture/connect-success')()
const { WebSocketType, WebSocketState, CQWebSocket } = CQWebSocketAPI

test.cb('#disconnect() returns the bot itself', function (t) {
  t.plan(1)

  const bot = new CQWebSocket()
    .on('ready', function () {
      t.is(bot.disconnect(), bot)
      t.end()
    })
    .connect()
})

test.cb('#disconnect()', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebSocket()
    .on('socket.closing', _spy)
    .on('ready', function () {
      bot.disconnect()
      t.is(bot._monitor.EVENT.state, WebSocketState.CLOSING)
      t.is(bot._monitor.API.state, WebSocketState.CLOSING)
      t.true(_spy.calledTwice)
      t.end()
    })
    .connect()
})

test.cb('#disconnect(wsType="/event")', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebSocket()
    .on('socket.closing', _spy)
    .on('ready', function () {
      bot.disconnect(WebSocketType.EVENT)
      t.is(bot._monitor.EVENT.state, WebSocketState.CLOSING)
      t.is(bot._monitor.API.state, WebSocketState.CONNECTED)
      t.true(_spy.calledOnce)
      t.end()
    })
    .connect()
})

test.cb('#disconnect(wsType="/api")', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebSocket()
    .on('socket.closing', _spy)
    .on('ready', function () {
      bot.disconnect(WebSocketType.API)
      t.is(bot._monitor.EVENT.state, WebSocketState.CONNECTED)
      t.is(bot._monitor.API.state, WebSocketState.CLOSING)
      t.true(_spy.calledOnce)
      t.end()
    })
    .connect()
})
