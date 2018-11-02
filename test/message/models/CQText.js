const { CQText } = require('../../..')
const parse = require('../../../src/message/parse')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQText',
  equals: {
    target: new CQText('text'),
    equal: [
      new CQText('text'),
      parse('text')[0],
      parse([{
        type: 'text',
        data: {
          text: 'text'
        }
      }])[0]
    ],
    inequal: [
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQText('text'),
    string: 'text'
  }],
  toJSON: [{
    target: new CQText('text'),
    json: {
      type: 'text',
      data: {
        text: 'text'
      }
    }
  }],
  coerce: [{
    target: 'text',
    spec: {
      text: 'text'
    }
  }]
}
