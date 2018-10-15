const { CQWebSocket, WebSocketState } = require('../..')

const { test } = require('ava')

test('new CQWebSocket() with default options', function (t) {
  t.plan(8)

  const bot = new CQWebSocket()

  t.is(bot._monitor.EVENT.state, WebSocketState.INIT)
  t.is(bot._monitor.API.state, WebSocketState.INIT)
  t.is(bot._baseUrl, 'ws://127.0.0.1:6700')
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

test('new CQWebSocket() with custom options', function (t) {
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

  t.is(bot._monitor.EVENT.state, WebSocketState.INIT)
  t.is(bot._monitor.API.state, WebSocketState.DISABLED)
  t.is(bot._baseUrl, 'ws://8.8.8.8:8888/ws')
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

test('new Websocket(): protocol', function (t) {
  t.plan(2)

  const bot1 = new CQWebSocket({
    protocol: 'HTTP'
  })

  t.is(bot1._baseUrl, 'http://127.0.0.1:6700')

  const bot2 = new CQWebSocket({
    protocol: 'wss:',
    port: 23456
  })

  t.is(bot2._baseUrl, 'wss://127.0.0.1:23456')
})

test('new Websocket(): base url', function (t) {
  t.plan(2)
  
  const bot1 = new CQWebSocket({
    baseUrl: '127.0.0.1:22222'
  })

  t.is(bot1._baseUrl, 'ws://127.0.0.1:22222')

  const bot2 = new CQWebSocket({
    baseUrl: 'wss://my.dns/bot'
  })

  t.is(bot2._baseUrl, 'wss://my.dns/bot')
})
