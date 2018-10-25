const CQTAG_TYPES = [
  'face',
  'emoji',
  'bface',
  'sface',
  'image',
  'record',
  'at',
  'rps',
  'dice',
  'shake',
  'anonymous',
  'music',
  'share'
]

module.exports = function isSupportedTag (tagName) {
  return CQTAG_TYPES.includes(tagName)
}
