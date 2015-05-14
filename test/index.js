'use strict'

let config = require('./config')
let assert = require('assert')
let equal = assert.strictEqual
let path = require('path')
let upyun = require('..')
let yun = upyun(config)

let testfile = '1.png'
let filepath = `testfiles/${Date.now()}-${testfile}`

describe('## upyun', function() {
  describe('# basic', function() {
    it('getUsage()', function() {
      return yun.getUsage()
      .then(function(result) {
        equal(result.status, 200)
        assert(!isNaN(parseInt(result.body)))
      })
    })

    it('putFile()', function() {
      return yun.putFile(path.join(__dirname, testfile), filepath)
      .then(function(result) {
        equal(result.status, 200)
      })
    })

    it('headFile()', function() {
      return yun.headFile(filepath)
      .then(function(result) {
        equal(result.status, 200)
      })
    })

    it('getFile()', function() {
      return yun.getFile(filepath, path.join(__dirname, Date.now() + '.png'))
      .then(function(result) {
        equal(result.status, 200)
      })
    })

    it('listBucket()', function() {
      return yun.listBucket('/')
      .then(function(result) {
        equal(result.status, 200)
        assert(result.body.length > 0)
        result.body.forEach(function(item) {
          assert.deepEqual(Object.keys(item), ['bucket', 'type', 'size', 'modifyTime'])
        })
      })
    })

    it('rmFile()', function() {
      return yun.headFile(filepath)
      .then(function(result) {
        equal(result.status, 200)
      })
    })
  })
})
