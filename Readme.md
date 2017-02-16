
[![NPM version][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]
[![Node Version][node-version-img]][node-version-url]

### upyun.io

another nodejs client for [upyun](https://www.upyun.com)

### Why not use [official upyun sdk](https://github.com/upyun/node-upyun)

* Promise based, async/await friendly
* More friendly APIs
* More stable (error handling, no *Sync methods, ...)

### Some CLI tools

* [upyun-upload](https://github.com/haoxins/upyun-upload)

### APIs

* `getUsage()`

* `listBucket(path, opts)`
  - `path`: `{String}` upyun path
  - `opts`: `{Object}` TODO

* `putFile(source, path, opts)`
  - `source`: `{String|Buffer|Stream}` file path, buffer data, file stream to upload
  - `path`: `{String}` upyun path
  - `opts`: `{Object}`
    * `type`: `Content-Type`, will parsed by [jshttp/mime-types](https://github.com/jshttp/mime-types)
    * `size`: file size, **note: if you put file by stream, size is required**
    * `headers`: `{Object}`, custom http headers

* `headFile(path)`
  - `path`: `{String}` upyun path

* `getFile(path, dest)`
  - `path`: `{String}` upyun path
  - `dest`: `{String}` dest file path

* `rmFile(path)`
  - `path`: `{String}` upyun path

* result
  - `status`: http response statusCode
  - `headers`: http response headers
  - `body`: http response body (for most cases, it's `''`)
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
const upyun = require('upyun.io')
const client = upyun({
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

[npm-img]: https://img.shields.io/npm/v/upyun.io.svg?style=flat-square
[npm-url]: https://npmjs.org/package/upyun.io
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/haoxins/upyun.io.svg?style=flat-square
[david-url]: https://david-dm.org/haoxins/upyun.io
[node-version-img]: https://img.shields.io/node/v/upyun.io.svg
[node-version-url]: https://nodejs.org
