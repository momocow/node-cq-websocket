const setup = require('../fixture/setup')

const { bot, planCount, assertSpies, done } = setup()

module.exports = function (t) {
  t.plan(planCount())

  bot
    // .on('socket.connecting', () => {
    //   console.log(Object.values(spies).map(s => s.callCount))
    // })
    .on('ready', function () {
      // Assertion
      assertSpies(t, { connectCount: 2, connectingCount: 2 })
      t.end()
      done()
    })
    .connect()
}
