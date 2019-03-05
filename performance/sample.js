const test = require('tape')
const { iterate, MemoryLeakError } = require('leakage')

test('leak free', function (t) {
  iterate(() => {
    const a = []
    a.push('test'.repeat(10))
  })

  t.pass()
  t.end()
})

test('leak found', function (t) {
  const a = []
  t.throws(() => {
    iterate(() => {
      a.push('test'.repeat(10))
    })
  }, MemoryLeakError)
  t.end()
})
