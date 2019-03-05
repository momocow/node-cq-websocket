const test = require('tape')
const { iterate } = require('leakage')
const { EventEmitter } = require('events')

const { CQWebSocket } = require('../../')

test('EventEmitter#on(), EventEmitter#removeAllListener()', function (t) {
  const bot = new EventEmitter()
  iterate(() => {
    let a = 0
    bot.on('message', function (arg) {
      // zero side effect
      arg++
    })
    bot.emit('message', a)
    bot.removeAllListeners('message')
  })
  t.same(bot.listeners('message').length, 0)
  t.end()
})

test('CQWebSocket#on(), CQWebSocket#off()', function (t) {
  const bot = new CQWebSocket()
  iterate(() => {
    let a = 0
    bot.on('message', function (arg) {
      // zero side effect
      arg++
    })
    bot._eventBus.emit('message', a)
    bot.off('message')
  })
  t.same(bot._eventBus._EventMap.message[''].length, 0)
  t.end()
})
