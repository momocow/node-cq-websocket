const { CQSFace } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQSFace',
  equals: {
    target: new CQSFace(1),
    equal: [
      new CQSFace(1)
    ],
    inequal: [
      new CQSFace(2),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQSFace(1),
    string: '[CQ:sface,id=1]'
  }],
  toJSON: [{
    target: new CQSFace(1),
    json: {
      type: 'sface',
      data: {
        id: '1'
      }
    }
  }],
  coerce: [{
    target: '[CQ:sface,id=1]',
    spec: {
      id: 1
    }
  }]
}
