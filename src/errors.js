class InvalidWsTypeError extends Error {
  constructor (type) {
    super(`"${type}" is not a valid websocket type.`)
    this.which = type
  }
}

class InvalidContextError extends SyntaxError {
  constructor (type, data) {
    super(`[Websocket: ${type}] has received an invalid context.\nRaw data: ${data}`)
    this.name = 'InvalidContextError'
    this.which = type
    this.data = data
  }
}

class UnexpectedContextError extends Error {
  constructor (context, reason) {
    super('Unexpected context is received.')
    this.name = 'UnexpectedContextError'
    this.context = context
    this.reason = reason
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

class APITimeoutError extends Error {
  constructor (timeout, apiReq) {
    super(`The API response has reached the timeout (${timeout} ms).`)
    this.req = apiReq
  }
}

module.exports = {
  SocketError,
  UnexpectedContextError,
  InvalidWsTypeError,
  InvalidContextError,
  APITimeoutError
}
