const { CQRecord } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQRecord',
  equals: {
    target: new CQRecord('file'),
    equal: [
      new CQRecord('file', true),
      new CQRecord('file', false)
    ],
    inequal: [
      new CQRecord('file2'),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQRecord('file', true),
    string: '[CQ:record,file=file,magic=true]'
  }, {
    target: new CQRecord('file'),
    string: '[CQ:record,file=file]'
  }],
  toJSON: [{
    target: new CQRecord('file', true),
    json: {
      type: 'record',
      data: {
        file: 'file',
        magic: 'true'
      }
    }
  }],
  coerce: [{
    target: '[CQ:record,file=file]',
    spec: {
      file: 'file'
    }
  }],
  extra: [
    function (test) {
      test('CQRecord #magic', t => {
        t.plan(3)
        const tag = new CQRecord('file', false)
        t.is(tag.magic, undefined)
        tag.magic = true
        t.true(tag.magic)
        t.true(tag.hasMagic())
      })
    }
  ]
}
