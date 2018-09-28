# 開發日誌
列為`棄用`表示**仍然支援**, 但請盡速修正為最新版本的實作。

## v1.6.1
- 修正
  - `message` 事件監聽器返回值的類型聲明。[#25](https://github.com/momocow/node-cq-websocket/issues/25) [#26](https://github.com/momocow/node-cq-websocket/issues/26) [#27](https://github.com/momocow/node-cq-websocket/issues/27)
  - API 響應文本的類型聲明，包含 `api.response` 事件的第一個參數及 callable 的返回值。 [#27](https://github.com/momocow/node-cq-websocket/issues/27)

## v1.6.0
- 新增
  - 類型聲明, 支持 Typescript。[#18](https://github.com/momocow/node-cq-websocket/issues/18) [#20](https://github.com/momocow/node-cq-websocket/issues/20)
  - 默認 API 導出 (default export)。[#21](https://github.com/momocow/node-cq-websocket/issues/21)

## v1.5.0
- 新增
  - 支持在 browser 環境運行。(須使用 browserify 或 webpack 等工具先行打包, 可見 [/demo/webpack 示例](../demo/webpack)))
  - 本倉庫 dist/ 目錄下已經打包了一個 cq-websocket.min.js 可直接在 web 引用, 並透過 `window.CQWebSocket` 變數使用本 SDK。
  - [`message` 事件快速響應](../README.md#事件傳播)的新機制: 為了追蹤快速響應的結果(成功或失敗), 監聽器一旦判定該訊息須由它來進行回應, 則須先調用 CQEvent `#stopPropagation()` (原 `#cancel()`) 獲取響應的處理權, 同監聽器內還可透過 CQEvent `#onResponse()` 設置結果監聽器, 並透過 CQEvent `#onError()` 處理響應的錯誤。若沒有 CQEvent `#onError()` 進行錯誤處理, 則會觸發 [`error` 事件](../README.md#基本事件)。
  - CQEvent `#appendMessage()`
  - [自動獲取機器人QQ號](../README.md#自動獲取機器人qq號): 建立連線時, 若有啟用 API 連線且未配置QQ號, 則自動透過API連線獲取。
  - `message.discuss.@`, `message.group.@` 兩個事件。可參考文件在 [message 子事件](../README.md#message-子事件) 及 [CQTag 類別](../README.md#cqtag-類別)的章節
  - `CQWebSocket` 建構子新增 [`requestOptions` 選項](../README.md#new-cqwebsocketopt), 該選項下目前只有一個 `timeout` 字段, 調用 API 方法時作為全局默認 timeout 選項。

- 變更
  - [api 子事件](../README.md#api-子事件) 移除監聽器中原第一個參數 WebsocketType。
  - 直接對 CQWebSocket 實例進行[方法調用](../README.md#方法調用)之返回值, 由 `this` 變更為 `Promise<ResObj>`, 用以追蹤方法調用的結果。

- 棄用
  - CQEvent `#cancel()` => [`#stopPropagation()`](#cqevent-stoppropagation))
  - CQEvent `#isCanceled()` (禁用, 無替代)
  - ~~`message.discuss.@me`~~ 和 ~~`message.group.@me`~~ 事件, 將更名為 `message.<discuss|group>.@.me`事件。請見 [message 子事件](../README.md#message-子事件)文件。

## v1.4.2
- 新增
  - 默認 `socket.error` 監聽器將會由 stderr 輸出警告訊息。[#4](https://github.com/momocow/node-cq-websocket/issues/4)
  - 內部狀態控管, 加強連線管理。[#5](https://github.com/momocow/node-cq-websocket/issues/5)
  - `socket.reconnecting`, `socket.reconnect`, `socket.reconnect_failed` 及 `socket.max_reconnect` 事件。(參見 [socket 子事件](../README.md#socket-子事件))
  - CQWebSocket 建構時的選項增加 `baseUrl` 一項, 為某些如反向代理之網路環境提供較彈性的設定方式。
- 變更
  - `ready` 事件不再針對個別連線(`/api`, `/event`)進行上報, 改為在**所有已啟用**之連線準備就緒後, 一次性發布。若需要掌握個別連線, 請利用 `socket.connect` 事件。
- 修正
  - 事件名稱錯誤。(`closing` => `socket.closing`, `connecting` => `socket.connecting`)

## v1.4.0
增強對連線的管理與維護, 斷線後自動嘗試重新連線。
- 新增
  - [`off()` 方法](../README.md#cqwebsocket-offevent_type-listener)以移除指定監聽器。
  - [reconnect() 方法](../README.md#cqwebsocket-reconnectdelay-wstype)以重新建立連線。
  - [isSockConnected() 方法](../README.md#cqwebsocket-issockconnectedwstype)檢測 socket 是否正在連線。
  - `socket.connecting`, `socket.failed` 及 `socket.closing` 事件(參見 [socket 子事件](../README.md#socket-子事件))。
- 變更
  - [`connect()`](../README.md#cqwebsocket-connectwstype), [`disconnect()`](../README.md#cqwebsocket-disconnectwstype), [`reconnect()`](../README.md#cqwebsocket-reconnectdelay-wstype) 三個方法增加參數 `wsType` 以指定目標連線, 若 `wsType` 為 undefined 指涉全部連線。
  - [CQWebSocket 建構子](../README.md#new-cqwebsocketopt)增加額外3個設定, `reconnection`, `reconnectionAttempts` 及 `reconnectionDelay`, 提供連線失敗時自動重連之功能。
- 修正
  - [`once()` 方法](../README.md#cqwebsocket-onceevent_type-listener)執行後無法正確移除監聽器之問題。
- 棄用
  - `isConnected()` 方法
  > 重新命名為 [`isReady()`](../README.md#cqwebsocket-isready)。

## v1.3.0
兼容 CoolQ HTTP API v3.x 及 v4.x 兩個主版本。
- 新增
  - 給予 CoolQ HTTP API v4.x 之上報事件 `notice` 實作更多[子事件](../README.md#notice-子事件)。(群文件上傳, 群管變動, 群成員增減, 好友添加)
  - 給予上報事件 `request` 實作更多[子事件](../README.md#request-子事件)。(好友請求, 群請求/群邀請)
- 棄用
  - 上報事件: `event` -> 請改用 `notice`事件。
## v1.2.6
- 變更
  - 禁用 websocket fragment, 待 CoolQ HTTP API 修正問題時再次啟用。
  > 於此帖追蹤進度。[coolq-http-api #85](https://github.com/richardchien/coolq-http-api/issues/85)