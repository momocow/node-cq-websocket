# node-cq-websocket
[![npm](https://img.shields.io/npm/dt/cq-websocket.svg)](https://www.npmjs.com/package/cq-websocket)
[![npm](https://img.shields.io/npm/v/cq-websocket.svg)](https://www.npmjs.com/package/cq-websocket)
[![license](https://img.shields.io/github/license/momocow/node-cq-websocket.svg)](https://github.com/momocow/node-cq-websocket#readme)
[![CQHttp](https://img.shields.io/badge/dependency-CQHttp-green.svg)](https://github.com/richardchien/coolq-http-api#readme)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-ff69b4.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Known Vulnerabilities](https://snyk.io//test/github/momocow/node-cq-websocket/badge.svg?targetFile=package.json)](https://snyk.io//test/github/momocow/node-cq-websocket?targetFile=package.json)

## 🚧 分支狀態
- 主線
  - [![Build Status](https://travis-ci.org/momocow/node-cq-websocket.svg?branch=master)](https://travis-ci.org/momocow/node-cq-websocket)
  - [![Coverage Status](https://coveralls.io/repos/github/momocow/node-cq-websocket/badge.svg?branch=master)](https://coveralls.io/github/momocow/node-cq-websocket?branch=master)
- dev
  - [![Build Status](https://travis-ci.org/momocow/node-cq-websocket.svg?branch=dev)](https://travis-ci.org/momocow/node-cq-websocket)
  - [![Coverage Status](https://coveralls.io/repos/github/momocow/node-cq-websocket/badge.svg?branch=dev)](https://coveralls.io/github/momocow/node-cq-websocket?branch=dev)

## 🗯️ 關於此 SDK
依賴 CQHTTP API 插件的 websocket 接口, 為 NodeJs 開發者提供一個搭建 QQ 聊天機器人的 SDK。

關於 CQHTTP API 插件，見 [richardchien/coolq-http-api](https://github.com/richardchien/coolq-http-api#readme)

> 本 SDK 尚處於測試階段，使用上仍有機會碰到Bug，歡迎提交PR或issue回報。

> 由於付費問題，本 SDK 目前僅針對酷Q Air做測試。

## 🎉 功能/特色
- 輕鬆配置, 快速搭建 QQ 聊天機器人。
- 自動維護底層連線, 開發者只需專注在聊天應用的開發。若斷線, 可依照配置[重新連線](docs/get-started/features.md#%E6%96%B7%E7%B7%9A%E9%87%8D%E9%80%A3)。
- 支持消息監聽器內, [快速響應](docs/get-started/features.md#%E5%BF%AB%E9%80%9F%E9%9F%BF%E6%87%89)。
- 連線建立時, 可[自動獲取機器人QQ號](docs/get-started/features.md#%E8%87%AA%E5%8B%95%E7%8D%B2%E5%8F%96%E6%A9%9F%E5%99%A8%E4%BA%BAqq%E8%99%9F)。

## 🗎 SDK 文件
[閱讀更多 ➡️](docs/README.md)

## 🛠️ 開發者看板
本 SDK 採用 [ava](https://github.com/avajs/ava) 框架執行測試。

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

### 開發日誌
[閱讀更多 ➡️](docs/CHANGELOG.md)

### Known Issues
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

## 🍙 歡迎餵食
請勿拍打 🤜 無限期掙飯中 ☕

<a href="https://www.buymeacoffee.com/momocow" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
