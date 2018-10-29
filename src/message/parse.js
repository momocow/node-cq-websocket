const isSupportedTag = require('./isSupportedTag')
const CQTag = require('./CQTag')
const {
  CQAt,
  CQAnonymous,
  CQBFace,
  CQCustomMusic,
  CQDice,
  CQEmoji,
  CQFace,
  CQImage,
  CQMusic,
  CQRecord,
  CQRPS,
  CQSFace,
  CQShake,
  CQShare,
  CQText
} = require('./models')

const CQTAGS_EXTRACTOR = /\[CQ[^\]]*\]/g
const CQTAG_ANALYSOR = /\[CQ:([a-z]+?)(?:,((,?[a-zA-Z0-9-_.]+=[^,[\]]*)*))?\]/

function parseData (dataStr = '') {
  return dataStr
    ? dataStr.split(',')
      .map(opt => opt.split('='))
      .reduce((data, [ k, v ]) => {
        data[k] = v
        return data
      }, {})
    : null
}

function castCQTag (cqtag) {
  let proto
  switch (cqtag._type) {
    case 'anonymous':
      proto = CQAnonymous.prototype
      break
    case 'at':
      proto = CQAt.prototype
      break
    case 'bface':
      proto = CQBFace.prototype
      break
    case 'music':
      proto = cqtag.data.type === 'custom'
        ? CQCustomMusic.prototype : CQMusic.prototype
      break
    case 'dice':
      proto = CQDice.prototype
      break
    case 'emoji':
      proto = CQEmoji.prototype
      break
    case 'face':
      proto = CQFace.prototype
      break
    case 'image':
      proto = CQImage.prototype
      break
    case 'record':
      proto = CQRecord.prototype
      break
    case 'rps':
      proto = CQRPS.prototype
      break
    case 'sface':
      proto = CQSFace.prototype
      break
    case 'shake':
      proto = CQShake.prototype
      break
    case 'share':
      proto = CQShare.prototype
      break
    case 'text':
      proto = CQText.prototype
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
    let textTagScanner = 0
    const nonTextTags = (message.match(CQTAGS_EXTRACTOR) || [])
      .map(_tag => _tag.match(CQTAG_ANALYSOR))
      .filter(_tag => _tag && isSupportedTag(_tag[1]))
      .map(_tag => new CQTag(_tag[1], parseData(_tag[2])))
      .map(castCQTag)

    // insert text tags into appropriate position
    return nonTextTags.reduce((tags, cqtag, index) => {
      const cqtagStr = cqtag.toString()
      const cqtagIndex = message.indexOf(cqtagStr)
      if (cqtagIndex !== textTagScanner) {
        const text = message.substring(textTagScanner, cqtagIndex)
        tags.push(new CQText(text))
      }
      tags.push(cqtag)
      textTagScanner = cqtagIndex + cqtagStr.length
      if (nonTextTags.length - 1 === index && textTagScanner < message.length) {
        // last tag but there is still text
        const text = message.substring(textTagScanner)
        tags.push(new CQText(text))
      }
      return tags
    }, [])
  }

  if (Array.isArray(message)) {
    return message
      .filter(_tag => isSupportedTag(_tag.type))
      .map(_tag => new CQTag(_tag.type, _tag.data))
      .map(castCQTag)
  }

  return []
}
