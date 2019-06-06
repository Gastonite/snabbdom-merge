var curryN = require('ramda/src/curryN');
var isEmpty = require('ramda/src/isEmpty');
var assoc = require('ramda/src/assoc');
var reduce = require('ramda/src/reduce');
var merge = require('ramda/src/merge');
var reject = require('ramda/src/reject');
var concat = require('ramda/src/concat');
var mergeWith = require('ramda/src/mergeWith');
var mergeSelectors = require('./merge-selectors');
var isString = x => typeof x === 'string';


// Merge two vnodes, favoring vnode2
var mergeVnodes = curryN(2, function (vnode1, vnode2) {

  if (typeof vnode1 === 'string' || typeof vnode2 === 'string')
    return vnode2;

  var data1 = vnode1 && vnode1.data || {};
  var data2 = vnode2 && vnode2.data || {};

  var merged = reduce(
    function (result, key) {

      return assoc(
        key,
        merge(data1[key], data2[key]),
      )(result);
    },
    merge(data1, data2),
    ['props', 'class', 'style', 'attrs', 'dataset']
  );

  // Chain all hook and eventlistener functions together
  var chained = reduce(
    function (result, key) {

      data1[key] = data1[key] || {};
      data2[key] = data2[key] || {};

      var chainHandlers = function (fn1, fn2) {
        return function () {
          fn1.apply(null, arguments);
          fn2.apply(null, arguments);
        };
      };

      var chained = mergeWith(
        chainHandlers,
        data1[key],
        data2[key]
      );

      return assoc(key, chained, result);
    },
    merged,
    ['on', 'hook']
  );

  var children = 'children' in vnode2 & vnode2.children === undefined
    ? []
    : concat(vnode1.children || [], vnode2.children || []);

  var hasChildren = !isEmpty(children);

  return {
    sel: 'sel' in vnode2 && vnode2.sel === undefined
      ? undefined
      : mergeSelectors(vnode1.sel, vnode2.sel) || undefined,
    data: reject(isEmpty)(chained),
    children: hasChildren ? children : undefined,
    text: hasChildren ? undefined : isString(vnode2.text)
      ? vnode2.text
      : (isString(vnode1.text)
        ? vnode1.text
        : undefined)
  };
});

module.exports = mergeVnodes;
