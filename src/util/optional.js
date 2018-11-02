module.exports = function optional (value, formatter) {
  return value !== undefined ? formatter(value) : undefined
}
