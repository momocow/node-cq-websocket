const test = require('tape')
const { iterate } = require('leakage')
const { EventEmitter } = require('events')

const { CQWebSocket } = require('..')

test('EventEmitter#once()', function (t) {
  const bot = new EventEmitter()
  iterate(() => {
    let a = 0
    bot.once('message', function (arg) {
      // zero side effect
      arg++
    })
    bot.emit('message', a)
  })
  t.same(bot.listeners('message').length, 0)
  t.end()
})

test('CQWebSocket#once()', function (t) {
  const bot = new CQWebSocket()
  iterate(() => {
    let a = 0
    bot.once('message', function (arg) {
      // zero side effect
      arg++
    })
    bot._eventBus.emit('message', a)
  })
  t.same(bot._eventBus._EventMap.message[''].length, 0)
  t.end()
})
