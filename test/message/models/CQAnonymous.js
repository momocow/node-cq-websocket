const { CQAnonymous } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQAnonymous',
  equals: {
    target: new CQAnonymous(),
    equal: [
      new CQAnonymous(),
      new CQAnonymous(true)
    ],
    inequal: [
      new CQFakeTag()
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
      test('CQAnonymous #ignore', t => {
        t.plan(2)
        const tag = new CQAnonymous()
        t.false(tag.ignore)
        tag.ignore = true
        t.true(tag.ignore)
      })
    }
  ]
}
