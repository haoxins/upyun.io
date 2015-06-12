'use strict'

const request = require('tiny-request')
const mime = require('mime-types')
const assert = require('assert')
const util = require('./util')

class Client {
  constructor(opts) {
    assert(typeof opts === 'object', 'opts required')
    assert(typeof opts.operator === 'string', 'operator required')
    assert(typeof opts.password === 'string', 'password required')
    assert(typeof opts.bucket === 'string', 'bucket required')

    this.bucket = util.preSlash(opts.bucket)
    this.operator = opts.operator
    this.password = opts.password
    this.endpoint = util.getEndpoint(opts.endpoint)
  }

  getUsage() {
    let path = this.bucket + '/?usage'
    return this.doRequest({
      method: 'GET',
      path: path
    })
  }

  /**
   * @param {String} path
   * @param {Object} opts
   *   - opts.path
   *   - opts.limit
   *   - opts.order asc|desc
   *   - opts.iter
   */
  listBucket(path, opts) {
    if (typeof path === 'object') {
      opts = path
      path = ''
    }
    opts = opts || {}
    path = this.bucket + (path || opts.path)

    // TODO: opts
    return this.doRequest({
      method: 'GET',
      path: path
    }).then(function(result) {
      if (result && result.body) {
        try {
          result.body = util.parseResult(String(result.body))
        } catch (e) {console.log(e)}
      }

      return result
    })
  }

  /**
   * @param {String} path
   */
  addBucket() {
    return Promise.reject(new Error('TODO'))
  }

  /**
   * @param {String} path
   */
  rmBucket() {
    return Promise.reject(new Error('TODO'))
  }

  /**
   * @param {String|Stream|Buffer} source
   * @param {String} path
   * @param {Object} opts
   *   opts.type
   *   opts.size
   *   opts.headers
   */
  putFile(source, path, opts) {
    opts = opts || {}
    path = this.bucket + util.preSlash(path)
    let headers = opts.headers || {}

    if (opts.type) {
      headers['Content-Type'] = mime.lookup(opts.type)
    } else if (!headers['Content-Type'] && !headers['content-type']) {
      let type = mime.lookup(path)
      if (type) {
        headers['Content-Type'] = type
      }
    }

    let self = this
    let options = {
      method: 'PUT',
      path: path,
      source: source,
      headers: headers
    }

    return util.getSize(source)
      .then(function(size) {
        options.length = opts.size || size

        if (headers['Content-MD5'] || headers['content-md5']) return

        return util.getMd5(source)
      }).then(function(md5) {
        if (md5) {
          options.headers['Content-MD5'] = md5
        }

        return self.doRequest(options)
      })
  }

  /**
   * @param {String} path
   */
  headFile(path) {
    path = this.bucket + util.preSlash(path)

    return this.doRequest({
      method: 'HEAD',
      path: path
    })
  }

  /**
   * @param {String} path
   * @param {String} dest
   */
  getFile(path, dest) {
    path = this.bucket + util.preSlash(path)

    return this.doRequest({
      method: 'GET',
      path: path,
      dest: dest
    })
  }

  /**
   * @param {String} path
   */
  rmFile(path) {
    path = this.bucket + util.preSlash(path)

    return this.doRequest({
      method: 'DELETE',
      path: path
    })
  }

  /**
   * private
   */

  doRequest(options) {
    let method = options.method
    let path = options.path
    let contentLength = options.length
    let headers = options.headers || {}

    method = method.toUpperCase()

    contentLength = String(contentLength | 0)

    let date = (new Date()).toGMTString()

    headers.Date = date
    headers.Authorization = util.md5sign(method, path, date, contentLength, this.operator, this.password)
    headers.Host = this.endpoint
    headers['Content-Length'] = contentLength

    let opts = {
      hostname: this.endpoint,
      method: method,
      path: path,
      headers: headers
    }
    if (options.dest) {
      opts.dest = options.dest
    }

    if (options.source) {
      opts.source = options.source
    }

    return request(opts)
  }
}

/**
 * exports
 */

module.exports = Client
