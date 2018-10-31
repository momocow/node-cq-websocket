# CQWebSocket

## Constructor
```ts
new CQWebSocket(opt)
```
- `opt` object

| 屬性 | 類型 | 默認值 |  說明
| - | - | - | - |
| `accessToken` | string | `""` | API 訪問 token 。見 CQHTTP API 之[配置文件說明](https://cqhttp.cc/docs/4.2/#/Configuration) |
|  `enableAPI` | boolean | `true` | 啟用 /api 連線 |
|  `enableEvent` | boolean | `true` | 啟用 /event 連線 |
|  `protocol` | string | `"ws:"` | 協議名 |
|  `host` | string | `"127.0.0.1"` | 酷Q伺服器 IP |
|  `port` | number | 6700 | 酷Q伺服器端口 |
|  `baseUrl` | string | 6700 | 酷Q伺服器位址 (SDK在建立連線時會依照此設定加上前綴項 `ws://` 及後綴項 `/<api|event>[?accessToken={token}]`) |
|  `qq` | number &#124; string | -1 | 觸發 `@me` 事件用的QQ帳號，通常同登入酷Q之帳號，用在討論組消息及群消息中辨認是否有人at此帳號 |
|  `reconnection` | boolean | true | 是否連線錯誤時自動重連 |
|  `reconnectionAttempts` | number | Infinity | **連續**連線失敗的次數不超過這個值 |
|  `reconnectionDelay` | number | 1000 | 重複連線的延遲時間, 單位: ms |
|  `fragmentOutgoingMessages` | boolean | false | 由於 CQHTTP API 插件的 websocket 服務器尚未支持 fragment, 故建議維持 `false` 禁用 fragment。 |
|  `fragmentationThreshold` | number | 0x4000 | 每個 frame 的最大容量, 默認為 16 KiB, 單位: byte |
|  `tlsOptions` | object | {} | 若需調用安全連線 [https.request](https://nodejs.org/api/https.html#https_https_request_options_callback) 時的選項 |
|  `requestOptions` | { <br>`timeout`: number <br>} | {} | 調用 API 方法時的全局默認選項。 |

- 返回值: 一個新配置的 `CQWebSocket` 類別實例

## CQWebSocket #connect(wsType)
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `this`  
- 事件
  - `ready` 所有 socket 就緒。
  - `socket.connecting` 呼叫後立刻觸發，在任何連線嘗試之前。
  - `socket.connect` 連線成功。
  - `socket.failed` 連線失敗。
  - `socket.error` 連線失敗會一併觸發 error 事件。

`socket.connecting` 及 `socket.connect` 事件中帶有 attempts 參數, 可以用來對照哪次連線是否成功, attempts 的值表示**連續** *(N - 1)* 次失敗後的第 *N* 次連線嘗試。

attempts 會在連線成功後歸零。

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

bot.on('socket.connecting', function (wsType, attempts) {
  console.log('嘗試第 %d 次連線 _(:з」∠)_', attempts)
}).on('socket.connect', function (wsType, sock, attempts) {
  console.log('第 %d 次連線嘗試成功 ヽ(✿ﾟ▽ﾟ)ノ', attempts)
}).on('socket.failed', function (wsType, attempts) {
  console.log('第 %d 次連線嘗試失敗 。･ﾟ･(つд`ﾟ)･ﾟ･', attempts)
})
```

## CQWebSocket #disconnect(wsType)
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `this`
- 事件
  - `socket.close` 連線斷開後。

## CQWebSocket #reconnect(delay, wsType)
- `delay` number
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `this`
- 事件
  > 此方法會先呼叫 disconnect() 等待 `socket.close` 事件觸發後再呼叫 connect(), 可以參考以上兩個方法的事件。

斷開現有連線, 並重新建立連線。

`delay`單位為 ms，表示`socket.close`**事件觸發後的延遲時間**, 延遲時間過後才會呼叫 connect()。

## CQWebSocket #isSockConnected(wsType)
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `boolean`

若未給定 wsType 則使方法會拋出錯誤。

## CQWebSocket #isReady()
- 返回值： `boolean`

檢查連線狀態是否就緒。

> 可透過 `ready` 事件監聽。 

> 僅檢查已透過 `enableAPI` 及 `enableEvent` 啟用之連線。

> 原 #isConnected() 方法。

## CQWebSocket(`method`, `params`, `options`)
- `method` string
- `params` object
- `options` object | number
  - `timeout` number (默認: `Infinity`)
- 返回值： `Promise<ResObj>`

`CQWebSocket` 的實例可直接作為方法調用，用於透過 `/api` 連線操作酷Q。  
`method` 為欲調用的行為，透過 `params` 物件夾帶參數，詳細的規格請見 CQHTTP API 之 [API 列表](https://cqhttp.cc/docs/4.2/#/API?id=api-%E5%88%97%E8%A1%A8)。

返回值為一個 Promise 對象, 用作追蹤該次方法調用的結果。Promise 對象實現後第一個參數會拿到 `ResObj` 對象, 此為 CQHttp API 的[回應對象](https://cqhttp.cc/docs/4.3/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3)。

若有配置 `timeout` 選項(原先默認為 `Infinity`, 不會對請求計時), 則發生超時之後, 將放棄收取本次調用的結果, 並拋出一個 `ApiTimeoutError`。

`options` 除了是一個對象外, 也可以直接給一個數值, 該數值會被直接當作 `timeout` 使用。