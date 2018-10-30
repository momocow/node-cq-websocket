const { test } = require('ava')

const CQTag = require('../../src/message/CQTag')

test('CQTag #toString(): fields with undefined values will not be serialized.', t => {
  t.plan(4)

  const tag = new CQTag('at', { qq: 123456789, none: undefined })
  const ans = '[CQ:at,qq=123456789]'
  t.is(tag.toString(), ans)

  // all of the following tests call #toString() internally
  t.is(tag.valueOf(), ans)
  t.is(tag + '', ans)

  tag.modifier.mode = 0
  tag.modifier.none = undefined
  t.is(tag.toString(), '[CQ:at,qq=123456789,mode=0]')
})

test('CQTag #toJSON(): fields with undefined values will not include into JSON.', t => {
  t.plan(1)

  const tag = new CQTag('at', { qq: 123456789, none: undefined })

  t.deepEqual(tag.toJSON(), {
    type: 'at',
    data: {
      qq: '123456789'
    }
  })

  // JSON.stringify() calls #toJSON() on each object internally
  t.is(JSON.stringify(tag), JSON.stringify({
    type: 'at',
    data: {
      qq: '123456789'
    }
  }))
})
