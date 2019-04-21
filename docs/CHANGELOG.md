CQWebSocket

## [2.0.1](https://github.com/momocow/node-cq-websocket/compare/v2.0.0...v2.0.1) (2019-04-21)


### Bug Fixes

* **pack:** Fix missing .d.ts in the NPM package. ([a6bf75b](https://github.com/momocow/node-cq-websocket/commit/a6bf75b))

# [2.0.0](https://github.com/momocow/node-cq-websocke/compare/v1.8.1...v2.0.0) (2018-11-02)


### Bug Fixes

* fix CQTag #equals() performs not as expected ([0d1bbbd](https://github.com/momocow/node-cq-websocke/commit/0d1bbbd)), closes [#17](https://github.com/momocow/node-cq-websocke/issues/17) [#34](https://github.com/momocow/node-cq-websocke/issues/34)
* fix error JSON representative of CQText ([732522d](https://github.com/momocow/node-cq-websocke/commit/732522d))
* fix string messages without CQTags are not parsed as a CQText instance. ([0f345cf](https://github.com/momocow/node-cq-websocke/commit/0f345cf)), closes [#17](https://github.com/momocow/node-cq-websocke/issues/17)
* replace CQEvent #cancel() with #stopPropagation() ([1ad3408](https://github.com/momocow/node-cq-websocke/commit/1ad3408)), closes [#29](https://github.com/momocow/node-cq-websocke/issues/29)


### Code Refactoring

* expose CQWebSocket as default export ([f36e864](https://github.com/momocow/node-cq-websocke/commit/f36e864)), closes [#21](https://github.com/momocow/node-cq-websocke/issues/21) [#23](https://github.com/momocow/node-cq-websocke/issues/23)
* remove "event" event in favour of "notice" event ([405b48c](https://github.com/momocow/node-cq-websocke/commit/405b48c)), closes [#29](https://github.com/momocow/node-cq-websocke/issues/29)
* remove CQEvent instance method "cancel()" ([c8923d8](https://github.com/momocow/node-cq-websocke/commit/c8923d8)), closes [#29](https://github.com/momocow/node-cq-websocke/issues/29)
* remove CQWebSocket instance method "isConnected()" ([c38b1cf](https://github.com/momocow/node-cq-websocke/commit/c38b1cf)), closes [#29](https://github.com/momocow/node-cq-websocke/issues/29)
* rename constructor option "access_token" to "accessToken" ([6caedb6](https://github.com/momocow/node-cq-websocke/commit/6caedb6)), closes [#29](https://github.com/momocow/node-cq-websocke/issues/29)
* use CQWebSocket instead of CQWebsocket for public API ([0b81b53](https://github.com/momocow/node-cq-websocke/commit/0b81b53)), closes [#22](https://github.com/momocow/node-cq-websocke/issues/22)
* **browser:** expose the API under global variable "CQWebSocketSDK". ([db37019](https://github.com/momocow/node-cq-websocke/commit/db37019)), closes [#23](https://github.com/momocow/node-cq-websocke/issues/23)


### Features

* add CQ tags and add the 3rd parameter of message events to be a list of parsed tags ([06e38a7](https://github.com/momocow/node-cq-websocke/commit/06e38a7)), closes [#17](https://github.com/momocow/node-cq-websocke/issues/17) [#34](https://github.com/momocow/node-cq-websocke/issues/34)
* CQ tags parsing now is based on "message" field instead of "raw_message" field ([e6b4992](https://github.com/momocow/node-cq-websocke/commit/e6b4992))
* support mixing string, CQTag and CQHTTPMessage in array-type messages. ([777281e](https://github.com/momocow/node-cq-websocke/commit/777281e))
* support to append string when the CQEvent message is in array type ([b3091da](https://github.com/momocow/node-cq-websocke/commit/b3091da))


### Tests

* remove tests for event "message.discuss.[@me](https://github.com/me)" and "message.group.[@me](https://github.com/me)" ([0698300](https://github.com/momocow/node-cq-websocke/commit/0698300)), closes [#29](https://github.com/momocow/node-cq-websocke/issues/29)


### BREAKING CHANGES

* **browser:** global variable "CQWebSocketSDK" will retrieve the same structure of API as
require('cq-websocket')
* all message events now receive a list of parsed tags as the 3rd parameter
* Option renaming from "access_token" to "accessToken"
* No more CQWebsocket => use CQWebSocket
* CQWebSocket is exposed as default export and a named export, "CQWebSocket".
* Use "message.discuss.@.me" instead of "message.discuss.@me" and
"message.group.@.me" instead of "message.group.@me"
* Use CQEvent #stopPropagation() instead of #cancel().
* Use CQWebSocket #isReady() instead of #isConnected()
* No longer provide support for CQHTTP v3.x

## [1.8.1](https://github.com/momocow/node-cq-websocket/compare/v1.8.0...v1.8.1) (2018-10-24)


### Bug Fixes

* do not include version in filename of browser bundle ([374f378](https://github.com/momocow/node-cq-websocket/commit/374f378)), closes [#36](https://github.com/momocow/node-cq-websocket/issues/36)

# [1.8.0](https://github.com/momocow/node-cq-websocket/compare/v1.7.0...v1.8.0) (2018-10-22)


### Features

* add meta events: lifecycle and heartbeat. ([bd8b9f9](https://github.com/momocow/node-cq-websocket/commit/bd8b9f9)), closes [#35](https://github.com/momocow/node-cq-websocket/issues/35)
