### upyun.io

iojs client for [upyun](https://www.upyun.com)

### Why not use [official upyun sdk](https://github.com/upyun/node-upyun)

* Promise based
* Use ES6+, need iojs@2+
* More friendly api
* More stable (error handling, no *Sync methods, ...)

### APIs

* `getUsage()`
* `listBucket(path, opts)`
  - `opts`
* `putFile(source, path, opts)`
  - `opts`
* `headFile(path)`
* `getFile(path, dest)`
* `rmFile(path)`

* result
  - status: http response statusCode
  - headers: http response headers
  - body: http response body (for most cases, it's `''`)
    - for `listBucket`, the body is `json`, with the data below

```js
// body
[{
  bucket: 'bucket name',
  type: 'file',
  size: 1024,
  modifyTime: 1431583534
}, {
  bucket: 'bucket name',
  type: 'folder',
  size: 1024,
  modifyTime: 1431583534
}, {
  // ...
}]
```

### Example

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
