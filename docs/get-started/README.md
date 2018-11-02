# 快速開始

- [快速開始](#%E5%BF%AB%E9%80%9F%E9%96%8B%E5%A7%8B)
  - [創建機器人實例](#%E5%89%B5%E5%BB%BA%E6%A9%9F%E5%99%A8%E4%BA%BA%E5%AF%A6%E4%BE%8B)
    - [延伸閱讀](#%E5%BB%B6%E4%BC%B8%E9%96%B1%E8%AE%80)
  - [對接 CQHTTP API](#%E5%B0%8D%E6%8E%A5-cqhttp-api)
  - [認識 CQWebSocket SDK](#%E8%AA%8D%E8%AD%98-cqwebsocket-sdk)
  - [錯誤處理](#%E9%8C%AF%E8%AA%A4%E8%99%95%E7%90%86)

## 創建機器人實例
一個機器人的實例象徵一組對 CQHTTP API 的連線，其中包含了兩個 socket (`/event` 及 `/api`)、所有來自 CQHTTP API 的消息上報、對 CQHTTP API 的 API 調用。

首先我們需要先創建機器人的實例，代碼如下：
```js
const { CQWebSocket } = require('cq-websocket')
const bot = new CQWebSocket()
```

`bot` 便是機器人的實例，這邊我們完全採用默認值進行連線。

設定 ws 伺服器位址時, 你可以從以下方式擇一配置。
  1. 使用 `baseUrl` 項指定伺服器 URL。
  2. 使用 `protocol`, `host`, `port` (皆為可選) 指定目標伺服器。

### 延伸閱讀
- [API: CQWebSocket Constructor](../api/CQWebSocket.md#constructor)

## 對接 CQHTTP API
可以前往以下文件了解如何與 CQHTTP API 進行連接。

[閱讀更多 ➡️](connection.md)

## 認識 CQWebSocket SDK
這邊會提及一些 SDK 默認的行為，消息收發的模式。

[閱讀更多 ➡️](features.md)

## 錯誤處理
[閱讀更多 ➡️](errors.md)