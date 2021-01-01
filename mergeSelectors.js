import isEmpty from 'ramda/src/isEmpty.js'
import match from 'ramda/src/match.js'
import { unapply, converge, reduce, head, tail } from 'ramda'





export const parseSelector = input => {

  if (!input || typeof input !== 'string')
    input = ''

  const matches = match(/#[\w-]+/, input)
  const id = matches && matches[0]

  const selector = (!id ? input : input.replace(id, '')).split('.')

  const classes = isEmpty(selector) ? [] : selector.slice(1)

  return {
    tag: selector[0],
    classes,
    id,
  }
}

/**
 * Combine two CSS selectors into one
 */
export const mergeSelectors = (input1, input2) => {

  const selector1 = parseSelector(input1)
  const selector2 = parseSelector(input2)

  const classes = selector1.classes
    .concat(selector2.classes)
    .filter(Boolean)

  const tag = selector2.tag || selector1.tag
  const id = selector2.id || selector1.id || ''

  return tag + id + (
    isEmpty(classes)
      ? ''
      : '.' + classes.join('.')
  )
}

export const mergeAllSelectors = unapply(converge(
  reduce(mergeSelectors),
  [
    head,
    tail
  ]
))

export default mergeSelectors