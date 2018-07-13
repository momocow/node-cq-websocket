const CQWebsocket = require('../..')

const bot = new CQWebsocket()

bot.on('socket.connecting', function (wsType, attempts) {
  console.log('[%d][%s] 嘗試第 %d 次連線 _(:з」∠)_', new Date(), wsType, attempts)
}).on('socket.connect', function (wsType, sock, attempts) {
  console.log('[%d][%s] 第 %d 次連線嘗試成功 ヽ(✿ﾟ▽ﾟ)ノ', new Date(), wsType, attempts)
}).on('socket.failed', function (wsType, attempts) {
  console.log('[%d][%s] 第 %d 次連線嘗試失敗 。･ﾟ･(つд`ﾟ)･ﾟ･', new Date(), wsType, attempts)
}).on('socket.error', function (wsType, err) {
  console.log('[%d][%s] 錯誤: %O', new Date(), wsType, err)
})

bot.connect()
