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
const { WebsocketType } = CQWebsocket

test.after.always(function () {
  fakeConnect.restore()
})

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

  const bot = new CQWebsocket()
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

  const bot = new CQWebsocket()
    .on('socket.connect', _stub)
    .connect(WebsocketType.API)

  t.false(bot.isReady())
})

test('#isReady(): event-disabled, api-disabled', function (t) {
  t.plan(1)

  const bot = new CQWebsocket({ enableEvent: false, enableAPI: false })

  t.true(bot.isReady())
})

test.cb('#isReady(): event-enabled, api-disabled, event-connected', function (t) {
  t.plan(2)

  const bot = new CQWebsocket({ enableAPI: false })
    .on('socket.connect', function () {
      t.true(bot.isReady())
      t.end()
    })
    .connect()

  t.false(bot.isReady())
})
