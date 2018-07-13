import { EventEmitter } from 'events'

export default class FakeConnection extends EventEmitter {
  sendUTF () { }

  /**
   * @param {function} sth
   * @param {number} delay
   */
  do (sth, delay) {
    setTimeout(sth, delay)
    return this
  }
}
