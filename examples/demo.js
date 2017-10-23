// node 8

const $CQWS = require('cq-websocket')

let bot = new $CQWS({
  host: '127.0.0.1',
  port: '6700'
})

// bot.use(CQWS.cqhttp)

bot.on('message', context => {
  bot('send_msg')
})

bot.connect()
