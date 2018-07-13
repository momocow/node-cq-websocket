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

function wrapSockError (err) {
  if (typeof err === 'string') {
    return new SocketError(err)
  }

  return err
}

module.exports = {
  wrapSockError,
  InvalidWsTypeError
}
