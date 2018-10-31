const { CQShare } = require('../../..')
const CQFakeTag = require('../../fixture/CQFakeTag')

module.exports = {
  name: 'CQShare',
  equals: {
    target: new CQShare('url', 'title', 'content', 'image'),
    equal: [
      new CQShare('url', 'title', 'content', 'image')
    ],
    inequal: [
      new CQShare('another_url', 'title', 'content', 'image'),
      new CQFakeTag()
    ]
  },
  toString: [{
    target: new CQShare('url', 'title', 'content', 'image'),
    string: '[CQ:share,url=url,title=title,content=content,image=image]'
  }],
  toJSON: [{
    target: new CQShare('url', 'title', 'content', 'image'),
    json: {
      type: 'share',
      data: {
        url: 'url',
        title: 'title',
        content: 'content',
        image: 'image'
      }
    }
  }],
  coerce: [{
    target: '[CQ:share,url=url,title=title,content=content,image=image]',
    spec: {
      url: 'url',
      title: 'title',
      content: 'content',
      image: 'image'
    }
  }]
}
