## CQTag 類別
作為所有CQ碼的親類別。

### new CQTag(`type`, `meta`)
- `type` string
- `meta` object

舉個例子, `[CQ:at,qq=123]` 這個 tag 等同
```js
new CQTag('at', { qq: '123' })
```

### CQTag #equals(`another`))
- `another` CQTag | string

比較是否為同一個 Tag, 採用兩邊呼叫 toString() 後的結果比較。

若 `another` 為一個 string, 則會先將之解析為 CQTag。

```js
new CQTag('at', { qq: '123' }).equals('[CQ:at,qq=123]') // true
```

### CQTag #toString()
- 返回值: `string`

```js
new CQTag('at', { qq: '123' }).toString() // [CQ:at,qq=123]
```

### CQAtTag 類別
繼承自 CQTag 類別。

#### new CQAtTag(`qq`)
- `qq` string|number

#### CQAtTag #getQQ()
- 返回值: `number`

```js
new CQAtTag('123').getQQ() // 123
```