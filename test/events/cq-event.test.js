const EMIT_DELAY = 100

// stuffs of stubbing
const { stub, spy } = require('sinon')

const { CQWebSocketAPI: { CQWebSocket, CQAt, APITimeoutError } } = require('../fixture/connect-success')()
const test = require('ava').default

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

test.cb('CQEvent: return string in message event listener', function (t) {
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

test.cb('CQEvent: return a list of CQTag/CQHTTPMessage objects in message event listener', function (t) {
  t.plan(2)

  t.context.bot
    .on('message.private', function () {
      return [
        {
          type: 'text',
          data: {
            text: 'ok!'
          }
        },
        new CQAt(123456789)
      ]
    })
    .on('message.private', function () {
      return [
        {
          type: 'text',
          data: {
            text: 'nothing...'
          }
        },
        new CQAt(-1)
      ]
    })
    .on('message', function () {
      return [
        {
          type: 'text',
          data: {
            text: 'failed...'
          }
        },
        new CQAt(-2)
      ]
    })
    .on('api.send.post', function () {
      t.is(t.context.callSpy.firstCall.args[0], 'send_msg')
      t.deepEqual(t.context.callSpy.firstCall.args[1].message, [
        {
          type: 'text',
          data: {
            text: 'ok!'
          }
        },
        {
          type: 'at',
          data: {
            qq: '123456789'
          }
        }
      ])
      t.end()
    })

  emitMessage(t)
})

test.cb('CQEvent: can decide which type of messages to append on according to the format', function (t) {
  t.plan(2)

  t.context.bot
    .on('message.private', function (e) {
      e.setMessage([ new CQAt(1), ' ' ])
    })
    .on('message.private', function (e) {
      const msg = e.messageFormat === 'array'
        ? { type: 'text', data: { text: 'hello' } }
        : 'hello'
      e.appendMessage(msg)
    })
    .on('message.private', function (e) {
      e.appendMessage(' world')
    })
    .on('api.send.post', function () {
      t.is(t.context.callSpy.firstCall.args[0], 'send_msg')
      t.deepEqual(t.context.callSpy.firstCall.args[1].message, [
        {
          type: 'at',
          data: {
            qq: '1'
          }
        },
        {
          type: 'text',
          data: {
            text: ' '
          }
        },
        {
          type: 'text',
          data: {
            text: 'hello'
          }
        },
        {
          type: 'text',
          data: {
            text: ' world'
          }
        }
      ])
      t.end()
    })

  emitMessage(t)
})

test.cb('CQEvent: modify the response message on the CQEvent across multiple listeners', function (t) {
  t.plan(3)

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
      t.is(e.messageFormat, 'string')
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

test.cb('CQEvent: can work without response handler', function (t) {
  t.plan(1)

  const stubSend = stub(t.context.bot._apiSock, 'send')
  stubSend.callsFake(function (data) {
    const { echo, params: { message } } = JSON.parse(data)
    t.is(message, 'some messages')
    this.onMessage(JSON.stringify({
      retcode: 0,
      echo
    }))
  })

  t.context.bot
    .on('message.private', function () {
      setTimeout(() => {
        t.end()
      }, 1000)
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
        t.true(err instanceof APITimeoutError)
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
      t.true(err instanceof APITimeoutError)
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
