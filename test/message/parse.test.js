const test = require('ava').default
const { spy } = require('sinon')

const {
  CQAnonymous,
  CQAt,
  CQBFace,
  CQCustomMusic,
  CQDice,
  CQEmoji,
  CQFace,
  CQImage,
  CQMusic,
  CQRecord,
  CQRPS,
  CQSFace,
  CQShake,
  CQShare,
  CQText
} = require('../..')
const parse = require('../../src/message/parse')

test('parse(string_msg)', t => {
  t.plan(2)
  const msg = 'Hey, [[CQ:at,qq=123456789]] this is a \n[[CQ:emoji,id=128251]] test [[CQ:invalid,any=prop]]'
  const tags = parse(msg)
  t.deepEqual(tags, [
    new CQText('Hey, ['),
    new CQAt(123456789),
    new CQText('] this is a \n['),
    new CQEmoji(128251),
    new CQText('] test [[CQ:invalid,any=prop]]')
  ])

  // Array.prototype.join() call #toString() on each item internally
  t.is(tags.join(''), msg)
})

test('parse(array_msg)', t => {
  t.plan(1)
  const msg = [{
    type: 'text',
    data: {
      text: 'Hey, ['
    }
  }, {
    type: 'at',
    data: {
      qq: '123456789'
    }
  }, {
    type: 'text',
    data: {
      text: '] this is a \n['
    }
  }, {
    type: 'emoji',
    data: {
      id: 128251
    }
  }, {
    type: 'text',
    data: {
      text: '] test [[CQ:invalid,any=prop]]'
    }
  }]

  const tags = parse(msg)
  t.deepEqual(tags, [
    new CQText('Hey, ['),
    new CQAt(123456789),
    new CQText('] this is a \n['),
    new CQEmoji(128251),
    new CQText('] test [[CQ:invalid,any=prop]]')
  ])
})

const TAGS = [
  { text: '[CQ:anonymous]', prototype: CQAnonymous },
  { text: '[CQ:at,qq=123456789]', prototype: CQAt },
  { text: '[CQ:bface,id=1]', prototype: CQBFace },
  { text: '[CQ:music,type=custom,url=url,title=title,audio=audio,content=content,image=image]', prototype: CQCustomMusic },
  { text: '[CQ:dice,type=4]', prototype: CQDice },
  { text: '[CQ:emoji,id=128251]', prototype: CQEmoji },
  { text: '[CQ:face,id=1]', prototype: CQFace },
  { text: '[CQ:image,file=file,url=url]', prototype: CQImage },
  { text: '[CQ:music,type=qq,id=1]', prototype: CQMusic },
  { text: '[CQ:record,file=file]', prototype: CQRecord },
  { text: '[CQ:rps,type=1]', prototype: CQRPS },
  { text: '[CQ:sface,id=1]', prototype: CQSFace },
  { text: '[CQ:shake]', prototype: CQShake },
  { text: '[CQ:share,url=url,title=title,content=content,image=image]', prototype: CQShare }
]

TAGS.forEach(TAG => {
  test(TAG.text, macro, TAG.text, TAG.prototype)
})

function macro (t, text, clazz) {
  t.plan(3)

  const coerce = spy(clazz.prototype, 'coerce')

  const tags = parse(text)

  t.is(tags.length, 1)
  t.true(tags[0] instanceof clazz)

  // ensure that the #coerce() of each CQTag successor class has been called when a tag is parsed
  // then we can test against that
  // the #coerce() of each CQTag successor class coerces the data to the correct types
  t.true(coerce.calledOnce)
}

test('parse(): unsupported tags will be parsed into CQText', t => {
  t.plan(3)
  const tag = parse('[CQ:unknown,key=value]')[0]
  t.true(tag instanceof CQText)
  t.is(tag.text, '[CQ:unknown,key=value]')
  t.is(tag.toString(), '[CQ:unknown,key=value]')
})
