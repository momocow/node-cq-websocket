const { stub } = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const FakeWebSocket = require('./FakeWebSocket')
const fws = FakeWebSocket.getSeries()

module.exports = function () {
  const wsStub = stub()
  wsStub.callsFake(fws)

  const CQWebsocket = proxyquire('../..', {
    websocket: {
      w3cwebsocket: wsStub
    }
  })

  return {
    wsStub,
    CQWebsocket
  }
}
