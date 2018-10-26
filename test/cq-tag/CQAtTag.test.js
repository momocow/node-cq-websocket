const { test } = require('ava')
const { CQAtTag } = require('../..')

test.skip('CQAtTag #qq', t => {
  t.plan(1)

  const tag = new CQAtTag(123456789)
  t.is(tag.qq, 123456789)
})
