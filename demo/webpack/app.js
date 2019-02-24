const { CQWebSocket } = require('../..')

const qs = new URLSearchParams(window.location.search.substr(1))

const bot = new CQWebSocket({
  host: qs.get('host') || undefined,
  port: qs.get('port') || undefined,
  baseUrl: qs.get('url') || undefined,
  qq: qs.get('qq') || undefined
})

bot.on('message', function (e, { raw_message: rawMessage }) {
  document.getElementById('messages').appendChild(document.createElement('div')).innerHTML = `
    <span>${new Date().toLocaleString()}</span><span style="margin-left:40px">${rawMessage}</span>
  `
})

bot.connect()
