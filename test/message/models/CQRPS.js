const { CQRPS } = require('../../..')
const parse = require('../../../src/message/parse')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQRPS',
  equals: {
    target: new CQRPS(),
    equal: [
      new CQRPS()
    ],
    inequal: [
      parse('[CQ:rps,type=1]')[0],
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQRPS(),
    string: '[CQ:rps]'
  }],
  toJSON: [{
    target: new CQRPS(),
    json: {
      type: 'rps',
      data: null
    }
  }],
  coerce: [{
    target: '[CQ:rps,type=1]',
    spec: {
      type: 1
    }
  }]
}
