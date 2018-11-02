# 範例
基本創建一個複讀機器人的代碼範例如下(可參見[demo/echo-bot.js](https://github.com/momocow/node-cq-websocket/blob/master/demo/echo-bot.js))：

```js
const CQWebSocket = require('cq-websocket')

// 採用默認參數創建機器人實例
let bot = new CQWebSocket()

// 設定訊息監聽
bot.on('message', (e, context) => {
  // 若要追蹤訊息發送狀況, 須獲取事件處理權, 並使用下面2或3的方式響應訊息
  e.stopPropagation()
  // 監聽訊息發送成功與否
  e.onResponse(console.log)
  // 監聽訊息發送超時與否
  e.onError(console.error)

  // 以下提供三種方式將原訊息以原路送回

  // 1. 調用 CQHTTP API 之 send_msg 方法
  //   (這就是一般的API方法調用, 直接在該方法的返回值之Promise追蹤結果)
  // bot('send_msg', context)
  //   .then(console.log)
  //   .catch(console.error)

  // 2. 或者透過返回值快速響應
  // return context.message

  // 3. 或者透過CQEvent實例，先獲取事件處理權再設置響應訊息
  // e.stopPropagation()
  // e.setMessage(context.message)
})

bot.connect()
```
