### upyun.io

iojs client for [upyun](https://www.upyun.com)

### Why not use [official upyun sdk](https://github.com/upyun/node-upyun)

* Promise based
* Use ES6+, need iojs@2+
* More friendly api
* More stable (error handling, no *Sync methods, ...)

### APIs

* TODO: docs :smile:

* `getUsage()`
* `listBucket(path, opts)`
* `putFile(source, path, opts)`
* `headFile(path)`
* `getFile(path, dest)`
* `rmFile(path)`

### Example

* TODO: :cry:
* [See tests](test)

```js
let upyun = require('upyun.io')
let client = upyun({
  bucket: '',
  operator: '',
  password: '',
  endpoint: ''

})

await client.getUsage()
await client.listBucket('/')
```

### License
MIT
