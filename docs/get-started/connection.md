# 連線狀態維護

- [連線狀態維護](#%E9%80%A3%E7%B7%9A%E7%8B%80%E6%85%8B%E7%B6%AD%E8%AD%B7)
  - [建立連線](#%E5%BB%BA%E7%AB%8B%E9%80%A3%E7%B7%9A)
    - [延伸閱讀](#%E5%BB%B6%E4%BC%B8%E9%96%B1%E8%AE%80)
  - [斷線重連](#%E6%96%B7%E7%B7%9A%E9%87%8D%E9%80%A3)
    - [範例](#%E7%AF%84%E4%BE%8B)
  - [WebSocket 關閉之狀態碼](#websocket-%E9%97%9C%E9%96%89%E4%B9%8B%E7%8B%80%E6%85%8B%E7%A2%BC)

## 建立連線
為了與事先配置完成的 CQHTTP API 插件建立連線，端口、服務器位址都在創建實例時便已經配置好了，這邊只需要呼叫 connect 方法即可。

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

### 延伸閱讀
- [API: CQWebSocket #on()](../api/CQWebSocket.md#on)
- [API: CQWebSocket #once()](../api/CQWebSocket.md#once)

## 斷線重連
我們可以注意到 CQWebSocket Constructor 裡面有幾項關於重新連接的配置。
- `reconnection`
- `reconnectionAttempts`
- `reconnectionDelay`

將 `reconnection` 設定為 true 啟用自動重連, 若發生網路錯誤, 例如無法連線到伺服器端, 連線建立失敗將會觸發重連, 若連續發生連線錯誤, 則重連次數不超過 `reconnectionAttempts`, 每次重連間隔 `reconnectionDelay` 毫秒。連續連線失敗將會在下一次連線成功時重新計數。

而每次進行重新連接時(不會是偵測到網路中斷而自動重連，或是開發者自行呼叫 `bot.reconnect()`)，都會先對機器人呼叫 `bot.disconnect()` 確認已經斷線，再進行 `bot.connect()`。

因此我們可以在 `socket.reconnecting`、`socket.connecting` 及 `socket.connect` 事件追蹤連線的狀況。
`socket.reconnecting`、`socket.connecting` 及 `socket.connect` 事件中帶有 `attempts` 參數，可以作為參照某次連線是否成功，`attempts` 的值表示**連續** *(N - 1)* 次失敗後的第 *N* 次連線嘗試。

`attempts` 會在連線成功後歸零。

SDK 底層封裝了兩個 socket 均會各自發布 `socket` 事件。

### 範例
```js
const CQWebSocket = require('cq-websocket')
const { WebsocketType } = CQWebSocket
const bot = new CQWebSocket()

// 手動連接兩個連線
bot.connect(WebsocketType.API)
bot.connect(WebsocketType.EVENT)

// 上面兩行 connect 代碼等同這一句
bot.connect()

bot.on('socket.connecting', function (socketType, attempts) {
  console.log('嘗試第 %d 次連線 _(:з」∠)_', attempts)
}).on('socket.connect', function (socketType, sock, attempts) {
  console.log('第 %d 次連線嘗試成功 ヽ(✿ﾟ▽ﾟ)ノ', attempts)
}).on('socket.failed', function (socketType, attempts) {
  console.log('第 %d 次連線嘗試失敗 。･ﾟ･(つд`ﾟ)･ﾟ･', attempts)
})
```

## WebSocket 關閉之狀態碼
若呼叫 `CQWebSocket #disconnect()` 會對服務器端發送夾帶 `1000` 狀態碼的關閉訊息, 表示正常關閉, 無需重連。

若發生網路斷線、服務器重啟... 等意外斷線, 通常會獲得 `1006` 狀態碼, 此狀態表示 websocket 客戶端 (即機器人端) 觀察到服務器關閉。