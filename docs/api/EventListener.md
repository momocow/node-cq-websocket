# 事件監聽器

- [事件監聽器](#%E4%BA%8B%E4%BB%B6%E7%9B%A3%E8%81%BD%E5%99%A8)
  - [EventListener](#eventlistener)
  - [OnceListener](#oncelistener)
  - [MessageEventListener](#messageeventlistener)
  - [OnceMessageEventListener](#oncemessageeventlistener)

## EventListener
```ts
listener: (context: object) => void | Promise<void>
```

- `context` 為上報的文本，可見 CQHTTP API 之[事件列表](https://cqhttp.cc/docs/#/Post?id=%E4%BA%8B%E4%BB%B6%E5%88%97%E8%A1%A8)。


## OnceListener
```ts
listener: (context: object) => void | Promise<void> | false
```
用於 [`bot.once(event, listener)`](CQWebSocket.md#once)。

當返回值為 `false` ，指涉該監聽器並未完成任務，則保留該監聽器繼續聽取事件，不做移除。下一次事件發生時，該監聽器在調用後會再次以返回值判定去留。若返回值非 `false` ，指涉該監聽器處理完畢，立即移除。

## MessageEventListener
```ts
listener: (e: CQEvent, context: object, tags: CQTag[]) => void | Promise<void> | string | Promise<string> | ArrayMessage | Promise<ArrayMessage>
```

- `CQEvent` 見 [CQEvent](CQEvent.md)。
- `CQTag` 見 [CQTag](message/README.md#CQTag)。
- `ArrayMessage` 見 [ArrayMessage](ArrayMessage.md)。

用於監聽 [`message` 及其子事件](events.md#message)。

返回值為 `string | Promise<string> | ArrayMessage | Promise<ArrayMessage>` 時，會以該返回值作為響應訊息。

## OnceMessageEventListener
```ts
listener: (e: CQEvent, context: object, tags: CQTag[]) => void | Promise<void> | string | Promise<string> | ArrayMessage | Promise<ArrayMessage> | false
```
用於一次性監聽 [`message` 及其子事件](events.md#message)。

返回值為 `false` 時，行為同 [OnceListener](#oncelistener)；返回值非 `false` 時，行為同 [MessageEventListener](#messageeventlistener)。