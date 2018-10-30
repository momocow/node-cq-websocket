const { test } = require('ava')
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
  {
    const { target, string } = toString
    test(`${name} #toString()`, t => {
      t.plan(1)
      t.is(target.toString(), string)
    })
  }

  /**
   * #toJSON()
   */
  {
    const { target, json } = toJSON
    test(`${name} #toJSON()`, t => {
      t.plan(1)
      t.deepEqual(target.toJSON(), json)
    })
  }

  /**
   * #coerce()
   */
  // coerce is mainly used in #parse()
  // if the spec does not contain a "coerce" section,
  // it indicates that the tag may not be received from CoolQ
  if (coerce) {
    const { target, spec } = coerce
    test(`${name} #coerce()`, t => {
      const entries = Object.entries(spec)
      t.plan(entries.length)

      for (let [ k, v ] of entries) {
        t.is(parse(target)[0][k], v)
      }
    })
  }

  /**
   * Extra tests
   */
  extra.forEach(fn => {
    fn(test)
  })
})
