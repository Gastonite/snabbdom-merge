
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
var mergeSelectors = function (input1, input2) {

  var selector1 = parseSelector(input1)
  var selector2 = parseSelector(input2)

  console.log('mergeSelectors()', {
    selector1,
    selector2
  })

  var classes = ['']
    .concat(selector1.classes)
    .concat(selector2.classes)

  return (selector2.tag || selector1.tag) + selector2.id + classes.join('.')
}

module.exports = mergeSelectors
