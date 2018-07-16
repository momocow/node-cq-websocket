const EMIT_DELAY = 100

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

const CQWebsocket = require('../..')
const { test } = require('ava')

const MSG_OBJ = {
  post_type: 'message',
  message_type: 'private',
  raw_message: 'Test'
}

function emitMessage () {
  setTimeout(function () {
    sock.emit('message', {
      type: 'utf8',
      utf8Data: JSON.stringify(MSG_OBJ)
    })
  }, EMIT_DELAY)
}


let sock
let bot
let callSpy

test.before.cb(function (t) {
  bot = new CQWebsocket()
    .on('ready', function () {
      sock = bot._eventSock._connection
      t.end()
    })
    .connect()
  callSpy = spy(bot._eventBus, '_bot')
})

test.cb('CQEvent: return string in message handler', function (t) {
  t.plan(1)

  bot
    .on('message.private', function () {
      return 'ok'
    })
    .on('api.send.post', function () {
      t.true(callSpy.calledWith('send_msg', {
        ...MSG_OBJ,
        message: 'ok'
      }))
      t.end()
    })
  
  emitMessage()
})

test.cb('CQEvent: call #setMessage() on the CQEvent', function (t) {
  t.plan(1)

  bot
    .on('message.private', function (e) {
      e.setMessage('ok')
    })
    .on('api.send.post', function () {
      t.true(callSpy.calledWith('send_msg', {
        ...MSG_OBJ,
        message: 'ok'
      }))
      t.end()
    })
  
  emitMessage()
})

test.cb('CQEvent: gain the right of making a response via #cancel()', function (t) {
  t.plan(1)

  bot
    .on('message.private', function (e) {
      e.setMessage('ok')
      e.cancel()
    })
    .on('message.private', function (e) {
      e.setMessage('error')
    })
    .on('api.send.post', function () {
      t.true(callSpy.calledWith('send_msg', {
        ...MSG_OBJ,
        message: 'ok'
      }))
      t.end()
    })
  
  emitMessage()
})
