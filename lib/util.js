
'use strict'

const getHash = require('hash-stream')
const crypto = require('crypto')
const fs = require('mz/fs')

/**
 * exports
 */

module.exports = {
  parseResult: parseResult,
  getEndpoint: getEndpoint,
  preSlash: preSlash,
  md5sign: md5sign,
  getSize: getSize,
  getMd5: getMd5
}

const endpoints = new Map()

endpoints.set('v0', 'v0.api.upyun.com')
endpoints.set('v1', 'v1.api.upyun.com')
endpoints.set('v2', 'v2.api.upyun.com')
endpoints.set('v3', 'v3.api.upyun.com')
endpoints.set('ctcc', 'v1.api.upyun.com')
endpoints.set('cucc', 'v2.api.upyun.com')
endpoints.set('cmcc', 'v3.api.upyun.com')

function getEndpoint(point) {
  return endpoints.get(point) || 'v0.api.upyun.com'
}

function md5sign(method, path, date, contentLength, operator, password) {
  if (path.includes('?')) {
    path = path.split('?')[0]
  }
  // TODO: need encode - path
  let sign = [method, path, date, contentLength, md5sum(password)].join('&')
  sign = md5sum(sign)

  return `UpYun ${operator}:${sign}`
}

function preSlash(s) {
  if (!s.startsWith('/')) {
    s = '/' + s
  }

  return s
}

/**
 * @param {String|Buffer} file
 * @return {Promise}
 */
function getMd5(file) {
  if (typeof file === 'string') {
    return getHash(fs.createReadStream(file), 'md5')
      .then(buffer => {
        return buffer.toString('hex')
      })
  }

  if (Buffer.isBuffer(file)) {
    return Promise.resolve(md5sum(file))
  }

  return Promise.resolve(undefined)
}

/**
 * @param {String|Buffer} file
 * @return {Promise}
 */
function getSize(file) {
  if (typeof file === 'string') {
    return fs.stat(file)
      .then(data => {
        return data.size
      })
  }

  if (Buffer.isBuffer(file)) {
    return Promise.resolve(file.length)
  }

  return Promise.resolve(undefined)
}

/**
 * @param {String} body
 */
function parseResult(body) {
  let list = body.split('\n')
  list = list.map(item => {
    item = item.split('\t')

    return {
      bucket: item[0],
      type: item[1] === 'F' ? 'file' : 'folder',
      size: item[2],
      modifyTime: item[3]
    }
  })

  return list
}

/**
 * private
 */

function md5sum(data) {
  let encoding = typeof data === 'string' ? 'utf-8' : 'binary'
  return crypto.createHash('md5').update(data, encoding).digest('hex')
}
