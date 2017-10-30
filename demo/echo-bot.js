const CQWebsocket = require('../')

const config = require('./coolq.config.json')

let bot = new CQWebsocket(config)

// 設定訊息監聽
bot.on('message.private', (e, context) => {
  console.log(`A message is received.\n${context}`)

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

let cmd = ''
process.stdin.on('data', data => {
  if(data.toString() == "\n"){

    switch(cmd){
      case "exit":
      case "quit":
      case "stop":
        process.exit(0)
        break
      default:
    }
    cmd = ''
  }
  else{
    cmd += data.toString()
  }
})
