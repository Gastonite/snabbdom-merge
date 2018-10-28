
var parseSelector = function (selector) {

  var matches = selector.match(/\#[\w-]+/, '')
  var id = matches && matches[0] || ''
  var selector = (!id ? selector : selector.replace(id, '')).split('.')

  return {
    tag: selector[0],
    classes: selector.slice(1),
    id,
    selector
  }
}

/**
 * Combine two CSS selectors into one
 */
var mergeSelectors = function (selector1, selector2) {

  var vnode1Sel = parseSelector(selector1)
  var vnode2Sel = parseSelector(selector2)

  var classes = ['']
    .concat(vnode1Sel.classes)
    .concat(vnode2Sel.classes)

  return vnode2Sel.tag + vnode2Sel.id + classes.join('.')
}


module.exports = mergeSelectors
