const { test } = require('ava')

const { parse } = require('../../src/cq-tags/cq-utils')
const CQAtTag = require('../../src/cq-tags/CQAtTag')
const CQTag = require('../../src/cq-tags/CQTag')

test('CQ-Utils#parse(str)', function (t) {
  t.plan(3)

  const tags = parse('[CQ:image,file=123,url=123][CQ:at,qq=123]')
  
  t.is(tags.length, 2)
  t.true(tags[0] instanceof CQTag)
  t.true(tags[1] instanceof CQAtTag)
})
