# CQWebSocket

- [CQWebSocket](#cqwebsocket)
  - [constructor](#constructor)
    - [CQWebSocketOption](#cqwebsocketoption)
  - [connect()](#connect)
  - [disconnect](#disconnect)
  - [reconnect](#reconnect)
  - [isSockConnected](#issockconnected)
  - [isReady](#isready)
  - [on](#on)
  - [once](#once)
  - [off](#off)
  - [API call](#api-call)
    - [範例](#%E7%AF%84%E4%BE%8B)

## constructor
```js
new CQWebSocket(opt)
```

- `opt` [CQWebSocketOption](#cqwebsocketoption)

### CQWebSocketOption
| 屬性 | 類型 | 默認值 |  說明
| - | - | - | - |
| `accessToken` | string | `""` | API 訪問 token 。見 CQHTTP API 之[配置文件說明](https://cqhttp.cc/docs/#/Configuration) |
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
|  `fragmentOutgoingMessages` | boolean | false | 由於 CQHTTP API 插件的 websocket 服務器尚未支持 fragment, 故建議維持 `false` 禁用 fragment。<br>※詳情請見 [WebSocketClient 選項說明](https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#client-config-options)。 |
|  `fragmentationThreshold` | number | 0x4000 | 每個 frame 的最大容量, 默認為 16 KiB, 單位: byte<br>※詳情請見 [WebSocketClient 選項說明](https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md#client-config-options)。 |
|  `tlsOptions` | object | {} | 若需調用安全連線 [https.request](https://nodejs.org/api/https.html#https_https_request_options_callback) 時的選項 |
|  `requestOptions` | { <br>`timeout`: number <br>} | {} | 調用 API 方法時的全局默認選項。 |

## connect()
```js
bot.connect([socketType])
```

- `socketType` [WebSocketType](WebSocketType.md) 未提供此項，則默認所有連線。
- 返回值： `this`
- 事件
  - `ready` 所有 socket 就緒。
  - `socket.connecting` 呼叫後立刻觸發，在任何連線嘗試之前。
  - `socket.connect` 連線成功。
  - `socket.failed` 連線失敗。
  - `socket.error` 連線失敗會一併觸發 error 事件。

## disconnect
```js
bot.disconnect([socketType])
```

- `socketType` [WebSocketType](WebSocketType.md) 未提供此項，則默認所有連線。
- 返回值： `this`
- 事件
  - `socket.closing` 正在關閉連線。
  - `socket.close` 連線斷開後。

## reconnect
```js
bot.reconnect([delay[, socketType]])
```

- `delay` number 單位為 ms，表示`socket.close`**事件觸發後的延遲時間**, 延遲時間過後才會呼叫 connect()。
- `socketType` [WebSocketType](WebSocketType.md) 未提供此項，則默認所有連線。
- 返回值： `this`
- 事件
  > 此方法會先呼叫 disconnect() 等待 `socket.close` 事件觸發後再呼叫 connect(), 可以參考以上兩個方法的事件。

## isSockConnected
```js
bot.isSockConnected(socketType)
```

- `socketType` [WebSocketType](WebSocketType.md)
- 返回值： `boolean`

> ※若未給定 `socketType`，使用此方法會**拋出錯誤**。

## isReady
```js
bot.isReady()
```

- 返回值： `boolean`

檢查連線狀態是否就緒。

> 僅檢查已透過 `enableAPI` 及 `enableEvent` 啟用之連線。

## on
```js
bot.on(event, listener)
```

- `event` string
- `listener` [EventListener](EventListener.md)
- 返回值： `this`

註冊常駐監聽器。

## once
```js
bot.once(event, listener)
```

- `event` string
- `listener` [EventListener](EventListener.md#OnceListener)
- 返回值： `this`

註冊一次性監聽器。

## off
```js
bot.off([event[, listener]])
```

- `event` string
- `listener` [EventListener](EventListener.md)
- 返回值： `this`

移除 `event` 事件中的 `listener` 監聽器。
若 `event` 不為字串，則移除所有監聽器。
若 `listener` 不為方法，則移除所有該事件的監聽器。

## API call
```js
bot(method[, params[, options]])
```
- `method` string 見 [API 列表](https://cqhttp.cc/docs/#/API?id=api-%E5%88%97%E8%A1%A8)
- `params` object 見 [API 列表](https://cqhttp.cc/docs/#/API?id=api-%E5%88%97%E8%A1%A8)
- `options` object | number
  - `timeout` number (默認: `Infinity`)
- 返回值： `Promise<ResObj>`

返回值為一個 Promise 對象, 用作追蹤該次 API 調用的結果。

Promise 對象實現後第一個參數會拿到 `ResObj` 對象, 此為 CQHttp API 的[回應對象](https://cqhttp.cc/docs/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3)。

若有配置 `timeout` 選項(原先默認為 `Infinity`, 不會對請求計時), 則發生超時之後, 將放棄收取本次調用的結果, 並拋出一個 `ApiTimeoutError`。

`options` 除了是一個對象外, 也可以直接給一個數值, 該數值會被直接當作 `timeout` 使用。

### 範例
```js
bot('send_private_msg', {
  user_id: 123456789,
  message: 'Hello world!'
}, {
  timeout: 10000 // 10 sec
})
  .then((res) => {
    console.log(res)
    // {
    //   status: 'ok',
    //   retcode: 0,
    //   data: null
    // }
  })
  .catch((err) => {
    console.error('請求超時!')
  })
```