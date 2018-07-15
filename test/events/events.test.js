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

let eventSock
let bot

function emitEvent (msgObj = {}, cb = function () {}) {
  setTimeout(function () {
    eventSock.emit('message', {
      type: 'utf8',
      utf8Data: JSON.stringify(msgObj)
    })
    cb()
  }, EMIT_DELAY)
}

function macro (t, event) {
  // bot

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
    bot.on(arrEvent[i], _spy)
  }

  emitEvent(msgObj, function () {
    t.plan(spies.length * 3 - 1)
  
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
      if (i < spies.length - 2) {
        t.true(_spy.calledAfter(spies[i + 1]))
      }
    })

    spies.forEach((_spy, i) => {
      _spy.restore()
      bot.off(arrEvent[i], _spy)
    })

    t.end()
  })
}

test.before.cb(function (t) {
  bot = new CQWebsocket()
    .on('ready', function () {
      eventSock = bot._eventSock
      t.end()
    })
    .connect()
})

/**
 * @type {string[]}
 */
const eventlist = require('./events')
eventlist.forEach(function (event) {
  test.cb.skip(`Event [${event}]`, macro, event, new CQWebsocket())
})
