var h = require('snabbdom/h').default;
var curryN = require('ramda/src/curryN');
var mergeObj = require('ramda/src/merge');
var assoc = require('ramda/src/assoc');
var reduce = require('ramda/src/reduce');
var concat = require('ramda/src/concat');
var mergeWith = require('ramda/src/mergeWith');

// Chain multiple event handlers or hook functions together 
var chainFuncs = curryN(4, function (data1, data2, result, key) {
  data1[key] = data1[key] || {};
  data2[key] = data2[key] || {};
  var chainHandlers = function (fn1, fn2) {
    return function () {
      fn1.apply(null, arguments);
      fn2.apply(null, arguments);
    };
  };
  var chained = mergeWith(chainHandlers, data1[key], data2[key]);
  return assoc(key, chained, result);
});

// Merge the nested objects referenced by 'key' into 'result'
var mergeKey = curryN(4, function (data1, data2, result, key) {
  return assoc(
    key,
    mergeObj(
      data1[key],
      data2[key]
    ),
    result
  );
});


var parseSelector = function (selector) {

  var matches = selector.match(/\#[\w-]+/, ''); // eslint-disable-line no-useless-escape
  var id = matches && matches[0] || '';
  selector = (!id ? selector : selector.replace(id, '')).split('.');

  return {
    tag: selector[0],
    classes: selector.slice(1),
    id,
    selector
  };
};

var mergeSelectors = function (selector1, selector2) {

  var vnode1Sel = parseSelector(selector1);
  var vnode2Sel = parseSelector(selector2);

  var classes = ['']
    .concat(vnode1Sel.classes)
    .concat(vnode2Sel.classes);

  return vnode2Sel.tag + vnode2Sel.id + classes.join('.');
};

// Merge some data properties, favoring vnode2
// Chain all hook and eventlistener functions together
// Concat selectors together
var mergeVnodes = curryN(2, function (vnode1, vnode2) {

  var merged = reduce(
    mergeKey(vnode1.data, vnode2.data),
    {},
    ['props', 'class', 'style', 'attrs', 'dataset']
  );

  var chained = reduce(
    chainFuncs(vnode1.data, vnode2.data),
    merged,
    ['on', 'hook']
  );

  var children = concat(vnode1.children || [], vnode2.children || []);

  return h(
    mergeSelectors(vnode1.sel, vnode2.sel),
    chained,
    children
  );
});

module.exports = mergeVnodes;
