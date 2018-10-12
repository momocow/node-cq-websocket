// stuffs of stubbing
const { stub, spy } = require('sinon')

const { test } = require('ava')
const { CQWebSocketAPI: { CQWebsocket } } = require('../fixture/connect-success')()
const { ApiTimoutError } = require('../../src/errors')

test.cb('#__call__(method, params)', function (t) {
  t.plan(11)

  const preSpy = spy()
  const postSpy = spy()
  const apiResponseSpy = spy()
  // provide qq to avoid invoking `_apiSock.send`
  const bot = new CQWebsocket({ qq: 123456789 })
    .on('api.send.pre', preSpy)
    .on('api.send.post', postSpy)
    .on('api.response', apiResponseSpy)
    .on('ready', function () {
      
      const stubSend = stub(bot._apiSock, 'send')
      stubSend.callsFake(function (data) {
        const { echo } = JSON.parse(data)
        this.onMessage(JSON.stringify({ retcode: 0, status: 'ok', echo }))
      })

      t.is(bot._responseHandlers.size, 0)

      const ret = bot('test', {
        foo: 'bar'
      })

      let reqid
      for (let k of bot._responseHandlers.keys()) {
        reqid = k
        break
      }

      // assert returned value
      t.true(ret instanceof Promise)

      // assert events
      t.true(preSpy.calledOnce)
      t.true(postSpy.calledOnce)

      // assert side effects
      t.is(bot._responseHandlers.size, 1)
      t.true(stubSend.calledWith(JSON.stringify({
        action: 'test',
        params: { foo: 'bar' },
        echo: { reqid }
      })))
      t.true(stubSend.calledAfter(preSpy))
      t.true(postSpy.calledAfter(stubSend))

      // assert result of returned Promise
      ret.then(ctxt => {
        t.true(apiResponseSpy.calledOnce)
        t.true(apiResponseSpy.calledAfter(postSpy))
        t.deepEqual(ctxt, { retcode: 0, status: 'ok' })
        t.end()
      })
    })
    .connect()
})

test('#__call__() while disconnected.', async function (t) {
  t.plan(1)

  const bot = new CQWebsocket()

  let thrown = false
  try {
    await bot('test', {
      foo: 'bar'
    })
  } catch (e) {
    thrown = true
  }

  t.true(thrown)
})

test.cb('#__call__(method, params, options) with timeout option', function (t) {
  t.plan(5)

  // provide qq to avoid invoking `_apiSock.send`
  const bot = new CQWebsocket({ qq: 123456789 })
    .on('ready', function () {
      t.is(bot._responseHandlers.size, 0)

      const ret = bot('test', {
        foo: 'bar'
      }, {
        timeout: 1000
      })

      t.is(bot._responseHandlers.size, 1)

      ret.catch(err => {
        t.true(err instanceof ApiTimoutError)
        t.deepEqual(err.req, {
          action: 'test',
          params: {
            foo: 'bar'
          }
        })
        // response handler should be reset due to timeout
        t.is(bot._responseHandlers.size, 0)
        t.end()
      })
    })
    .connect()
})

test.cb('#__call__(method) use global request options if options is omitted', function (t) {
  t.plan(2)

  // provide qq to avoid invoking `_apiSock.send`
  const bot = new CQWebsocket({ qq: 123456789, requestOptions: { timeout: 2000 } })

  let start
  bot
    .on('ready', function () {
      start = Date.now()
      bot('test').catch(err => {
        t.true(err instanceof ApiTimoutError)
        // Not sure if this assertion is stable (?)
        t.is(Math.round((Date.now() - start) / 1000), 2)
        t.end()
      })
    })
    .connect()
})
