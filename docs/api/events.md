# 事件列表

- [事件列表](#%E4%BA%8B%E4%BB%B6%E5%88%97%E8%A1%A8)
    - [事件樹](#%E4%BA%8B%E4%BB%B6%E6%A8%B9)
    - [基本事件](#%E5%9F%BA%E6%9C%AC%E4%BA%8B%E4%BB%B6)
        - [message](#message)
        - [notice](#notice)
        - [request](#request)
        - [meta_event](#metaevent)
        - [socket](#socket)
        - [api](#api)

## 事件樹
```
├─ message
│    ├─ private
│    ├─ discuss
│    │    └─ @
│    │      └─ me
│    └─ group
│         └─ @
│           └─ me
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
├─ meta_event
|    ├─ lifecycle
|    └─ heartbeat
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
└─ api ※
     ├─ response  
     └─ send ※
         ├─ pre    
         └─ post  

※: 表示無法在該節點進行監聽
```

## 基本事件
前三個基本事件之說明，可以另外參考 CQHTTP API 的[數據上報格式](https://cqhttp.cc/docs/4.2/#/Post?id=%E4%B8%8A%E6%8A%A5%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F)。

參數 `context` 可見[事件列表](https://cqhttp.cc/docs/4.2/#/Post?id=%E4%BA%8B%E4%BB%B6%E5%88%97%E8%A1%A8)。

| 事件類型 | 監聽器參數 `...args` | 說明 |
| - | - | - |
| message | `event` [CQEvent](#cqevent-類別)<br> `context` object<br> `tags` CQTag[]| 所有流入的訊息。 |
| notice  | `context` object | 群文件上傳, 群管變動, 群成員增減, 好友添加...等QQ事件。 |
| request | `context` object | 好友請求, 群請求/群邀請...等QQ事件。 |
| meta_event | `context` object | 來自 CQHTTP API 的元事件。 |
| error | `err` Error | 應用層面的錯誤, 如 CQHttp API 消息格式錯誤, 響應超時... 等 |
| ready | `this` | 設定中啟用之連線均成功並初始化完成，可以開始調用API (送消息...等操作)。 |

### message
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| message.private | `event` CQEvent <br> `context` object<br> `tags` CQTag[] | 私聊消息。 |
| message.discuss | `event` CQEvent <br> `context` object<br> `tags` CQTag[] | 討論組消息。 |
| message.discuss.@ | `event` CQEvent <br> `context` object <br> `tags` CQTag[] | 有人於討論組消息中被at。 |
| message.discuss.@.me | `event` CQEvent <br> `context` object<br> `tags` CQTag[] | 有人於討論組消息at機器人。 |
| message.group | `event` CQEvent <br> `context` object<br> `tags` CQTag[] | 群消息。 |
| message.group.@ | `event` CQEvent <br> `context` object <br> `tags` CQTag[] | 有人於群消息中被at。 |
| message.group.@.me | `event` CQEvent <br> `context` object<br> `tags` CQTag[] | 有人於群消息at機器人。 |

### notice
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

### request
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| request.friend | `context` object | 私聊消息。 |
| request.group.add | `context` object | 加群請求。 |
| request.group.invite | `context` object | 邀請入群。 |

### meta_event
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| meta_event.lifecycle | `context` object | 生命周期。 |
| meta_event.heartbeat | `context` object | 心跳。 |

### socket
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
| socket.error | `type` WebsocketType <br> `err` Error | 連線錯誤。若該事件無監聽器，則會安裝默認監聽器，固定拋出例外。 |

### api
| 事件類型 | 監聽器參數 | 說明 |
| - | - | - |
| api.send.pre | `apiRequest` object | 傳送 API 請求之前。關於 `apiRequest` 可見 [/api/接口說明](https://cqhttp.cc/docs/4.2/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3)。 |
| api.send.post |  | 傳送 API 請求之後。  |
| api.response | `result` object | 對於 API 請求的響應。詳細格式見 [/api/接口說明](https://cqhttp.cc/docs/4.2/#/WebSocketAPI?id=api-%E6%8E%A5%E5%8F%A3)。<br>此為集中處理所有 API 請求的響應, 若需對個別請求追蹤結果, 請參考[方法調用](#方法調用)中返回的 Promise 對象。<br>若需追蹤消息快速響應的結果, 請參考 [響應結果追蹤](#響應結果追蹤)。 |
