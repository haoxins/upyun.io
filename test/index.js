
'use strict'

const config = require('./config')
const assert = require('assert')
const equal = assert.strictEqual
const path = require('path')
const upyun = require('..')
const yun = upyun(config)
const fs = require('fs')

let testfile = '1.png'
let filepath = `testfiles/${Date.now()}-${testfile}`

describe('## upyun', () => {
  describe('# basic', () => {
    it('getUsage()', () => {
      return yun.getUsage()
      .then(result => {
        equal(result.status, 200)
        assert(!isNaN(parseInt(result.body)))
      })
    })

    it('putFile() - file path', () => {
      return yun.putFile(path.join(__dirname, testfile), filepath)
      .then(result => {
        equal(result.status, 200)
      })
    })

    it('headFile()', () => {
      return yun.headFile(filepath)
      .then(function(result) {
        equal(result.status, 200)
      })
    })

    it('getFile()', () => {
      return yun.getFile(filepath, path.join(__dirname, Date.now() + '.png'))
      .then(result => {
        equal(result.status, 200)
      })
    })

    it('listBucket()', () => {
      return yun.listBucket('/')
      .then(result => {
        equal(result.status, 200)
        assert(result.body.length > 0)
        result.body.forEach(item => {
          assert.deepEqual(Object.keys(item), ['bucket', 'type', 'size', 'modifyTime'])
        })
      })
    })

    it('rmFile()', () => {
      return yun.headFile(filepath)
      .then(result => {
        equal(result.status, 200)
      })
    })
  })

  describe('putFile() stream', () => {
    let filepath2 = filepath.replace('.png', '.2.png')

    it('putFile()', () => {
      let size = fs.statSync(path.join(__dirname, testfile)).size

      return yun.putFile(fs.createReadStream(path.join(__dirname, testfile)), filepath2, {
        size: size
      })
      .then(result => {
        equal(result.status, 200)
      })
    })

    it('getFile()', () => {
      return yun.getFile(filepath2, path.join(__dirname, Date.now() + '.2.png'))
      .then(result => {
        equal(result.status, 200)
      })
    })

    it('rmFile()', () => {
      return yun.headFile(filepath2)
      .then(result => {
        equal(result.status, 200)
      })
    })
  })

  describe('putFile() buffer', () => {
    let filepath3 = filepath.replace('.png', '.3.png')

    it('putFile()', () => {
      let filedata = fs.readFileSync(path.join(__dirname, testfile))

      return yun.putFile(filedata, filepath3)
      .then(result => {
        equal(result.status, 200)
      })
    })

    it('getFile()', () => {
      return yun.getFile(filepath3, path.join(__dirname, Date.now() + '.3.png'))
      .then(result => {
        equal(result.status, 200)
      })
    })

    it('rmFile()', () => {
      return yun.headFile(filepath3)
      .then(result => {
        equal(result.status, 200)
      })
    })
  })
})
