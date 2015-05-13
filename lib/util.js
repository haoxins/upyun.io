'use strict'

let crypto = require('crypto')

/**
 * exports
 */

module.exports = {
  getEndpoint: getEndpoint,
  preSlash: preSlash,
  md5sign: md5sign
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
 * private
 */

function md5sum(data) {
  return crypto.createHash('md5').update(data, 'utf-8').digest('hex')
}
