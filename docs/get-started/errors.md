# 錯誤處理

## `error` 事件
目前有兩個狀況會發布這個事件。

1. 底層 socket 收到的消息，於 `JSON.parse()` 時報錯，這很可能意味著 JSON 格式錯誤，或是消息並非 UTF8 編碼，這個錯誤應該來自於消息發送端。
2. SDK 在分發事件時，若遇到未預期的文本字段，則會發布這個事件。例如，收到 `post_type` 為 `message` 的事件，但 `message_type` 非已知的訊息類型，則發布 `error` 事件。

### `socket.error`
由於 `socket.error` 屬於連線失誤的事件，如果沒有適當的監聽器配套措施，會造成無防備的狀況下無法順利連線，徒增困擾。


為此而產生了 `socket.error` 事件之默認監聽器，當開發者沒有主動監聽 `socket.error` 事件，則會使用默認監聽器，發生錯誤時會將收到的錯誤實例拋出，而該錯誤實例下有一個 `which` 字段(內容為 `string` 類型且必為 `/api` `/event` 兩者任一)指出是哪一個連線出了問題。

默認監聽器除了拋出錯誤外, 還會在 stderr 輸出以下警示訊息：
```
You should listen on "socket.error" yourself to avoid those unhandled promise warnings.
```

※**自行**監聽 `socket.error` 可避免*默認監聽器*的行為。
