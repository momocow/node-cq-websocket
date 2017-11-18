const assert = require('assert')
const { format, inspect } = require('util')

const TYPE_ERR_MSG = '[TypeError] [TypeGuard#%s(...)] provided %s'

function TypeErrorMsg (func, value) {
  return format(TYPE_ERR_MSG, func, inspect(value))
}

class TypeGuard {
  int (value) {
    assert(parseInt(value) === value && !isNaN(value), TypeErrorMsg('int', value))
    return value
  }

  string (value) {
    assert(typeof value === 'string', TypeErrorMsg('string', value))
    return value
  }

  boolean (value) {
    assert(typeof value === 'boolean', TypeErrorMsg('boolean', value))
    return value
  }

  function (value) {
    assert(typeof value === 'function', TypeErrorMsg('Function', value))
    return value
  }

  instance (value, type) {
    if (type) {
      assert(value instanceof type, TypeErrorMsg('instance', value))
    }
    return value
  }

  array (value, validator, ...args) {
    assert(Array.isArray(value), TypeErrorMsg('array', value))
    if (validator) {
      for (let item of value) {
        this._getValidator(validator)(item, ...args)
      }
    }
    return value
  }

  null (value) {
    assert(value === null, TypeErrorMsg('null', value))
    return value
  }

  custom (validator, { name = 'custom' } = {}) {
    return function (value, ...args) {
      assert(validator(value, ...args), TypeErrorMsg(name, value))
      return value
    }
  }

  either (value, [validator1, validator2], ...args) {
    if (!this.test(value, validator1, ...args) && !this.test(value, validator2, ...args)) {
      assert(false, TypeErrorMsg('either', value))
    }

    return value
  }

  test (value, validator, ...args) {
    try {
      this._getValidator(validator)(value, ...args)
      return true
    } catch (err) {
      return false
    }
  }

  _getValidator (validator) {
    return this[validator] ? this[validator] : validator
  }
}

module.exports = new TypeGuard()
