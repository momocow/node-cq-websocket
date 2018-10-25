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
  switch (cqtag.type) {
    case 'anonymous':
      return Object.setPrototypeOf(cqtag, CQAnonymousTag.prototype)
    case 'at':
      return Object.setPrototypeOf(cqtag, CQAtTag.prototype)
    case 'bface':
      return Object.setPrototypeOf(cqtag, CQBFaceTag.prototype)
    case 'music':
      if (cqtag.data.type === 'custom') {
        return Object.setPrototypeOf(cqtag, CQCustomMusicTag.prototype)
      } else {
        return Object.setPrototypeOf(cqtag, CQMusicTag.prototype)
      }
    case 'dice':
      return Object.setPrototypeOf(cqtag, CQDiceTag.prototype)
    case 'emoji':
      return Object.setPrototypeOf(cqtag, CQEmojiTag.prototype)
    case 'face':
      return Object.setPrototypeOf(cqtag, CQFaceTag.prototype)
    case 'image':
      return Object.setPrototypeOf(cqtag, CQImageTag.prototype)
    case 'record':
      return Object.setPrototypeOf(cqtag, CQRecordTag.prototype)
    case 'rps':
      return Object.setPrototypeOf(cqtag, CQRPSTag.prototype)
    case 'sface':
      return Object.setPrototypeOf(cqtag, CQSFaceTag.prototype)
    case 'shake':
      return Object.setPrototypeOf(cqtag, CQShakeTag.prototype)
    case 'share':
      return Object.setPrototypeOf(cqtag, CQShareTag.prototype)
    default:
      return cqtag
  }
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
