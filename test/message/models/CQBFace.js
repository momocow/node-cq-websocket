const { CQBFace } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQBFace',
  equals: {
    target: new CQBFace(1, 'p'),
    equal: [
      new CQBFace(1)
    ],
    inequal: [
      new CQBFace(2, 'p'),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQBFace(1, 'p'),
    string: '[CQ:bface,id=1,p=p]'
  }],
  toJSON: [{
    target: new CQBFace(1, 'p'),
    json: {
      type: 'bface',
      data: {
        id: '1',
        p: 'p'
      }
    }
  }],
  coerce: [{
    target: '[CQ:bface,id=1]',
    spec: {
      id: 1
    }
  }]
}
