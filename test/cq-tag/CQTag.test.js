const { test } = require('ava')

const CQTag = require('../../src/message/CQTag')

test('CQTag #equals(another)', t => {
  t.plan(2)

  const tag1 = new CQTag('at', { qq: 123456789 })
  const tag2 = new CQTag('at', { qq: 123456789 })

  t.not(tag1, tag2)
  t.true(tag1.equals(tag2))
})

test('CQTag #toString()', t => {
  t.plan(4)

  const tag = new CQTag('at', { qq: 123456789, none: undefined })
  t.is(tag.toString(), '[CQ:at,qq=123456789]')
  t.is(tag.valueOf(), '[CQ:at,qq=123456789]')
  t.is(tag + '', '[CQ:at,qq=123456789]')

  tag.modifier.mode = 0
  tag.modifier.none = undefined
  t.is(tag.toString(), '[CQ:at,qq=123456789,mode=0]')
})

test('CQTag #toJSON()', t => {
  t.plan(2)

  const tag = new CQTag('at', { qq: 123456789 })

  t.deepEqual(tag.toJSON(), {
    type: 'at',
    data: {
      qq: 123456789
    }
  })

  t.is(JSON.stringify(tag), JSON.stringify({
    type: 'at',
    data: {
      qq: 123456789
    }
  }))
})
