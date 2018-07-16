// stuffs of stubbing
const { stub, spy } = require('sinon')

const { test } = require('ava')
const { CQWebsocket } = require('../fixture/connect-success')()
const { WebsocketType, WebsocketState } = CQWebsocket

test.cb('#disconnect() returns the bot itself', function (t) {
  t.plan(1)

  const bot = new CQWebsocket()
    .on('ready', function () {
      t.is(bot.disconnect(), bot)
      t.end()
    })
    .connect()
})

test.cb('#disconnect()', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebsocket()
    .on('socket.closing', _spy)
    .on('ready', function () {
      bot.disconnect()
      t.is(bot._monitor.EVENT.state, WebsocketState.CLOSING)
      t.is(bot._monitor.API.state, WebsocketState.CLOSING)
      t.true(_spy.calledTwice)
      t.end()
    })
    .connect()
})

test.cb('#disconnect(wsType="/event")', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebsocket()
    .on('socket.closing', _spy)
    .on('ready', function () {
      bot.disconnect(WebsocketType.EVENT)
      t.is(bot._monitor.EVENT.state, WebsocketState.CLOSING)
      t.is(bot._monitor.API.state, WebsocketState.CONNECTED)
      t.true(_spy.calledOnce)
      t.end()
    })
    .connect()
})

test.cb('#disconnect(wsType="/api")', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebsocket()
    .on('socket.closing', _spy)
    .on('ready', function () {
      bot.disconnect(WebsocketType.API)
      t.is(bot._monitor.EVENT.state, WebsocketState.CONNECTED)
      t.is(bot._monitor.API.state, WebsocketState.CLOSING)
      t.true(_spy.calledOnce)
      t.end()
    })
    .connect()
})
