const { CQImage } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQImage',
  equals: {
    target: new CQImage('file'),
    equal: [
      new CQImage('file', true),
      new CQImage('file', false)
    ],
    inequal: [
      new CQImage('file2'),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQImage('file'),
    string: '[CQ:image,file=file]'
  }],
  toJSON: [{
    target: new CQImage('file'),
    json: {
      type: 'image',
      data: {
        file: 'file'
      }
    }
  }],
  coerce: [{
    target: '[CQ:image,file=file,url=url]',
    spec: {
      file: 'file',
      url: 'url'
    }
  }],
  extra: [
    function (test) {
      test('CQImage #cache', t => {
        t.plan(2)
        const tag = new CQImage('file', false)
        t.is(tag.cache, 0)
        tag.cache = true
        t.is(tag.cache, undefined)
      })
    }
  ]
}
