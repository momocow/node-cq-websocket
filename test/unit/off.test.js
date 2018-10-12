const { CQWebSocket } = require('../..')
const traverse = require('../../src/util/traverse')
const { test } = require('ava')

const NOOP1 = function () {}
const NOOP2 = function () {}

function countListeners (bot) {
  let listenerCount = 0
  traverse(bot._eventBus._EventMap, (v) => {
    if (Array.isArray(v)) {
      listenerCount += v.length
    }
  })
  return listenerCount
}

test('#off(): remove all listeners', function (t) {
  t.plan(4)

  const bot = new CQWebSocket()
  bot
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP2)
    .on('message.group.@me', NOOP1)
    .on('request.group.invite', NOOP1)
  
  const total1 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@.me')
    + bot._eventBus.count('request.group.invite')

  t.is(total1, 4)
  t.is(bot._eventBus.count('socket.error'), 1)

  bot.off()

  const total2 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@.me')
    + bot._eventBus.count('request.group.invite')
  
  t.is(total2, 0)
  t.is(bot._eventBus.count('socket.error'), 1)
})

test('#off(event): remove all listeners of the specified event', function (t) {
  t.plan(2)

  const bot = new CQWebSocket()
  bot
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP2)
    .on('message.group.@me', NOOP1)
    .on('request.group.invite', NOOP1)
  
  const total1 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@.me')
    + bot._eventBus.count('request.group.invite')

  t.is(total1, 4)

  bot.off('socket.connect')

  const total2 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@.me')
    + bot._eventBus.count('request.group.invite')
  
  t.is(total2, 2)
})

test('#off(event, listener): remove a specific listener', function (t) {
  t.plan(3)

  const bot = new CQWebSocket()
  bot
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP2)
    .on('message.group.@me', NOOP1)
    .on('request.group.invite', NOOP1)
  
  const total1 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@.me')
    + bot._eventBus.count('request.group.invite')

  t.is(total1, 4)

  bot.off('socket.connect', NOOP1)

  const total2 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@.me')
    + bot._eventBus.count('request.group.invite')
  
  t.is(total2, 3)
  t.is(bot._eventBus._getHandlerQueue('socket.connect')[0], NOOP2)
})

test('#off(event, listener): if a listener is registered via multiple #on()\'s, it should also be removed via multiple #off()\'s.', function (t) {
  t.plan(5)

  const bot = new CQWebSocket()
  bot
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP1)
  
  t.is(bot._eventBus.count('socket.connect'), 4)

  bot.off('socket.connect', NOOP1)
  t.is(bot._eventBus.count('socket.connect'), 3)

  bot.off('socket.connect', NOOP1)
  t.is(bot._eventBus.count('socket.connect'), 2)

  bot.off('socket.connect', NOOP1)
  t.is(bot._eventBus.count('socket.connect'), 1)

  bot.off('socket.connect', NOOP1)
  t.is(bot._eventBus.count('socket.connect'), 0)
})

test('#off(event, onceListener): should be able to remove once listeners', function (t) {
  t.plan(2)

  const bot = new CQWebSocket()
    .once('message', console.log)
  t.is(bot._eventBus.count('message'), 1)

  bot.off('message', console.log)
  t.is(bot._eventBus.count('message'), 0)
})

test('#off(socket.error): remove all socket.error listeners', function (t) {
  t.plan(2)

  const func1 = function () {}

  const bot = new CQWebSocket()
    .once('socket.error', console.error)
    .on('socket.error', func1)
    .on('socket.error', console.error)

  t.is(bot._eventBus.count('socket.error'), 3)

  bot.off('socket.error')
  t.is(bot._eventBus.count('socket.error'), 1)
})

test('#off(socket.error, listener): remove specified socket.error listener', function (t) {
  t.plan(7)

  const func1 = function () {}

  const bot = new CQWebSocket()
    .once('socket.error', console.error)
    .on('socket.error', func1)
    .on('socket.error', console.error)

  t.is(bot._eventBus.count('socket.error'), 3)

  bot.off('socket.error', func1)
  t.is(bot._eventBus.count('socket.error'), 2)

  const queue = bot._eventBus._getHandlerQueue('socket.error')
  t.not(queue[0], queue[1]) // not the same since queue[0] is a once listener which wraps console.error
  t.is(queue[0], bot._eventBus._onceListeners.get(console.error))

  bot.off('socket.error', console.error) // the once listener is removed since it is registered earlier
  t.is(bot._eventBus.count('socket.error'), 1)
  t.is(bot._eventBus._getHandlerQueue('socket.error')[0], console.error)

  bot.off('socket.error', console.error)
  t.is(bot._eventBus.count('socket.error'), 1) // default error handler
})

test('#off(invalidEvent)', function (t) {
  t.plan(3)

  const bot = new CQWebSocket()

  t.is(countListeners(bot), 1) // default socket.error

  t.is(bot.off('invalid.event'), bot)

  t.is(countListeners(bot), 1) // default socket.error
})

test('#off(event, not_a_listener)', function (t) {
  t.plan(3)

  const bot = new CQWebSocket()
    .on('message', NOOP1)

  t.is(countListeners(bot), 2) // default socket.error + NOOP1

  t.is(bot.off('message', NOOP2), bot)

  t.is(countListeners(bot), 2) // default socket.error + NOOP1
})
