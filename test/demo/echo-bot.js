const $CQWS = require('../')

let bot = new $CQWS({
  host: '127.0.0.1',
  port: 6700
})

bot.on('message', context => {
  bot('send_msg')
})

bot.connect()

// this is for the use of unit testing
module.exports = bot
