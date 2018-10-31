const { CQShake } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQShake',
  equals: {
    target: new CQShake(),
    equal: [
      new CQShake()
    ],
    inequal: [
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQShake(),
    string: '[CQ:shake]'
  }],
  toJSON: [{
    target: new CQShake(),
    json: {
      type: 'shake',
      data: null
    }
  }],
  coerce: [{
    target: '[CQ:shake]',
    spec: { }
  }]
}
