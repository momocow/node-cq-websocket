class InvalidWsTypeError extends Error {
  constructor (type) {
    super(`"${type}" is not a valid websocket type.`)
  }
}

class InvalidContextError extends SyntaxError {
  constructor (type, data) {
    super(`[Websocket: ${type}] has received an invalid context.\nRaw data: ${data}`)
    this.name = 'InvalidContextError'
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

class ApiTimoutError extends Error {
  constructor (timeout, apiReq) {
    super(`The API response has reached the timeout (${timeout} ms).`)
    this.req = apiReq
  }
}

module.exports = {
  SocketError,
  InvalidWsTypeError,
  InvalidContextError,
  ApiTimoutError
}
