class InvalidWsTypeError extends Error {
  constructor (type) {
    super(`"${type}" is not a valid websocket type.`)
  }
}

class SocketError extends Error {
  /**
   * @param {string} desc
   */
  constructor (desc) {
    super(desc)
    this.name = 'SocketError'
  }
}

module.exports = {
  SocketError,
  InvalidWsTypeError
}
