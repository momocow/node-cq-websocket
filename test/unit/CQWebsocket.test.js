const CQWebsocket = require('../..')

const { test } = require('ava')

test('new Websocket() with default options', function (t) {
  t.plan(6)

  const bot = new CQWebsocket()

  t.true(bot._event)
  t.true(bot._api)
  t.is(bot._baseUrl, '127.0.0.1:6700')
  t.is(bot._qq, -1)
  t.is(bot._token, '')
  t.deepEqual(bot._reconnectOptions, {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000
  })
})

test('new Websocket() with custom options', function (t) {
  t.plan(6)

  const bot = new CQWebsocket({
    enableAPI: false,
    enableEvent: true,
    baseUrl: '8.8.8.8:8888/ws',
    qq: 123456789,
    access_token: 'qwerasdf',
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000
  })

  t.true(bot._event)
  t.false(bot._api)
  t.is(bot._baseUrl, '8.8.8.8:8888/ws')
  t.is(bot._qq, 123456789)
  t.is(bot._token, 'qwerasdf')
  t.deepEqual(bot._reconnectOptions, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000
  })
})
