const { CQAt, CQFace } = require('../../..')

module.exports = {
  name: 'CQAt',
  equals: {
    target: new CQAt(123456789),
    equal: [
      new CQAt(123456789)
    ],
    inequal: [
      new CQAt(987654321),
      new CQFace(1)
    ]
  },
  toString: [{
    target: new CQAt(123456789),
    string: '[CQ:at,qq=123456789]'
  }],
  toJSON: [{
    target: new CQAt(123456789),
    json: {
      type: 'at',
      data: {
        qq: '123456789'
      }
    }
  }],
  coerce: [{
    target: '[CQ:at,qq=123456789]',
    spec: {
      qq: 123456789
    }
  }]
}
