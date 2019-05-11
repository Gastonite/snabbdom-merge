var isEmpty = require('ramda/src/isEmpty');
var match = require('ramda/src/match');

var parseSelector = function (input) {

  if (!input || typeof input !== 'string')
    input = '';

  var matches = match(/#[\w-]+/, input);
  var id = matches && matches[0];

  var selector = (!id ? input : input.replace(id, '')).split('.');

  var classes = isEmpty(selector) ? [] : selector.slice(1);

  return {
    tag: selector[0],
    classes,
    id,
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

  var tag = selector2.tag || selector1.tag;
  var id = selector2.id || selector1.id || '';

  return tag + id + (
    isEmpty(classes)
      ? ''
      : '.' + classes.join('.')
  );
};

module.exports = mergeSelectors;
