# 快速開始

## 基本概念
一個機器人最基本的功能不外乎以下三點：
1. 建立連線
2. 收取消息
3. 發送消息

以下說明將一步一步導引各位，如何透過本 SDK 達到該功能。

在這之前，首先我們需要先創建機器人的實例，代碼如下：
```js
const { CQWebSocket } = require('cq-websocket')
const bot = new CQWebSocket()
```

`bot` 便是機器人的實例，這邊我們完全採用默認值進行連線。

設定 ws 伺服器位址時, 你可以從以下方式擇一配置。如果以下方式同時存在於配置中, 則採用其中編號最小的方式。
  1. 使用 `baseUrl` 項指定伺服器 URL。
  2. 使用 `protocol`, `host`, `port` (皆為可選) 指定目標伺服器。
  
### 延伸閱讀
- [API: CQWebSocket Constructor](../api/CQWebSocket.md#new-cqwebsocketopt)

## 建立連線
有了機器人實例之後，我們需要與事先配置完成的 CQHTTP API 插件建立連線，端口、服務器位址都在創建實例時便已經配置好了，這邊只需要呼叫 connect 方法即可。

```js
bot.connect()
```

由於連線的建立是屬於異步操作，呼叫 connect 後立刻發送消息並沒有任何卵用 ┐(´д`)┌ 。
我們需要靜待 `ready` 事件的發生，示意機器人就緒，可以開始進行消息操作。

```js
bot.on('ready', function () {
  // 機器人就緒
})
```
值得注意的是，如果此時發生暫時性的網路問題，造成連線中斷，SDK 會自動嘗試重新建立連線，一旦連線再次建立完畢，會再次觸發 `ready` 事件，因此如果有些代碼在整個程序運行過程中，只能執行一次，這邊可以使用 `bot.once('ready')` 而非範例中的 `bot.on('ready')`。



## 範例
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