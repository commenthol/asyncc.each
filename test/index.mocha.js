'use strict'

/* global describe, it */

var assert = require('assert')
var async = require('..')

describe('#each', function () {
  it('can run parallel tasks', function (done) {
    var res = []
    async.each(
      [4, 3, 2, 1],
      function (item, cb) {
        setTimeout(function () {
          res.push(item)
          cb()
        }, item * 3)
      },
      function (err) {
        assert.ok(!err, '' + err)
        assert.deepEqual(res, [ 1, 2, 3, 4 ])
        done()
      }
    )
  })

  it('empty array', function (done) {
    var res = []
    async.each(
      [],
      function (item, cb) {
        res.push(item)
        cb()
      },
      function (err) {
        assert.ok(!err, '' + err)
        assert.deepEqual(res, [])
        done()
      }
    )
  })
})

describe('#eachSeries', function () {
  it('can run serial tasks', function (done) {
    var res = []
    async.eachSeries(
      [4, 3, 2, 1],
      function (item, cb) {
        setTimeout(function () {
          res.push(item)
          cb()
        }, item * 3)
      },
      function (err) {
        assert.ok(!err, '' + err)
        assert.deepEqual(res, [4, 3, 2, 1])
        done()
      }
    )
  })
})

describe('#eachLimit', function () {
  it('can run serial tasks', function (done) {
    var res = []
    async.eachLimit(
      [12, 9, 6, 1],
      2,
      function (item, cb) {
        setTimeout(function () {
          res.push(item)
          cb()
        }, item * 3)
      },
      function (err) {
        assert.ok(!err, '' + err)
        assert.deepEqual(res, [ 9, 12, 1, 6 ])
        done()
      }
    )
  })

  it('eachLimit limit equal size', function (done) {
    var res = []
    async.eachLimit(
      [4, 3, 2, 1],
      4,
      function (item, cb) {
        setTimeout(function () {
          res.push(item)
          cb()
        }, item * 2)
      },
      function (err) {
        assert.ok(!err, '' + err)
        assert.deepEqual(res, [ 1, 2, 3, 4 ])
        done()
      }
    )
  })

  it('eachLimit limit exceeds size', function (done) {
    var res = []
    async.eachLimit(
      [4, 3, 2, 1, 0],
      8,
      function (item, cb) {
        setTimeout(function () {
          res.push(item)
          cb()
        }, item * 2)
      },
      function (err) {
        assert.ok(!err, '' + err)
        assert.deepEqual(res, [ 0, 1, 2, 3, 4 ])
        done()
      }
    )
  })

  it('eachLimit error', function (done) {
    var res = []
    async.eachLimit(
      [4, 3, 2, 1, 0],
      2,
      function (item, cb) {
        if (item === 2) {
          cb('bad')
          return
        }
        setTimeout(function () {
          res.push(item)
          cb()
        }, item * 2)
      },
      function (err) {
        assert.ok(err === 'bad', '' + err)
        assert.deepEqual(res, [ 3 ])
        done()
      }
    )
  })

  it('eachLimit does not continue replenishing after error', function (done) {
    var started = 0

    async.eachLimit(
      [ 4, 3, 2, 1 ],
      2,
      function (item, cb) {
        started++
        if (started === 3) {
          cb('bad')
          return
        }
        setTimeout(function () {
          cb()
        }, 3)
      }, function () {
        assert.equal(started, 3)
        done()
      }
    )
  })
})
