const { CQCustomMusic, CQFace } = require('../../..')

module.exports = {
  name: 'CQCustomMusic',
  equals: {
    target: new CQCustomMusic('url', 'audio', 'title', 'content', 'image'),
    equal: [
      new CQCustomMusic('url', 'audio', 'title', 'content', 'image')
    ],
    inequal: [
      new CQCustomMusic('another_url', 'audio', 'title', 'content', 'image'),
      new CQFace(1)
    ]
  },
  toString: [{
    target: new CQCustomMusic('url', 'audio', 'title', 'content', 'image'),
    string: '[CQ:music,type=custom,url=url,audio=audio,title=title,content=content,image=image]'
  }],
  toJSON: [{
    target: new CQCustomMusic(123456789),
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
