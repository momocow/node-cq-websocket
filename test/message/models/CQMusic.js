const { CQMusic } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQMusic',
  equals: {
    target: new CQMusic('qq', 1),
    equal: [
      new CQMusic('qq', 1)
    ],
    inequal: [
      new CQMusic('qq', 2),
      new CQMusic('xiami', 1),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQMusic('qq', 1),
    string: '[CQ:music,type=qq,id=1]'
  }],
  toJSON: [{
    target: new CQMusic('qq', 1),
    json: {
      type: 'music',
      data: {
        type: 'qq',
        id: '1'
      }
    }
  }],
  coerce: [{
    target: '[CQ:music,type=qq,id=1]',
    spec: {
      type: 'qq',
      id: 1
    }
  }]
}
