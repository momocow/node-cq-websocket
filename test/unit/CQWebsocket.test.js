const CQWebSocket = require('../..')
const { WebsocketState } = CQWebSocket

const { test } = require('ava')

test('new Websocket() with default options', function (t) {
  t.plan(8)

  const bot = new CQWebSocket()

  t.is(bot._monitor.EVENT.state, WebsocketState.INIT)
  t.is(bot._monitor.API.state, WebsocketState.INIT)
  t.is(bot._baseUrl, '127.0.0.1:6700')
  t.is(bot._qq, -1)
  t.is(bot._token, '')
  t.deepEqual(bot._reconnectOptions, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000
  })
  t.deepEqual(bot._wsOptions, {
    fragmentOutgoingMessages: false
  })
  t.deepEqual(bot._requestOptions, { })
})

test('new Websocket() with custom options', function (t) {
  t.plan(8)

  const bot = new CQWebSocket({
    enableAPI: false,
    enableEvent: true,
    baseUrl: '8.8.8.8:8888/ws',
    qq: 123456789,
    access_token: 'qwerasdf',
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000,
    fragmentOutgoingMessages: true,
    fragmentationThreshold: 0x4000,
    requestOptions: {
      timeout: 2000
    }
  })

  t.is(bot._monitor.EVENT.state, WebsocketState.INIT)
  t.is(bot._monitor.API.state, WebsocketState.DISABLED)
  t.is(bot._baseUrl, '8.8.8.8:8888/ws')
  t.is(bot._qq, 123456789)
  t.is(bot._token, 'qwerasdf')
  t.deepEqual(bot._requestOptions, {
    timeout: 2000
  })
  t.deepEqual(bot._reconnectOptions, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000
  })
  t.deepEqual(bot._wsOptions, {
    fragmentOutgoingMessages: true,
    fragmentationThreshold: 0x4000
  })
})
