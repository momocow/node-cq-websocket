const $prompt = require('prompt')

const CQWebsocket = require('../')

const config = require('./coolq.config.json')

let bot = new CQWebsocket(config)

// 設定訊息監聽
bot.on('message.private', (e, context) => {
  // 以下提供三種方式將原訊息以原路送回

  // 1. 調用 CoolQ HTTP API 之 send_msg 方法
  bot('send_msg', context)

  // 2. 或者透過返回值快速響應
  // return context.message

  // 3. 或者透過CQEvent實例，先獲取事件處理權再設置響應訊息
  // e.cancel()
  // e.setMessage(context.message)
})

bot.connect()

$prompt.start()
getCMD()

function getCMD(){
  $prompt.get('$ ', function(e, r){
    if(["stop", "exit", "quit"].indexOf(r['$ ']) >= 0){
      bot.disconnect()
      process.exit(0)
    }
    getCMD()
  })
}
