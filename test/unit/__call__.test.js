// stuffs of stubbing
const { stub, spy } = require('sinon')
const { client } = require('websocket')
const FakeConnection = require('../fixture/FakeConnection')
const fakeConnect = stub(client.prototype, 'connect')
const fakeSendUTF = stub(FakeConnection.prototype, 'sendUTF')
fakeConnect.callsFake(function () {
  setTimeout(() => {
    this.emit('connect', new FakeConnection())
  }, 500)
})

const { test } = require('ava')
const CQWebsocket = require('../..')

test.after.always(function () {
  fakeConnect.restore()
  fakeSendUTF.restore()
})

test.cb('#__call__(method, params)', function (t) {
  t.plan(6)

  const preSpy = spy()
  const postSpy = spy()
  const bot = new CQWebsocket()
    .on('api.send.pre', preSpy)
    .on('api.send.post', postSpy)
    .on('ready', function () {
      const ret = bot('test', {
        foo: 'bar'
      })

      t.is(ret, bot)
      t.true(preSpy.calledOnce)
      t.true(postSpy.calledOnce)
      t.true(fakeSendUTF.calledWith(JSON.stringify({
        action: 'test',
        params: { foo: 'bar' }
      })))
      t.true(fakeSendUTF.calledAfter(preSpy))
      t.true(postSpy.calledAfter(fakeSendUTF))
      t.end()
    })
    .connect()
})
