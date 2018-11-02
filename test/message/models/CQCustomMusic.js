const { CQCustomMusic } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQCustomMusic',
  equals: {
    target: new CQCustomMusic('url', 'audio', 'title', 'content', 'image'),
    equal: [
      new CQCustomMusic('url', 'audio', 'title', 'content', 'image')
    ],
    inequal: [
      new CQCustomMusic('another_url', 'audio', 'title', 'content', 'image'),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQCustomMusic('url', 'audio', 'title', 'content', 'image'),
    string: '[CQ:music,type=custom,url=url,audio=audio,title=title,content=content,image=image]'
  }],
  toJSON: [{
    target: new CQCustomMusic('url', 'audio', 'title', 'content', 'image'),
    json: {
      type: 'music',
      data: {
        type: 'custom',
        url: 'url',
        audio: 'audio',
        title: 'title',
        content: 'content',
        image: 'image'
      }
    }
  }],
  coerce: [{
    target: '[CQ:music,type=custom,url=url,audio=audio,title=title,content=content,image=image]',
    spec: {
      type: 'custom',
      url: 'url',
      audio: 'audio',
      title: 'title',
      content: 'content',
      image: 'image'
    }
  }]
}
