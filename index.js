'use strict'


/**
 * @param {Array} arr - An array to iterate over
 * @param {Number} limit - limit the parallel
 * @param {Function} iterator - `iterator(item, callback)`
 * @param {Function} [callback] - `callback(err)`
 */
function eachLimit (arr, limit, iterator, callback) {
  var i = 0
  var fin = arr.length

  function cb (err) {
    fin--
    if (err || fin <= 0) {
      if (!cb.lock) {
        cb.lock = true
        callback && callback(err)
      }
    } else {
      run()
    }
  }

  function run () {
    var item
    if (i < arr.length) {
      item = arr[i++];
      iterator(item, cb)
    }
  }

  if (arr.length === 0) {
    cb()
    return
  }

  limit = (limit > arr.length ? arr.length : limit)
  while (limit > 0) {
    limit--
    run()
  }
}
exports.eachLimit = eachLimit

/**
 * @param {Array} arr - An array to iterate over
 * @param {Number} limit - limit the parallel
 * @param {Function} [callback] - `callback(err)`
 */
function each (arr, iterator, callback) {
  eachLimit(arr, arr.length, iterator, callback)
}
exports.each = each

/**
 * @param {Array} arr - An array to iterate over
 * @param {Function} iterator - `iterator(item, callback)`
 * @param {Function} [callback] - `callback(err)`
 */
function eachSeries (arr, iterator, callback) {
  eachLimit(arr, 1, iterator, callback)
}
exports.eachSeries = eachSeries
