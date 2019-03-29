
var parseSelector = function (selector) {

  if (typeof selector !== 'string')
    selector = '';

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

/**
 * Combine two CSS selectors into one
 */
var mergeSelectors = function (input1, input2) {

  var selector1 = parseSelector(input1);
  var selector2 = parseSelector(input2);

  var classes = selector1.classes
    .concat(selector2.classes)
    .filter(Boolean);

  return (
    (selector2.tag || selector1.tag) +
    (selector2.id || selector1.id) +
    '.' + classes.join('.')
  );
};

module.exports = mergeSelectors;
