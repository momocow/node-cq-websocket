const { CQAnonymous, CQFace } = require('../../..')

module.exports = {
  name: 'CQAnonymous',
  equals: {
    target: new CQAnonymous(),
    equal: [
      new CQAnonymous(),
      new CQAnonymous(true)
    ],
    inequal: [
      new CQFace(1)
    ]
  },
  toString: [{
    target: new CQAnonymous(true),
    string: '[CQ:anonymous,ignore=true]'
  }],
  toJSON: [{
    target: new CQAnonymous(true),
    json: {
      type: 'anonymous',
      data: {
        ignore: 'true'
      }
    }
  }],
  extra: [
    function (test) {
      test('CQAnonymous #shouldIgnoreIfFailed()', t => {
        t.plan(2)
        t.false(new CQAnonymous().shouldIgnoreIfFailed())
        t.true(new CQAnonymous(true).shouldIgnoreIfFailed())
      })
    }
  ]
}
