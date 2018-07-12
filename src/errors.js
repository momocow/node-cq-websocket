class SocketError extends Error {
  /**
   * @param {string} desc
   */
  constructor (desc) {
    super(desc)
    this.name = 'SocketError'
  }
}

module.exports = function wrapError (err) {
  if (typeof err === 'string') {
    return new SocketError(err)
  }

  return err
}
