const { CQWebSocket } = require('../..')
const test = require('ava').default
const { spy, stub } = require('sinon')

test('#on(): valid event', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebSocket()
    .on('message.private', _spy)

  const queue = bot._eventBus._getHandlerQueue('message.private')
  t.true(Array.isArray(queue))
  t.is(queue.length, 1)

  bot._eventBus.emit('message.private')
  t.true(_spy.calledOnce)
})

test('#on(): invalid event', function (t) {
  t.plan(2)

  const _spy = spy()
  const bot = new CQWebSocket()
    .on('invalid.event', _spy)

  const queue = bot._eventBus._getHandlerQueue('invalid.event')
  t.false(Array.isArray(queue))

  bot._eventBus.emit('invalid.event')
  t.true(_spy.notCalled)
})

test('#on(): socket.error', async function (t) {
  t.plan(7)

  const bot = new CQWebSocket()

  const queue = bot._eventBus._getHandlerQueue('socket.error')
  t.true(Array.isArray(queue))
  t.is(queue.length, 1)

  // disable warning message
  stub(console, 'error')
  try {
    await bot._eventBus.emit('socket.error', 'fake-sock', new Error('Fake socket error'))
  } catch (err) {
    t.true(err instanceof Error)
    t.is(err.which, 'fake-sock')
  }
  console.error.restore()

  const _defErrorHandler = queue[0]
  const _spy = spy()
  bot.on('socket.error', _spy)

  t.is(queue.length, 1)
  t.not(queue[0], _defErrorHandler)

  bot._eventBus.emit('socket.error', 'fake-sock', new Error('Fake socket error'))
  t.true(_spy.calledOnce)
})
