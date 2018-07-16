const CQWebsocket = require('../..')

const qs = new URLSearchParams(window.location.search.substr(1))

const bot = new CQWebsocket({
  host: qs.get('host') || '',
  port: qs.get('port') || '',
  baseUrl: qs.get('url') || '',
  qq: qs.get('qq') || -1
})

bot.on('message', function (e, { raw_message }) {
  document.getElementById('messages').appendChild(document.createElement('div')).innerHTML = `
    <span>${new Date().toLocaleString()}</span><span style="margin-left:40px">${raw_message}</span>
  `
})

bot.connect()
