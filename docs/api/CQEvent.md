# CQEvents

- [CQEvents](#cqevents)
  - [stopPropagation](#stoppropagation)
  - [getMessage](#getmessage)
  - [setMessage](#setmessage)
  - [appendMessage](#appendmessage)
  - [hasMessage](#hasmessage)
  - [onResponse](#onresponse)
  - [onError](#onerror)

此類別無法自行創建實例。
此類別的實例於 `message` 事件監聽器，作為第一個參數傳入。

## stopPropagation
```js
e.stopPropagation()
```
- 返回值： `void`

<!-- TODO -->
截獲事件並停止[事件傳播](#事件傳播)。

## getMessage
```js
e.getMessage()
```
- 返回值： `string` | [`ArrayMessage`](ArrayMessage.md)

取得目前的響應訊息。

## setMessage
```js
e.setMessage(msg)
```
- `msg` string | [`ArrayMessage`](ArrayMessage.md)
- 返回值： `void`

設置響應訊息。

## appendMessage
```js
e.appendMessage(msg)
```
- `msg` string | [CQTag](message/README.md) | [CQHTTPMessage](CQHTTPMessage.md)
- 返回值： `void`

串接響應訊息。

## hasMessage
```js
e.hasMessage()
```

- 返回值： `boolean`

是否有響應訊息。

## onResponse
```js
e.onResponse(handler[, options])
e.onResponse(options)
```
- `handler` (res: ResObj) => void
- `options` object 同[API 調用](CQWebSocket.md#api-call)之 options

設置響應結果的處理器, 用以追蹤訊息是否傳送成功。

`ResObj` 對象, 此為 CQHttp API 的[回應對象](https://cqhttp.cc/docs/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3)。

## onError
```js
e.onError(handler)
```
- `handler` (err: ApiTimeoutError) => void

設置錯誤處理器, 可能的錯誤已知有響應超時。