# node-cq-websocket
[![Build Status](https://travis-ci.org/momocow/node-cq-websocket.svg?branch=master)](https://travis-ci.org/momocow/node-cq-websocket)
[![Coverage Status](https://coveralls.io/repos/github/momocow/node-cq-websocket/badge.svg?branch=master)](https://coveralls.io/github/momocow/node-cq-websocket?branch=master)
[![license](https://img.shields.io/github/license/momocow/node-cq-websocket.svg)](https://github.com/momocow/node-cq-websocket#readme)
[![npm](https://img.shields.io/npm/dt/cq-websocket.svg)](https://www.npmjs.com/package/cq-websocket)
[![npm](https://img.shields.io/npm/v/cq-websocket.svg)](https://www.npmjs.com/package/cq-websocket)
[![CQHttp](https://img.shields.io/badge/dependency-CQHttp-green.svg)](https://github.com/richardchien/coolq-http-api#readme)  

## 關於 Node CQWebSocket SDK
依賴 CQHTTP API 插件的 websocket 接口, 為 NodeJs 開發者提供一個搭建 QQ 聊天機器人的框架。

關於 CQHTTP API 插件，見 [richardchien/coolq-http-api](https://github.com/richardchien/coolq-http-api#readme)

> 本 SDK 尚處於測試階段，使用上仍有機會碰到Bug，歡迎提交PR或issue回報。

> 由於付費問題，本 SDK 目前僅針對酷Q Air做測試。

### 功能特色
- 輕鬆配置, 快速搭建 QQ 聊天機器人。
- 自動維護底層連線, 開發者只需專注在聊天應用的開發。若斷線, 可依照配置[重新連線](#自動重新連線說明)。
- 支持消息監聽器內, [快速響應](#快速響應)。
- 連線建立時, 可[自動獲取機器人QQ號](#自動獲取機器人qq號)。
- 兼容 CQHTTP API 插件 `v3.x` 及 `v4.x` 兩個大版本。

### 開發日誌
[<點擊前往>](./docs/CHANGELOG.md)

## 使用方式
### Browser
1. 下載 `/dist` 目錄下之 `cq-websocket.min.js`。
2. 放到你的網站路徑下。
3. 使用 `<script src="<你的路徑>/cq-websocket.min.js">` 引入。
4. 在你的 js 代碼中, 使用全局變數 `CQWebSocket` 獲取 SDK。
```js
  // 全局變數 CQWebSocket 存在於 window 對象下
  // window.CQWebSocket
  const bot = new CQWebSocket()
```

### Nodejs
1. 通過 `npm install cq-websocket` 安裝 SDK
2. 將 SDK 導入代碼   
```
const CQWebSocket = require('cq-websocket')
```
> 該導入過程引用了一個類別進來，以下將以 `CQWebSocket` 作為該類別名稱進行說明，實際使用時請依自己的命名編寫。

## 關於 `CQWebSocket` 類別
SDK 的主要類別，底下封裝了兩個用於與 CQHTTP API 連線之 socket，分別為 `/api` 和 `/event` (詳細功能描述可見 [coolq-http-api/websocket](https://cqhttp.cc/docs/4.2/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3))。

## 創建實例
### new CQWebSocket(`opt`)
- `opt` object

| 屬性 | 類型 | 默認值 |  說明
| - | - | - | - |
| `access_token` | string | `""` | API 訪問 token 。見 CQHTTP API 之[配置文件說明](https://cqhttp.cc/docs/4.2/#/Configuration) |
|  `enableAPI` | boolean | `true` | 啟用 /api 連線 |
|  `enableEvent` | boolean | `true` | 啟用 /event 連線 |
|  `host` | string | `"127.0.0.1"` | 伺服器 IP |
|  `port` | number | 6700 | 伺服器端口 |
|  `baseUrl` | string | 6700 | 伺服器位址 (SDK在建立連線時會依照此設定加上前綴項 `ws://` 及後綴項 `/<api|event>[?access_token={token}]`) |
|  `qq` | number &#124; string | -1 | 觸發 `@me` 事件用的QQ帳號，通常同登入酷Q之帳號，用在討論組消息及群消息中辨認是否有人at此帳號 |
|  `reconnection` | boolean | true | 是否連線錯誤時自動重連 |
|  `reconnectionAttempts` | number | Infinity | **連續**連線失敗的次數不超過這個值 |
|  `reconnectionDelay` | number | 1000 | 重複連線的延遲時間, 單位: ms |
|  `fragmentOutgoingMessages` | boolean | false | 由於 CQHTTP API 插件的 websocket 服務器尚未支持 fragment, 故建議維持 `false` 禁用 fragment。 |
|  `fragmentationThreshold` | number | 0x4000 | 每個 frame 的最大容量, 默認為 16 KiB, 單位: byte |
|  `tlsOptions` | object | {} | 若需調用安全連線 [https.request](https://nodejs.org/api/https.html#https_https_request_options_callback) 時的選項 |
|  `requestOptions` | { <br>`timeout`: number <br>} | {} | 調用 API 方法時的全局默認選項。 |

- 返回值: 一個新配置的 `CQWebSocket` 類別實例

設定 ws 伺服器位址時, 你可以從以下方式擇一配置。如果以下方式同時存在於配置中, 則採用其中編號最小的方式。
  1. 使用 `host` 項指定伺服器, `port` 項為可選。
  2. 使用 `baseUrl` 項指定伺服器 URL。

### 自動獲取機器人QQ號
若機器人配置 `enableAPI` 為 true, 且沒有通過 `qq` 項配置機器人ID的話, 連線建立成功後會主動發送 API 請求向 CQHTTP API 取得酷Q正登錄的QQ號作為機器人QQ號。

此操作為異步操作, 在API響應之前, `@me` 事件均不會發布 。

除非真的有人QQ號是 `-1`, 哪尼口雷 Σ(*ﾟдﾟﾉ)ﾉ

### 自動重新連線說明
將 `reconnection` 設定為 true 啟用自動重連, 若發生網路錯誤, 例如無法連線到伺服器端, 連線建立失敗將會觸發重連, 若連續發生連線錯誤, 則重連次數不超過 `reconnectionAttempts`, 每次重連間隔 `reconnectionDelay` 毫秒。連續連線失敗將會在下一次連線成功時重新計數。

#### WebSocket 關閉之狀態碼
若呼叫 `CQWebSocket #disconnect()` 會對服務器端發送夾帶 `1000` 狀態碼的關閉訊息, 表示正常關閉, 無需重連。

若發生網路斷線、服務器重啟... 等意外斷線, 通常會獲得 `1006` 狀態碼, 此狀態表示 websocket 客戶端 (即機器人端) 觀察到服務器關閉。

## 建立連線
### CQWebSocket #connect(wsType)
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `this`  
- 事件
  - `socket.connecting` 呼叫後立刻觸發，在任何連線嘗試之前。
  - `socket.connect` 連線成功。
  - `socket.failed` 連線失敗。
  - `socket.error` 連線失敗會一併觸發 error 事件。

`socket.connecting` 及 `socket.connect` 事件中帶有 attempts 參數, 可以用來對照哪次連線是否成功, attempts 的值表示**連續** *(N - 1)* 次失敗後的第 *N* 次連線嘗試。

attempts 會在連線成功後歸零。

範例:
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

## 斷開連線
### CQWebSocket #disconnect(wsType)
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `this`
- 事件
  - `socket.close` 連線斷開後。

## 重新連線
### CQWebSocket #reconnect(delay, wsType)
- `delay` number
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `this`
- 事件
  > 此方法會先呼叫 disconnect() 等待 `socket.close` 事件觸發後再呼叫 connect(), 可以參考以上兩個方法的事件。

斷開現有連線, 並重新建立連線。

`delay`單位為 ms，表示`socket.close`**事件觸發後的延遲時間**, 延遲時間過後才會呼叫 connect()。

## 檢測連線
### CQWebSocket #isSockConnected(wsType)
- `wsType` [WebsocketType](#cqwebsocketwebsockettype-實例)
- 返回值： `boolean`

若未給定 wsType 則使方法會拋出錯誤。

## 連線就緒
### CQWebSocket #isReady()
- 返回值： `boolean`

檢查連線狀態是否就緒。

> 可透過 `ready` 事件監聽。 

> 僅檢查已透過 `enableAPI` 及 `enableEvent` 啟用之連線。

> 原 #isConnected() 方法。

## 方法調用
### CQWebSocket(`method`, `params`, `options`)
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

## 事件處理
事件處理應為機器人的運行過程中最主要的環節，情報收集主要是透過來自 `/event` 連線的事件上報，判讀事件文本並採取方法調用。

### CQWebSocket #on(`event_type`, `listener`)
- `event_type` string
- `listener` function(`...args`){ }
  - `...args` 依事件類型不同，監聽器的參數也有所不同，詳細對應見下表。
  - 返回值： `string` | `Promise <string>`  | `void`
- 返回值： `this`

註冊常駐監聽器。

若返回值為 `string` 或一個受理值 (resolved value) 為 `string` 之承諾 (Promise) 對象，則以該文字訊息作為響應發送。

### CQWebSocket #once(`event_type`, `listener`)
- `event_type` string
- `listener` function(`...args`){ }
  - `...args` 依事件類型不同，監聽器的參數也有所不同，詳細對應見下表。
  - 返回值： `string` | `boolean` | `void`
- 返回值： `this`

註冊一次性監聽器。

當返回值為 `boolean` 且為 `false` ，指涉該監聽器並未完成任務，則保留該監聽器繼續聽取事件，不做移除。下一次事件發生時，該監聽器在調用後會再次以返回值判定去留。若返回值為 `boolean` 且為 `true` ，指涉該監聽器處理完畢，立即移除。

若返回值為 `string` ，則立即以該文字訊息作為響應發送，並移除該監聽器。

### CQWebSocket #off(`event_type`, `listener`)
- `event_type` string
- `listener` function
- 返回值： `this`

關於判定會被移除的監聽器, 以下條件, 第一個成立即適用。
1. 若 `event_type` 不為字串, 則移除所有監聽器, 並且安裝默認的 `socket.error` 監聽器
2. 若 `listener` 不為方法, 則移除所有 `event_type` 所指定事件下的監聽器, 若 `event_type` 指定的事件不存在則無事。
3. 移除 `event_type` 下的 `listener` 監聽器(**參照 reference 須相同!**), 若 `listener` 不存在則無事。

#### 基本事件
前三個基本事件之說明，可以另外參考 CQHTTP API 的[數據上報格式](https://cqhttp.cc/docs/4.2/#/Post?id=%E4%B8%8A%E6%8A%A5%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F)。

參數 `context` 可見[事件列表](https://cqhttp.cc/docs/4.2/#/Post?id=%E4%BA%8B%E4%BB%B6%E5%88%97%E8%A1%A8)。

| 事件類型 | 監聽器參數 `...args` | 說明 |
| - | - | - |
| message | `event` [CQEvent](#cqevent-類別)<br> `context` object| 所有流入的訊息。 |
| ~~event~~ | `context` object | **[棄用]** 群組人數變化...等QQ事件。(此事件不支援子事件, 若需要 notice 子事件, 請將 CQHTTP API 升級至 v4.x) |
| notice  | `context` object | 群文件上傳, 群管變動, 群成員增減, 好友添加...等QQ事件。 |
| request | `context` object | 好友請求, 群請求/群邀請...等QQ事件。 |
| error | `err` Error | 應用層面的錯誤, 如 CQHttp API 消息格式錯誤, 響應超時... 等 |
| ready | `this` | 設定中啟用之連線均成功並初始化完成，可以開始調用API (送消息...等操作)。 |

#### `message` 子事件
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| message.private | `event` CQEvent <br> `context` object | 私聊消息。 |
| message.discuss | `event` CQEvent <br> `context` object | 討論組消息。 |
| message.discuss.@ | `event` CQEvent <br> `context` object <br> `tags` CQAtTag[] | 有人於討論組消息中被at。 |
| message.discuss.@.me | `event` CQEvent <br> `context` object | 有人於討論組消息at機器人。 |
| message.group | `event` CQEvent <br> `context` object | 群消息。 |
| message.group.@ | `event` CQEvent <br> `context` object <br> `tags` CQAtTag[] | 有人於群消息中被at。 |
| message.group.@.me | `event` CQEvent <br> `context` object | 有人於群消息at機器人。 |

※ `message.discuss.@me`, `message.group.@me` 已棄用。

#### `notice` 子事件
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| notice.group_upload | `context` object | 群文件上傳。 |
| notice.group_admin.set | `context` object | 設置管理員。 |
| notice.group_admin.unset | `context` object | 取消管理員。 |
| notice.group_decrease.leave | `context` object | 自主退群。 |
| notice.group_decrease.kick | `context` object | 被動踢出群。 |
| notice.group_decrease.kick_me | `context` object | 機器人被踢出群。 |
| notice.group_increase.approve | `context` object | 管理員同意入群。 |
| notice.group_increase.invite | `context` object | 管理員邀請入群。 |
| notice.friend_add | `context` object | 新添加好友。 |

#### `request` 子事件
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| request.friend | `context` object | 私聊消息。 |
| request.group.add | `context` object | 加群請求。 |
| request.group.invite | `context` object | 邀請入群。 |

#### `socket` 子事件
底層 socket 連線的事件, 可用於掌握連線狀況。

| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| socket.connecting | `type` WebsocketType <br> `attempts` number | 開始嘗試連線, 連線成功/失敗之前。 |
| socket.connect | `type` WebsocketType <br> `socket` [WebSocketConnection](https://github.com/theturtle32/WebSocket-Node/blob/d941f975e8ef6b55eafc0ef45996f4198013832c/docs/WebSocketConnection.md#websocketconnection) <br> `attempts` number | 連線成功後，尚未初始化之前。 |
| socket.failed | `type` WebsocketType <br> `attempts` number | 連線失敗。 |
| socket.reconnecting | `type` WebsocketType <br> `attempts` number | 開始嘗試重新連線, 若存在持續中的連線, 則先斷線。 |
| socket.reconnect | `type` WebsocketType <br> `attempts` number | 重連成功。 |
| socket.reconnect_failed | `type` WebsocketType <br> `attempts` number | 重連失敗。 |
| socket.max_reconnect | `type` WebsocketType <br> `attempts` number | 已抵達重連次數上限。 |
| socket.closing | `type` WebsocketType | 連線關閉之前。 |
| socket.close | `type` WebsocketType <br> `code` number <br> `desc` string | 連線關閉。(連線關閉代碼 `code` 可參照 [RFC 文件](https://tools.ietf.org/html/rfc6455#section-7.4))) |
| socket.error | `type` WebsocketType <br> `err` Error | 連線錯誤。 |

#### `api` 子事件
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| api.send.pre | `apiRequest` object | 傳送 API 請求之前。關於 `apiRequest` 可見 [/api/接口說明](https://cqhttp.cc/docs/4.2/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3)。 |
| api.send.post |  | 傳送 API 請求之後。  |
| api.response | `result` object | 對於 API 請求的響應。詳細格式見 [/api/接口說明](https://cqhttp.cc/docs/4.2/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3)。<br>此為集中處理所有 API 請求的響應, 若需對個別請求追蹤結果, 請參考[方法調用](#方法調用)中返回的 Promise 對象。<br>若需追蹤消息快速響應的結果, 請參考 [響應結果追蹤](#響應結果追蹤)。 |

> 註： `socket` 及 `api` 並未擁有基本事件，在這邊僅作 namespace 用途與其他常用事件作區別。  

### 事件傳播
事件具有向上傳播的機制，一個事件上報之後，該事件之所有親事件也會依序上報。關於事件親子關係的構成，可參考下方[事件樹](#事件樹)。(換而言之，在事件名稱上就是以 `.` 將親代串接子代)

舉個例子，群消息有人at某機器人，該機器人則會首先上報 `message.group.@me` 事件，該事件之親事件由下而上依序為 `message.group` 、 `message` ，則這兩個事件也會依照這個順序上報。

#### 快速響應
`message` 及其子事件的監聽器第一個參數： `CQEvent` 類別的實例，在這個機制中扮演重要的角色。透過 `CQEvent` 實例，所有監聽器皆可在自己的運行期間調用 `CQEvent #stopPropagation()` 方法聲明自己的處理權，以截獲事件並阻斷後續監聽器的調用，並立即以該事件返回之文字訊息(或透過調用 `CQEvent #setMessage(msg)` 設定之文字訊息，也可以透過 `Promise` 對象 resolve 之文字訊息)作為響應，送回至 CQHTTP API 。

由於在一次事件傳播中的所有監聽器都會收到同一個 `CQEvent` 實例，因此對於響應的決定方式，除了 `CQEvent #stopPropagation()` 所提供的事件截獲機制之外，也可以採取協議式的方式，就是透過每個監聽器調用 `CQEvent #getMessage()` `CQEvent #setMessage(msg)` 協議出一個最終的響應訊息。

CQEvent 的方法描述，見 [CQEvent](#cqevent-類別)。
> 目前僅 `message` 及其子事件支援 CQEvent 相關機制。

#### 響應結果追蹤
為了追蹤快速響應的結果(成功或失敗), 監聽器在調用上述之 CQEvent `#stopPropagation()` (原 `#cancel()`) 獲取響應的處理權之後, 同時還可通過 CQEvent `#onResponse()` 設置結果監聽器, 並透過 CQEvent `#onError()` 處理響應的錯誤。若沒有 CQEvent `#onError()` 進行錯誤處理, 發生響應錯誤時會觸發 [`error` 事件](#基本事件)。

#### 事件樹
```
├─ event (棄用) 
├─ notice
│    ├─ group_upload
│    ├─ group_admin
│    │    ├─ set
│    │    └─ unset
│    ├─ group_decrease
│    │    ├─ leave
│    │    ├─ kick
│    │    └─ kick_me
│    ├─ group_increase
│    │    ├─ approve
│    │    └─ invite
│    └─ friend_add
├─ request 
│    ├─ friend
│    └─ group
|         ├─ add
|         └─ invite
├─ error  
├─ ready  
├─ socket ※
│    ├─ connecting  
│    ├─ connect  
│    ├─ failed  
│    ├─ reconnecting  
│    ├─ reconnect  
│    ├─ reconnect_failed  
│    ├─ max_reconnect  
│    ├─ closing    
│    ├─ close    
│    └─ error
├─ api ※
│    ├─ response  
│    └─ send ※
│        ├─ pre    
│        └─ post  
└─ message
     ├─ private
     ├─ discuss
     │    └─ @me
     └─ group
          └─ @me

※: 表示無法在該節點進行監聽
```

### `socket.error` 默認監聽器
由於 `socket.error` 屬於連線失誤的事件，如果沒有適當的監聽器配套措施，會造成無防備的狀況下無法順利連線，徒增猿們除蟲困擾。

為此而產生了 `socket.error` 事件之默認監聽器，當開發者沒有主動監聽 `socket.error` 事件，則會使用默認監聽器，發生錯誤時會將收到的錯誤實例拋出，而該錯誤實例下有一個 `which` 字段(內容為 `string` 類型且必為 `/api` `/event` 兩者任一)指出是哪一個連線出了問題。

默認監聽器除了拋出錯誤外, 還會在 stderr 輸出以下警示訊息：
```
You should listen on "socket.error" yourself to avoid those unhandled promise warnings.
```

該錯誤可透過在 `process` 上監聽 `unhandledRejection` 事件取得。如下所示：
```js
process.on('unhandledRejection', function(err){
  switch(err.which){
    case CQWebSocket.WebsocketType.API:
      // 錯誤處理
      break
    case CQWebSocket.WebsocketType.EVENT:
      // 錯誤處理
      break
  }
})

// CQWebSocket.WebsocketType 下提供兩個常量對應分別至 /api 及 /event
```

## `CQEvent` 類別
### ~~CQEvent #isCanceled()~~
- 返回值： `boolean`

> 棄用中, 無替代

### ~~CQEvent #cancel()~~
### CQEvent #stopPropagation()
- 返回值： `void`

截獲事件並停止[事件傳播](#事件傳播)。

> `#cancel()` 棄用中, 更名為 `#stopPropagation()`

### CQEvent #getMessage()
- 返回值： `string`

取得目前的響應訊息。

### CQEvent #setMessage(`msg`)
- `msg` string
- 返回值： `void`

設置響應訊息。

### CQEvent #appendMessage(`msg`)
- `msg` string
- 返回值： `void`

串接響應訊息。

### CQEvent #hasMessage()
- 返回值： `boolean`

是否有響應訊息。

### CQEvent #onResponse(handler, options)
- `handler` (res: object) => void
- `options` object (同[方法調用](#方法調用)之 options)

設置響應結果的處理器, 用以追蹤訊息是否傳送成功。

### CQEvent #onError(handler)
- `handler` (err: ApiTimeoutError) => void

設置錯誤處理器, 可能的錯誤已知有響應超時。

## `CQWebSocket.WebsocketType` 實例
下有兩個常量對應至 `/api` 及 `/event` 。

### `WebsocketType.API`
= `"/api"` string

### `WebsocketType.EVENT`
= `"/event"` string

## CQTag 類別
作為所有CQ碼的親類別。

### new CQTag(`type`, `meta`)
- `type` string
- `meta` object

舉個例子, `[CQ:at,qq=123]` 這個 tag 等同
```js
new CQTag('at', { qq: '123' })
```

### CQTag #equals(`another`))
- `another` CQTag | string

比較是否為同一個 Tag, 採用兩邊呼叫 toString() 後的結果比較。

若 `another` 為一個 string, 則會先將之解析為 CQTag。

```js
new CQTag('at', { qq: '123' }).equals('[CQ:at,qq=123]') // true
```

### CQTag #toString()
- 返回值: `string`

```js
new CQTag('at', { qq: '123' }).toString() // [CQ:at,qq=123]
```

### CQAtTag 類別
繼承自 CQTag 類別。

#### new CQAtTag(`qq`)
- `qq` string|number

#### CQAtTag #getQQ()
- 返回值: `number`

```js
new CQAtTag('123').getQQ() // 123
```

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

## SDK 開發環境
### 下載源碼
```
git clone https://github.com/momocow/node-cq-websocket.git
```

### 安裝依賴
```
npm install
```

### 單元測試
```
npm test
```

採用 [ava](https://github.com/avajs/ava) 框架執行測試。

### 打包 CQWebSocket 至 browser 環境
```
npm run build
```
使用 webpack 將 SDK 及所有依賴打包, 並在 `/dist`目錄下產生一個 `cq-websocket.min.js`。

### 建置 demo/webpack
```
npm run build-demo
```
打包 `/demo/webpack/app.js` 內容, 在 `/demo/webpack/www` 目錄下產生一個 `bundle.js`。

## Known Issues
- CQHTTP API 插件尚未支援收發 Fragmant, 暫時禁用
  - 自`v1.2.6`
  - [node-cq-websocket #2](https://github.com/momocow/node-cq-websocket/pull/2)
  - [coolq-http-api #85](https://github.com/richardchien/coolq-http-api/issues/85)
- 在 Node 10.x 下, Buffer 寫入時的 RangeError (發生在 SDK 調用 API 方法時)。
  > 這是 Node 的問題, 暫時使用 Node 8.x 以下就沒問題。
```
RangeError [ERR_OUT_OF_RANGE]: The value of "value" is out of range. It must be >= 0 and <= 4294967295. Received -805456141
    at checkInt (internal/buffer.js:35:11)
    at writeU_Int32BE (internal/buffer.js:625:3)
    at Buffer.writeUInt32BE (internal/buffer.js:638:10)
    at WebSocketFrame.toBuffer (/***/node-cq-websocket/node_modules/websocket/lib/WebSocketFrame.js:257:24)
    at WebSocketConnection.sendFrame (/***/node-cq-websocket/node_modules/websocket/lib/WebSocketConnection.js:857:43)
    at WebSocketConnection.fragmentAndSend (/***/node-cq-websocket/node_modules/websocket/lib/WebSocketConnection.js:793:14)
    at WebSocketConnection.sendUTF (/***/node-cq-websocket/node_modules/websocket/lib/WebSocketConnection.js:733:10)
    at W3CWebSocket.send (/***/node-cq-websocket/node_modules/websocket/lib/W3CWebSocket.js:116:26)
```

## 歡迎餵食 ☕
請勿拍打 🤜 無限期掙飯中 🍙

<a href="https://www.buymeacoffee.com/momocow" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>