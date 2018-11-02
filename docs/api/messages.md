# CQ 碼 🐴

- [CQ 碼 🐴](#cq-%E7%A2%BC-%F0%9F%90%B4)
  - [CQTag](#cqtag)
    - [CQTag tagName](#cqtag-tagname)
    - [CQTag data](#cqtag-data)
    - [CQTag modifier](#cqtag-modifier)
    - [CQTag equals](#cqtag-equals)
    - [CQTag coerce](#cqtag-coerce)
    - [CQTag toString](#cqtag-tostring)
    - [CQTag valueOf](#cqtag-valueof)
      - [範例](#%E7%AF%84%E4%BE%8B)
    - [CQTag toJSON](#cqtag-tojson)
  - [CQAnonymous](#cqanonymous)
    - [CQAnonymous constructor](#cqanonymous-constructor)
    - [CQAnonymous ignore](#cqanonymous-ignore)
  - [CQAt](#cqat)
    - [CQAt constructor](#cqat-constructor)
    - [CQAt qq](#cqat-qq)
  - [CQBFace](#cqbface)
    - [CQBFace constructor](#cqbface-constructor)
    - [CQBFace id](#cqbface-id)
  - [CQCustomMusic](#cqcustommusic)
    - [CQCustomMusic constructor](#cqcustommusic-constructor)
    - [CQCustomMusic type](#cqcustommusic-type)
    - [CQCustomMusic url](#cqcustommusic-url)
    - [CQCustomMusic audio](#cqcustommusic-audio)
    - [CQCustomMusic title](#cqcustommusic-title)
    - [CQCustomMusic content](#cqcustommusic-content)
    - [CQCustomMusic image](#cqcustommusic-image)
  - [CQDice](#cqdice)
    - [CQDice constructor](#cqdice-constructor)
    - [CQDice type](#cqdice-type)
  - [CQEmoji](#cqemoji)
    - [CQEmoji constructor](#cqemoji-constructor)
    - [CQEmoji id](#cqemoji-id)
  - [CQFace](#cqface)
    - [CQFace constructor](#cqface-constructor)
    - [CQFace id](#cqface-id)
  - [CQImage](#cqimage)
    - [CQImage constructor](#cqimage-constructor)
    - [CQImage file](#cqimage-file)
    - [CQImage url](#cqimage-url)
    - [CQImage cache](#cqimage-cache)
  - [CQMusic](#cqmusic)
    - [CQMusic constructor](#cqmusic-constructor)
    - [CQMusic type](#cqmusic-type)
    - [CQMusic id](#cqmusic-id)
  - [CQRecord](#cqrecord)
    - [CQRecord constructor](#cqrecord-constructor)
    - [CQRecord file](#cqrecord-file)
    - [CQRecord magic](#cqrecord-magic)
    - [CQRecord hasMagic](#cqrecord-hasmagic)
  - [CQRPS](#cqrps)
    - [CQRPS constructor](#cqrps-constructor)
    - [CQRPS type](#cqrps-type)
  - [CQSFace](#cqsface)
    - [CQSFace constructor](#cqsface-constructor)
    - [CQSFace id](#cqsface-id)
  - [CQShake](#cqshake)
    - [CQShake constructor](#cqshake-constructor)
  - [CQShare](#cqshare)
    - [CQShare constructor](#cqshare-constructor)
    - [CQShare url](#cqshare-url)
    - [CQShare title](#cqshare-title)
    - [CQShare content](#cqshare-content)
    - [CQShare image](#cqshare-image)
  - [CQText](#cqtext)
    - [CQText constructor](#cqtext-constructor)
    - [CQText text](#cqtext-text)

## CQTag
CQTag 為一個抽象類別，*正常情況下並**不會**直接建立一個 CQTag 的實例*，而是使用其子類別，如 CQAt、CQImage... 等。

CQTag 作為所有 CQ 碼的親類別。

### CQTag tagName
```js
tag.tagName
```
- `string`

CQ碼功能名，如 `"at"`、`"image"`... 等。

### CQTag data
```js
tag.data
```
- `ReadOnly<object>`

`data` 對象的值可能為 `string`, `boolean` 及 `number`。

`data` 對象包含的內容為，可能會出現在**上報消息**中的 CQ 碼參數，依照參數名稱，描述於 `data` 對象的各字段下。

如：上報消息中含有 `"[CQ:at,qq=123456789]"`，則 `tag.data` 對象內容為 `{ qq: 123456789 }`。

### CQTag modifier
```js
tag.modifier
```
- `object`

只出現在**API 調用**中的 CQ 碼參數。

如：調用 API 發送圖片，若要禁用緩存，須加上之 cache 參數即為 `modifier` 的內容，CQ 碼為 `"[CQ:image,cache=0,file=file]"`，`modifier` 對象內容為 `{ cache: 0 }`。


### CQTag equals
```js
tag.equals(another)
```
- `another` CQTag
- 返回值： `boolean`

若 `another` 非繼承自 `CQTag` 類別，則 `false`。
若 `another.tagName` 不同於 `this.tagName`，則 `false`。
若 `another.data` 與 `this.data` 進行 [Deep Equal](https://github.com/substack/node-deep-equal) (strict mode) 比對不相符，則 `false`。
其餘返回 `true`。

### CQTag coerce
```js
tag.coerce()
```
- 返回值： `this`

將 `data` 對象的值，依照各 CQ 碼的定義，強制轉型。

此方法為通常為**內部使用**。

### CQTag toString
```js
tag.toString()
```
- 返回值： `string`

返回 CQ 碼的文字型態，如 `"[CQ:at,qq=123456789]"`。

### CQTag valueOf
```js
tag.valueOf()
```
- 返回值: `string`

同 [CQTag #toString()](#cqtag-tostring)。

藉此方法，使 CQ 碼可以進行如字串相加... 等運算。

#### 範例
```js
const tag = new CQAt(123456789)

console.log(tag + ' 你好') // "[CQ:at,qq=123456789] 你好"
```

### CQTag toJSON
```js
tag.toJSON()
```
- 返回值： [CQHTTPMessage](CQHTTPMessage.md)

見 CQHTTP API 之[消息段](https://cqhttp.cc/docs/#/Message?id=%E6%B6%88%E6%81%AF%E6%AE%B5%EF%BC%88%E5%B9%BF%E4%B9%89-cq-%E7%A0%81%EF%BC%89)說明。

## CQAnonymous
### CQAnonymous constructor
```js
new CQAnonymous([shouldIgnoreIfFailed])
```
- `shouldIgnoreIfFailed` boolean *[modifier]*

### CQAnonymous ignore
```js
tag.ignore
```
- `boolean` *[modifier]*

## CQAt
### CQAt constructor
```js
new CQAt(qq)
```
- `qq` number *[data]*

### CQAt qq
```js
tag.qq
```
- `ReadOnly<number>`  *[data]*

## CQBFace
### CQBFace constructor
```js
new CQBFace(id, p)
```
- `id` number *[data]*
- `p` string *[modifier]*

關於這個神祕的 `p`，可以參考 [CQ 码的坑](https://github.com/richardchien/coolq-http-api/wiki/CQ-%E7%A0%81%E7%9A%84%E5%9D%91)。

### CQBFace id
```js
tag.id
```

- `ReadOnly<number>` *[data]*

## CQCustomMusic
### CQCustomMusic constructor
```js
new CQCustomMusic(url, audio, title[, content[, image]])
```
- `url` string *[data]*
- `audio` string *[data]*
- `title` string *[data]*
- `content` string *[data]*
- `image` string *[data]*

### CQCustomMusic type
```js
tag.type // "custom"
```
- `ReadOnly<"custom">` *[data]*

### CQCustomMusic url
```js
tag.url
```
- `ReadOnly<string>` *[data]*

### CQCustomMusic audio
```js
tag.audio
```
- `ReadOnly<string>` *[data]*

### CQCustomMusic title
```js
tag.title
```
- `ReadOnly<string>` *[data]*

### CQCustomMusic content
```js
tag.content
```
- `ReadOnly<string>` *[data]*

### CQCustomMusic image
```js
tag.image
```
- `ReadOnly<string>` *[data]*

## CQDice
### CQDice constructor
```js
new CQDice()
```

### CQDice type
```js
tag.type
```
- ReadOnly<number> *[data]*

## CQEmoji
### CQEmoji constructor
```js
new CQEmoji(id)
```
- `id` number *[data]*

### CQEmoji id
```js
tag.id
```
- `ReadOnly<number>` *[data]*

## CQFace
### CQFace constructor
```js
new CQFace(id)
```
- `id` number *[data]*

### CQFace id
```js
tag.id
```
- `ReadOnly<number>` *[data]*

## CQImage
### CQImage constructor
```js
new CQImage(file[, cache])
```
- `file` string *[data]*
- `cache` boolean *[modifier]*

### CQImage file
```js
tag.file
```
- `ReadOnly<string>` *[data]*

### CQImage url
```js
tag.url
```
- `ReadOnly<string>` *[data]*

### CQImage cache
```js
tag.cache
```
- `boolean` *[modifier]*

## CQMusic
### CQMusic constructor
```js
new CQMusic(type, id)
```
- `type` string *[data]*
- `id` number *[data]*

### CQMusic type
```js
tag.type
```
- `ReadOnly<string>` *[data]*

### CQMusic id
```js
tag.id
```
- `ReadOnly<number>` *[data]*

## CQRecord
### CQRecord constructor
```js
new CQRecord(file[, magic])
```
- `file` string
- `magic` boolean

### CQRecord file
```js
tag.file
```
- `ReadOnly<string>` *[data]*

### CQRecord magic
```js
tag.magic
```
- `true | undefined` *[modifier]*

### CQRecord hasMagic
```js
tag.hasMagic()
```
- 返回值： boolean

## CQRPS
### CQRPS constructor
```js
new CQRPS()
```

### CQRPS type
```js
tag.type
```
- ReadOnly<number> *[data]*

## CQSFace
### CQSFace constructor
```js
new CQSFace(id)
```
- `id` number *[data]*

### CQSFace id
```js
tag.id
```
- `ReadOnly<number>` *[data]*

## CQShake
### CQShake constructor
```js
new CQShake()
```

## CQShare
### CQShare constructor
```js
new CQShare(url, title[, content[, image]])
```
- `url` string *[data]*
- `title` string *[data]*
- `content` string *[data]*
- `image` string *[data]*

### CQShare url
```js
tag.url
```
- `ReadOnly<string>` *[data]*

### CQShare title
```js
tag.title
```
- `ReadOnly<string>` *[data]*

### CQShare content
```js
tag.content
```
- `ReadOnly<string>` *[data]*

### CQShare image
```js
tag.image
```
- `ReadOnly<string>` *[data]*

## CQText
### CQText constructor
```js
new CQText(text)
```
- `text` string *[data]*

### CQText text
```js
tag.text
```
- `ReadOnly<string>` *[data]*

[偽 CQ 碼](https://cqhttp.cc/docs/#/Message?id=%E6%A0%BC%E5%BC%8F)。