const { CQWebSocketAPI: { CQWebSocket, APITimeoutError } } = require('../fixture/connect-success')()
const { stub } = require('sinon')
const test = require('ava').default

test.cb('Auto-fetch if no QQ account provided.', function (t) {
  t.plan(2)

  const bot = new CQWebSocket()
  t.is(bot._qq, -1)

  let stubSend
  bot
    .on('ready', function () {
      stubSend = stub(bot._apiSock, 'send')
      stubSend.callsFake(function (data) {
        const { echo } = JSON.parse(data)
        this.onMessage(JSON.stringify({
          data: {
            nickname: 'fake-QQ',
            user_id: 123456789
          },
          retcode: 0,
          status: 'ok',
          echo
        }))
      })
    })
    .on('api.response', () => {
      // when emitting api.response, the call to '/get_login_info' has actually been resolved
      // but the Promise state changes at the next tick
      setImmediate(() => {
        t.is(bot._qq, 123456789)
        t.end()
      })
    })
    .connect()
})

test.cb('Auto-fetch failure due to gloabal request timeout', function (t) {
  t.plan(2)

  const bot = new CQWebSocket({ requestOptions: { timeout: 2000 } })

  bot
    .on('error', err => {
      t.true(err instanceof APITimeoutError)
      t.is(err.req.action, 'get_login_info')
      t.end()
    })
    .connect()
})
