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
const CQEvent = CQWebsocket.CQEvent
const { test } = require('ava')

function emitEvent (t, msgObj = {}) {
  setTimeout(function () {
    t.context.sock.emit('message', {
      type: 'utf8',
      utf8Data: JSON.stringify(msgObj)
    })
  }, EMIT_DELAY)
}

function macro (t, event) {
  const atMe = event.endsWith('.@me')
  if (atMe) {
    event = event.substr(0, event.length - 4)
  }

  const arrEvent = event.split('.')
  const [ majorType, minorType, subType ] = arrEvent
  
  if (!minorType) {
    t.fail('Invalid minor type')
    t.end()
    return
  }

  const msgObj = {
    post_type: majorType,
  }

  if (subType) {
    msgObj.sub_type = subType
  }

  switch (majorType) {
    case 'message':
      msgObj.message_type = minorType
      msgObj.raw_message = `${atMe ? `[CQ:at,qq=${t.context.bot._qq}]` : ''} test`
      break
    case 'notice':
      msgObj.notice_type = minorType
      break
    case 'request':
      msgObj.request_type = minorType
      break
    default:
      t.fail('Invalid major type')
      t.end()
      return
  }

  /**
   * @type {sinon.SinonSpy[]}
   */
  let spies = []
  for (let i = 0; i < arrEvent.length; i++) {
    const _spy = spy()
    spies.push(_spy)
  
    const prefix = i > 0 ? arrEvent[i - 1] + '.' : ''
    arrEvent[i] = prefix + arrEvent[i]
    t.context.bot.on(arrEvent[i], _spy)
  }

  if (atMe) {
    const _spy = spy()
    spies.push(_spy)
    t.context.bot.on(arrEvent[arrEvent.length - 1] + '.@me', _spy)
  }

  // Assertion after root event has been emitted
  t.context.bot.on(arrEvent[0], function () {
    t.plan(spies.length * (majorType === 'message' ? 4 : 3) - 1)
  
    // 相關母子事件均被觸發過
    spies.forEach(_spy => {
      t.true(_spy.calledOnce)
    })

    // 觸發參數
    if (majorType === 'message') {
      spies.forEach(_spy => {
        t.true(_spy.firstCall.args[0] instanceof CQEvent)
        t.deepEqual(_spy.firstCall.args[1], msgObj)
      })
    } else {
      spies.forEach(_spy => {
        t.deepEqual(_spy.firstCall.args[0], msgObj)
      })
    }

    // 觸發順序
    spies.forEach((_spy, i) => {
      if (i < spies.length - 1) {
        t.true(_spy.calledAfter(spies[i + 1]))
      }
    })

    t.end()
  })

  emitEvent(t, msgObj)
}

test.beforeEach.cb(function (t) {
  t.context.bot = new CQWebsocket()
    .on('ready', function () {
      t.context.sock = t.context.bot._eventSock._connection
      t.end()
    })
    .connect()
})

/**
 * @type {string[]}
 */
const eventlist = require('./events')
eventlist.forEach(function (event) {
  test.cb(`Event [${event}]`, macro, event)
})
