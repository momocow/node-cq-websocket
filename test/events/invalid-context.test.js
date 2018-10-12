const { stub } = require('sinon')
const { test } = require('ava')
const { CQWebSocketAPI: { CQWebsocket } } = require('../fixture/connect-success')()
const { InvalidContextError } = require('../../src/errors')

test.cb('InvalidContextError', function (t) {
  t.plan(2)

  const bot = new CQWebsocket()
    .on('ready', function () {
      const stubSend = stub(bot._apiSock, 'send')
      stubSend.callsFake(function () {
        this.onMessage('{ "fake": json,,, }')
      })

      bot('test', {
        foo: 'bar'
      })
    })
    .on('error', err => {
      t.true(err instanceof InvalidContextError)
      t.is(err.data, '{ "fake": json,,, }')
      t.end()
    })
    .connect()
})
