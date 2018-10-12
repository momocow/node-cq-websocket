const { CQWebsocket } = require('../..')
const { test } = require('ava')
const { stub } = require('sinon')

test('#once(): handler not returning false', async function (t) {
  t.plan(3)

  const _stub = stub()
  _stub.returns(undefined)

  const bot = new CQWebsocket()
  bot.once('message.private', _stub)

  const queue = bot._eventBus._getHandlerQueue('message.private')
  t.true(Array.isArray(queue))
  t.is(queue.length, 1)

  await bot._eventBus.emit('message.private')
  t.is(queue.length, 0)
})

test('#once(): handler returning false', async function (t) {
  t.plan(6)

  const _stub = stub()
  _stub.onCall(0).returns(false)
  _stub.onCall(1).returns(undefined)

  const bot = new CQWebsocket()
  bot.once('message.private', _stub)

  const queue = bot._eventBus._getHandlerQueue('message.private')
  t.true(Array.isArray(queue))
  t.is(queue.length, 1)

  await bot._eventBus.emit('message.private')
  t.true(_stub.calledOnce)
  t.is(queue.length, 1)

  await bot._eventBus.emit('message.private')
  t.true(_stub.calledTwice)
  t.is(queue.length, 0)
})