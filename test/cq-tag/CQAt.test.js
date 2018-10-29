const { test } = require('ava')
const { CQAt } = require('../../cq-websocket')

test('CQAt #qq', t => {
  t.plan(1)

  const tag = new CQAt(123456789)
  t.is(tag.qq, 123456789)
})
