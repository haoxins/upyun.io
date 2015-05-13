'use strict'

let config = require('./config')
let assert = require('assert')
let equal = assert.deepEqual
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

    it('listBucket()', function() {
      return yun.listBucket('/')
      .then(function(result) {
        equal(result.status, 200)
        // console.log(result.body)
      })
    })

    it('putFile()', function() {
      return yun.putFile(path.join(__dirname, testfile), filepath)
      .then(function(result) {
        equal(result.status, 200)
        // console.log(result)
      })
    })

    it('headFile()', function() {
      return yun.headFile(filepath)
      .then(function(result) {
        equal(result.status, 200)
        // console.log(result)
      })
    })

    it('rmFile()', function() {
      return yun.headFile(filepath)
      .then(function(result) {
        equal(result.status, 200)
        // console.log(result)
      })
    })
  })
})
