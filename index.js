var h = require('snabbdom/h').default
var curryN = require('ramda/src/curryN')
var mergeObj = require('ramda/src/merge')
var assoc = require('ramda/src/assoc')
var reduce = require('ramda/src/reduce')
var concat = require('ramda/src/concat')
var mergeWith = require('ramda/src/mergeWith')
var mergeSelectors = require('./merge-selectors')

// Chain multiple event handlers or hook functions together 
var chainFuncs = curryN(4, function (data1, data2, result, key) {
  data1[key] = data1[key] || {}
  data2[key] = data2[key] || {}
  var chainHandlers = function (fn1, fn2) {
    return function () {
      fn1.apply(null, arguments)
      fn2.apply(null, arguments)
    }
  }
  var chained = mergeWith(chainHandlers, data1[key], data2[key])
  return assoc(key, chained, result)
})

// Merge the nested objects referenced by 'key' into 'result'
var mergeKey = curryN(4, function (data1, data2, result, key) {
  return assoc(
    key,
    mergeObj(data1[key], data2[key]),
    result
  )
})



// Merge some data properties, favoring vnode2
var merge = curryN(2, function (vnode1, vnode2) {

  if (typeof vnode1 === 'string' || typeof vnode2 === 'string')
    return vnode2

  var data1 = vnode1 && vnode1.data || {}
  var data2 = vnode2 && vnode2.data || {}

  var merged = reduce(
    mergeKey(data1, data2),
    {},
    ['props', 'class', 'style', 'attrs', 'dataset']
  )

  // Chain all hook and eventlistener functions together
  var chained = reduce(
    chainFuncs(data1, data2),
    merged,
    ['on', 'hook']
  )

  var children = concat(vnode1.children || [], vnode2.children || [])

  return h(
    mergeSelectors(vnode1.sel, vnode2.sel),
    chained,
    children.length > 0
      ? children
      : vnode2.text || vnode1.text
  )
})

module.exports = merge
