const test = require('ava').default
const fs = require('fs')
const path = require('path')
const parse = require('../../src/message/parse')

const MODELS = fs.readdirSync(path.join(__dirname, 'models'))
  .map(modelFile => require(`./models/${modelFile}`))

MODELS.forEach(function ({
  name,
  equals,
  toString,
  toJSON,
  coerce,
  extra = []
}) {
  /**
   * #equals()
   */
  {
    const { target, equal, inequal } = equals
    test(`${name} #equals()`, t => {
      t.plan(2 * (equal.length + inequal.length))

      equal.forEach(eq => {
        t.not(target, eq)
        t.true(target.equals(eq))
      })

      inequal.forEach(ineq => {
        t.not(target, ineq)
        t.false(target.equals(ineq))
      })
    })
  }

  /**
   * #toString()
   */
  test(`${name} #toString()`, t => {
    t.plan(toString.length)
    toString.forEach(({ target, string }) => {
      t.is(target.toString(), string)
    })
  })

  /**
   * #toJSON()
   */
  test(`${name} #toJSON()`, t => {
    t.plan(toJSON.length)
    toJSON.forEach(({ target, json }) => {
      t.deepEqual(target.toJSON(), json)
    })
  })

  /**
   * #coerce()
   */
  // coerce is mainly used in #parse()
  // if the spec does not contain a "coerce" section,
  // it indicates that the tag may not be received from CoolQ
  if (coerce) {
    test(`${name} #coerce()`, t => {
      t.plan(
        coerce
          .map(({ spec }) => Object.keys(spec).length)
          .reduce((acc, len) => acc + len, 0)
      )

      coerce.forEach(({ target, spec }) => {
        const entries = Object.entries(spec)
        const parsed = parse(target)[0]
        for (let [ k, v ] of entries) {
          t.is(parsed[k], v)
        }
      })
    })
  }

  /**
   * Extra tests
   */
  extra.forEach(fn => {
    fn(test)
  })
})
