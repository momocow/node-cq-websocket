const TYPES = [
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

const DESTRUCTOR = /\[CQ:([a-z]+?),((,?[a-zA-Z0-9-_.]+=[^,[\]]*)*)\]/

const CQAtTag = require('./CQAtTag')
const CQTag = require('./CQTag')

/**
 * @param {string} str
 */
function parse (str = '') {
  const tags = str.match(/\[CQ[^\]]*\]/g) || []
  return tags.map(_tag => _tag.match(DESTRUCTOR))
    .filter(_tag => _tag && TYPES.includes(_tag[1]))
    .map(_tag => {
      return {
        type: _tag[1],
        meta: _tag[2].split(',').reduce(function (acc, tok) {
          const arrTok = tok.split('=').map(v => v.trim())
          acc[arrTok[0]] = arrTok[1]
          return acc
        }, {})
      }
    })
    .map(_tag => {
      switch (_tag.type) {
        case 'at':
          return new CQAtTag(_tag.meta.qq)
        default:
          return new CQTag(_tag.type, _tag.meta)
      }
    })
}


module.exports = {
  TYPES, parse
}
