const CQWebsocket = require('../..')
const { test } = require('ava')

const NOOP1 = function () {}
const NOOP2 = function () {}

test('#off(): remove all listeners', function (t) {
  t.plan(2)

  const bot = new CQWebsocket()
  bot
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP2)
    .on('message.group.@me', NOOP1)
    .on('request.group.invite', NOOP1)
  
  const total1 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@me')
    + bot._eventBus.count('request.group.invite')

  t.is(total1, 4)

  bot.off()

  const total2 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@me')
    + bot._eventBus.count('request.group.invite')
  
  t.is(total2, 0)
})

test('#off(event): remove all listeners of the specified event', function (t) {
  t.plan(2)

  const bot = new CQWebsocket()
  bot
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP2)
    .on('message.group.@me', NOOP1)
    .on('request.group.invite', NOOP1)
  
  const total1 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@me')
    + bot._eventBus.count('request.group.invite')

  t.is(total1, 4)

  bot.off('socket.connect')

  const total2 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@me')
    + bot._eventBus.count('request.group.invite')
  
  t.is(total2, 2)
})

test('#off(event, listener): remove a specific listener', function (t) {
  t.plan(3)

  const bot = new CQWebsocket()
  bot
    .on('socket.connect', NOOP1)
    .on('socket.connect', NOOP2)
    .on('message.group.@me', NOOP1)
    .on('request.group.invite', NOOP1)
  
  const total1 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@me')
    + bot._eventBus.count('request.group.invite')

  t.is(total1, 4)

  bot.off('socket.connect', NOOP1)

  const total2 = bot._eventBus.count('socket.connect')
    + bot._eventBus.count('message.group.@me')
    + bot._eventBus.count('request.group.invite')
  
  t.is(total2, 3)
  t.is(bot._eventBus._getHandlerQueue('socket.connect')[0], NOOP2)
})

test('#off(event, listener): if a listener is registered via multiple #on()\'s, it should also be removed via multiple #off()\'s.', function (t) {
  t.plan(5)

  const bot = new CQWebsocket()
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
