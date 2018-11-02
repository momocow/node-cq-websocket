const { CQDice } = require('../../..')
const parse = require('../../../src/message/parse')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQDice',
  equals: {
    target: new CQDice(),
    equal: [
      new CQDice()
    ],
    inequal: [
      parse('[CQ:dice,type=1]')[0],
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQDice(),
    string: '[CQ:dice]'
  }],
  toJSON: [{
    target: new CQDice(),
    json: {
      type: 'dice',
      data: null
    }
  }],
  coerce: [{
    target: '[CQ:dice,type=1]',
    spec: {
      type: 1
    }
  }]
}
