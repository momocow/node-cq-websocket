const { CQEmoji } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQEmoji',
  equals: {
    target: new CQEmoji(128251),
    equal: [
      new CQEmoji(128251)
    ],
    inequal: [
      new CQEmoji(127912),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQEmoji(128251),
    string: '[CQ:emoji,id=128251]'
  }],
  toJSON: [{
    target: new CQEmoji(128251),
    json: {
      type: 'emoji',
      data: {
        id: '128251'
      }
    }
  }],
  coerce: [{
    target: '[CQ:emoji,id=128251]',
    spec: {
      id: 128251
    }
  }]
}
