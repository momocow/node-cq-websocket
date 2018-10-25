const EMIT_DELAY = 100

// stuffs of stubbing
const { stub, spy } = require('sinon')

const { CQWebSocketAPI: { CQWebSocket } } = require('../fixture/connect-success')()
const { ApiTimoutError } = require('../../src/errors')
const { test } = require('ava')

const MSG_OBJ = {
  post_type: 'message',
  message_type: 'private',
  message: 'Test'
}

function emitMessage (t) {
  setTimeout(function () {
    t.context.sock.onMessage(JSON.stringify(MSG_OBJ))
  }, EMIT_DELAY)
}

test.beforeEach.cb(function (t) {
  t.context.bot = new CQWebSocket()
    .on('ready', function () {
      t.context.sock = t.context.bot._eventSock
      t.end()
    })
    .connect()
  t.context.callSpy = spy(t.context.bot._eventBus, '_bot')
})

test.cb('CQEvent: return string in message handler, should also gain the right to reply the message', function (t) {
  t.plan(2)

  t.context.bot
    .on('message.private', function () {
      return 'ok!'
    })
    .on('message.private', function () {
      return 'nothing...'
    })
    .on('message', function () {
      return 'failed...'
    })
    .on('api.send.post', function () {
      t.is(t.context.callSpy.firstCall.args[0], 'send_msg')
      t.is(t.context.callSpy.firstCall.args[1].message, 'ok!')
      t.end()
    })

  emitMessage(t)
})

test.cb('CQEvent: modify the response message on the CQEvent via multiple listeners', function (t) {
  t.plan(2)

  t.context.bot
    .on('message.private', function (e) {
      e.setMessage('o')
    })
    .on('message.private', function (e) {
      if (e.hasMessage()) {
        e.setMessage(e.getMessage() + 'k')
      }
    })
    .on('message', function (e) {
      e.appendMessage('!')
    })
    .on('api.send.post', function () {
      t.is(t.context.callSpy.firstCall.args[0], 'send_msg')
      t.is(t.context.callSpy.firstCall.args[1].message, 'ok!')
      t.end()
    })

  emitMessage(t)
})

test.cb('CQEvent: gain the right of making a response via #stopPropagation()', function (t) {
  t.plan(2)

  t.context.bot
    .on('message.private', function (e) {
      e.setMessage('ok!')
      e.stopPropagation()
    })
    .on('message.private', function (e) {
      e.setMessage('error!')
    })
    .on('api.send.post', function () {
      t.is(t.context.callSpy.firstCall.args[0], 'send_msg')
      t.is(t.context.callSpy.firstCall.args[1].message, 'ok!')
      t.end()
    })

  emitMessage(t)
})

test.cb('CQEvent: listen for response result on the CQEvent', function (t) {
  t.plan(1)

  const stubSend = stub(t.context.bot._apiSock, 'send')
  stubSend.callsFake(function (data) {
    const { echo } = JSON.parse(data)
    this.onMessage(JSON.stringify({
      retcode: 0,
      echo
    }))
  })

  t.context.bot
    .on('message.private', function (e) {
      e.onResponse(function (ctxt) {
        t.is(ctxt.retcode, 0)
        t.end()
        stubSend.restore()
      }, 5000) // timeout: 5 sec

      return 'some messages'
    })
  emitMessage(t)
})

test.cb('CQEvent: listen for response error on the CQEvent', function (t) {
  t.plan(2)

  const errorSpy = spy()

  t.context.bot
    .on('error', errorSpy)
    .on('message.private', function (e) {
      e.onResponse({
        timeout: 1000
      })

      e.onError(function (err) {
        t.true(err instanceof ApiTimoutError)
        t.true(errorSpy.notCalled)
        t.end()
      })

      return 'some messages'
    })

  emitMessage(t)
})

test.cb('CQEvent: response timeout without error handler', function (t) {
  t.plan(2)

  t.context.bot
    .on('error', err => {
      t.true(err instanceof ApiTimoutError)
      t.end()
    })
    .on('message.private', function (e) {
      e.onResponse({
        timeout: 1000
      })

      // no e.onError() is called
      t.falsy(e._errorHandler)

      return 'some messages'
    })

  emitMessage(t)
})
