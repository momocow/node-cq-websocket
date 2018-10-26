const isSupportedTag = require('./isSupportedTag')
const CQTag = require('./CQTag')
const {
  CQAtTag,
  CQAnonymousTag,
  CQBFaceTag,
  CQCustomMusicTag,
  CQDiceTag,
  CQEmojiTag,
  CQFaceTag,
  CQImageTag,
  CQMusicTag,
  CQRecordTag,
  CQRPSTag,
  CQSFaceTag,
  CQShakeTag,
  CQShareTag
} = require('./models')

const CQTAGS_EXTRACTOR = /\[CQ[^\]]*\]/g
const CQTAG_ANALYSOR = /\[CQ:([a-z]+?),((,?[a-zA-Z0-9-_.]+=[^,[\]]*)*)\]/

function parseData (dataStr = '') {
  return dataStr.split(',')
    .map(opt => opt.split('='))
    .reduce((data, [ k, v ]) => {
      data[k] = v
      return data
    }, {})
}

function castCQTag (cqtag) {
  let proto
  switch (cqtag._type) {
    case 'anonymous':
      proto = CQAnonymousTag.prototype
      break
    case 'at':
      proto = CQAtTag.prototype
      break
    case 'bface':
      proto = CQBFaceTag.prototype
      break
    case 'music':
      proto = cqtag.data.type === 'custom'
        ? CQCustomMusicTag.prototype : CQMusicTag.prototype
      break
    case 'dice':
      proto = CQDiceTag.prototype
      break
    case 'emoji':
      proto = CQEmojiTag.prototype
      break
    case 'face':
      proto = CQFaceTag.prototype
      break
    case 'image':
      proto = CQImageTag.prototype
      break
    case 'record':
      proto = CQRecordTag.prototype
      break
    case 'rps':
      proto = CQRPSTag.prototype
      break
    case 'sface':
      proto = CQSFaceTag.prototype
      break
    case 'shake':
      proto = CQShakeTag.prototype
      break
    case 'share':
      proto = CQShareTag.prototype
      break
    default:
      return cqtag
  }

  return Object.setPrototypeOf(cqtag, proto).coerce()
}

/**
 * @param {string|any[]} message
 */
module.exports = function parse (message) {
  if (typeof message === 'string') {
    return (message.match(CQTAGS_EXTRACTOR) || [])
      .map(_tag => _tag.match(CQTAG_ANALYSOR))
      .filter(_tag => _tag && isSupportedTag(_tag[1]))
      .map(_tag => new CQTag(_tag[1], parseData(_tag[2])))
      .map(castCQTag)
  }

  if (Array.isArray(message)) {
    return message
      .filter(_tag => isSupportedTag(_tag.type))
      .map(_tag => new CQTag(_tag.type, _tag.data))
      .map(castCQTag)
  }

  return []
}
