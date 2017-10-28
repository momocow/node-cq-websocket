# 單元測試清單
(顯示勾選表示測試完成)

## `new Websocket({...})`
- [ ] `access_token`: 如不為空，連線時鍵結需附帶該參數
- [ ] `enableAPI`: 啟用`/api`連線
- [ ] `enableEvent`: 啟用`/event`連線
- [ ] `host`, `port`: 建立基本連線
- [ ] `qq`: 該bot之QQ號

## `Websocket(method, {...})`
- [ ] 可向`/api`連線發送請求
- [ ] 列舉測試#1: `/send_private_msg`
- [ ] 列舉測試#2: `/send_group_msg`
- [ ] 列舉測試#3: `/send_discuss_msg`
- [ ] 列舉測試#4: `/send_msg`

## `Websocket#on(...)`
- [ ] 如果沒有監聽`socket.error`事件，則由預設監聽器代為拋出錯誤; 監聽該事件時會移除預設監聽器
- [ ] 事件測試#1: `message`
- [ ] 事件測試#2: `message.private`
- [ ] 事件測試#3: `message.discuss`
- [ ] 事件測試#4: `message.discuss.@me`
- [ ] 事件測試#5: `message.group`
- [ ] 事件測試#6: `message.group.@me`
- [ ] 事件測試#7: `event`
- [ ] 事件測試#8: `request`
- [ ] 事件測試#9: `error`
- [ ] 事件測試#10: `socket.connect`
- [ ] 事件測試#11: `socket.send.pre`
- [ ] 事件測試#12: `socket.send.post`
- [ ] 事件測試#13: `socket.response`
- [ ] 事件測試#14: `socket.error`
- [ ] 事件測試#15: `socket.close`
