module.exports = function traverse (obj, cb = function () {}) {
  if (typeof obj !== 'object') return

  Object.keys(obj).forEach(function (k) {
    if (cb(obj[k], k, obj) === false) return
    traverse(obj[k], cb)
  })
}
