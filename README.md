# agqr-list

[![Build Status](https://travis-ci.org/jagpotato/agqr-list.svg?branch=master)](https://travis-ci.org/jagpotato/agqr-list)

超!A&G+で放送されている番組の一覧を取得する．

## Installation
```
npm install agqr-list
```

## Usage
```js
import agqr from 'agqr-list'

agqr.getProgramList()
  .then((list) => {
    console.log(list)
  })
```

## Method
### getProgramList
#### getProgramList()，getProgramList('All')
全曜日の番組を取得
#### getProgramList('曜日')
指定した曜日の番組を取得

引数 => 'Mon'，'Tue'，'Wed'，'Thu'，'Fri'，'Sat'，'Sun'