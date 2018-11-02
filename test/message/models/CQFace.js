const { CQFace } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQFace',
  equals: {
    target: new CQFace(1),
    equal: [
      new CQFace(1)
    ],
    inequal: [
      new CQFace(2),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQFace(1),
    string: '[CQ:face,id=1]'
  }],
  toJSON: [{
    target: new CQFace(1),
    json: {
      type: 'face',
      data: {
        id: '1'
      }
    }
  }],
  coerce: [{
    target: '[CQ:face,id=1]',
    spec: {
      id: 1
    }
  }]
}
