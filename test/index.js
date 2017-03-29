
'use strict'

const config = require('./config')
const assert = require('assert')
const equal = assert.strictEqual
const path = require('path')
const upyun = require('..')
const yun = upyun(config)
const fs = require('fs')

const testfile = '1.png'
const filepath = `testfiles/${Date.now()}-${testfile}`

describe('## upyun', () => {
  describe('# basic', () => {
    it('getUsage()', async () => {
      const result = await yun.getUsage()
      equal(result.status, 200)
      assert(!isNaN(parseInt(result.body)))
    })

    it('putFile() - file path', async () => {
      const result = await yun.putFile(path.join(__dirname, testfile), filepath)
      equal(result.status, 200)
    })

    it('headFile()', async () => {
      const result = await yun.headFile(filepath)
      equal(result.status, 200)
    })

    it('getFile()', async () => {
      const result = await yun.getFile(filepath, path.join(__dirname, Date.now() + '.png'))
      equal(result.status, 200)
    })

    it('listBucket()', async () => {
      const result = await yun.listBucket('/')
      equal(result.status, 200)
      assert(result.body.length > 0)
      result.body.forEach(item => {
        assert.deepEqual(Object.keys(item), ['bucket', 'type', 'size', 'modifyTime'])
      })
    })

    it('rmFile()', async () => {
      const result = await yun.headFile(filepath)
      equal(result.status, 200)
    })
  })

  describe('putFile() stream', () => {
    const filepath2 = filepath.replace('.png', '.2.png')

    it('putFile()', async () => {
      const size = fs.statSync(path.join(__dirname, testfile)).size

      const result = await yun.putFile(fs.createReadStream(path.join(__dirname, testfile)), filepath2, {
        size
      })
      equal(result.status, 200)
    })

    it('getFile()', async () => {
      const result = await yun.getFile(filepath2, path.join(__dirname, Date.now() + '.2.png'))
      equal(result.status, 200)
    })

    it('rmFile()', async () => {
      const result = await yun.headFile(filepath2)
      equal(result.status, 200)
    })
  })

  describe('putFile() buffer', () => {
    const filepath3 = filepath.replace('.png', '.3.png')

    it('putFile()', async () => {
      const filedata = fs.readFileSync(path.join(__dirname, testfile))

      const result = await yun.putFile(filedata, filepath3)
      equal(result.status, 200)
    })

    it('getFile()', async () => {
      const result = await yun.getFile(filepath3, path.join(__dirname, Date.now() + '.3.png'))
      equal(result.status, 200)
    })

    it('rmFile()', async () => {
      const result = await yun.headFile(filepath3)
      equal(result.status, 200)
    })
  })
})
