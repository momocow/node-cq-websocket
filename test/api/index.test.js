const { test } = require('ava')

const {
  default: defaultExport,
  CQWebSocket,
  WebSocketType,
  WebSocketState,
  CQEvent
} = require('../..')

test('CQWebSocket is exposed as default export.', (t) => {
  t.plan(1)
  t.is(defaultExport, CQWebSocket)
})

test('API: CQWebSocket', t => {
  t.plan(18)

  t.true(typeof CQWebSocket === 'function')
  t.true(typeof CQWebSocket.prototype === 'object')
  t.true(typeof CQWebSocket.prototype.connect === 'function')
  t.is(CQWebSocket.prototype.connect.length, 1)
  t.true(typeof CQWebSocket.prototype.disconnect === 'function')
  t.is(CQWebSocket.prototype.disconnect.length, 1)
  t.true(typeof CQWebSocket.prototype.isReady === 'function')
  t.is(CQWebSocket.prototype.isReady.length, 0)
  t.true(typeof CQWebSocket.prototype.isSockConnected === 'function')
  t.is(CQWebSocket.prototype.isSockConnected.length, 1)
  t.true(typeof CQWebSocket.prototype.off === 'function')
  t.is(CQWebSocket.prototype.off.length, 2)
  t.true(typeof CQWebSocket.prototype.on === 'function')
  t.is(CQWebSocket.prototype.on.length, 2)
  t.true(typeof CQWebSocket.prototype.once === 'function')
  t.is(CQWebSocket.prototype.once.length, 2)
  t.true(typeof CQWebSocket.prototype.reconnect === 'function')
  t.is(CQWebSocket.prototype.reconnect.length, 2)
})

test('API: CQEvent', t => {
  t.plan(16)

  t.true(typeof CQEvent === 'function')
  t.true(typeof CQEvent.prototype === 'object')
  t.true(typeof CQEvent.prototype.appendMessage === 'function')
  t.is(CQEvent.prototype.appendMessage.length, 1)
  t.true(typeof CQEvent.prototype.getMessage === 'function')
  t.is(CQEvent.prototype.getMessage.length, 0)
  t.true(typeof CQEvent.prototype.hasMessage === 'function')
  t.is(CQEvent.prototype.hasMessage.length, 0)
  t.true(typeof CQEvent.prototype.onError === 'function')
  t.is(CQEvent.prototype.onError.length, 1)
  t.true(typeof CQEvent.prototype.onResponse === 'function')
  t.is(CQEvent.prototype.onResponse.length, 2)
  t.true(typeof CQEvent.prototype.setMessage === 'function')
  t.is(CQEvent.prototype.setMessage.length, 1)
  t.true(typeof CQEvent.prototype.stopPropagation === 'function')
  t.is(CQEvent.prototype.stopPropagation.length, 0)
})

test('API: WebSocketType', t => {
  t.plan(1)
  t.deepEqual(WebSocketType, {
    API: '/api',
    EVENT: '/event'
  })
})

test('API: WebSocketState', t => {
  t.plan(1)
  t.deepEqual(WebSocketState, {
    DISABLED: -1, INIT: 0, CONNECTING: 1, CONNECTED: 2, CLOSING: 3, CLOSED: 4
  })
})