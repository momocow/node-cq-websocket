const $util = require('util')

const CQWebsocket = require('../')

const config = require('./coolq.config.json')

let bot = new CQWebsocket(config)

// 設定訊息監聽
bot.on('message.private', (e, context) => {
  console.log(`A message is received.\n${$util.inspect(context)}`)

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


/*指令介面*/

function printUsage(){
  process.stdout.write("Usage: <command>\n\t# Supported commands:\n\t\thelp\n\t\texit|quit|stop\n", "utf8")
}

let cmd = ''
process.stdout.write('Try help to see all commands.\n$ ', 'utf8')
process.stdin.on('data', data => {
  let dataStr = data.toString()
  if(dataStr.includes("\n")){
    cmd += dataStr.replace('\n', '')
    switch(cmd){
      case "help":
        printUsage()
        break
      case "exit":
      case "quit":
      case "stop":
        process.exit(0)
        break
      default:
    }
    cmd = ''
    process.stdout.write('$ ', 'utf8')
  }
  else{
    cmd += data.toString()
  }
})
