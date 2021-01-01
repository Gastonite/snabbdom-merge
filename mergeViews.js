import curryN from 'ramda/src/curryN.js'
import isEmpty from 'ramda/src/isEmpty.js'
import assoc from 'ramda/src/assoc.js'
import reduce from 'ramda/src/reduce.js'
import merge from 'ramda/src/merge.js'
import reject from 'ramda/src/reject.js'
import concat from 'ramda/src/concat.js'
import mergeWith from 'ramda/src/mergeWith.js'
import mergeSelectors from './mergeSelectors.js'
const isString = x => typeof x === 'string'





export const mergeViews = curryN(2, (vnode1, vnode2) => {

  if (typeof vnode1 === 'string' || typeof vnode2 === 'string' || !vnode2)
    return vnode2

  const data1 = vnode1 && vnode1.data || {}
  const data2 = vnode2 && vnode2.data || {}

  const merged = reduce(
    (result, key) => assoc(
      key,
      merge(data1[key], data2[key]),
    )(result),
    merge(data1, data2),
    ['props', 'class', 'style', 'attrs', 'dataset']
  )

  // Chain all hook and eventlistener functions together
  const chained = reduce(
    (result, key) => {

      data1[key] = data1[key] || {}
      data2[key] = data2[key] || {}

      const chainHandlers = (fn1, fn2) => function () {
        fn1.apply(null, arguments)
        fn2.apply(null, arguments)
      }

      const chained = mergeWith(
        chainHandlers,
        data1[key],
        data2[key]
      )

      return assoc(key, chained, result)
    },
    merged,
    ['on', 'hook']
  )

  const children = 'children' in vnode2 && vnode2.children === undefined
    ? []
    : concat(vnode1.children || [], vnode2.children || [])

  const hasChildren = !isEmpty(children)

  const sel = vnode2 && 'sel' in vnode2 && vnode2.sel === undefined
    ? undefined
    : mergeSelectors(vnode1.sel, vnode2.sel) || undefined

  return !sel ? undefined : {
    sel,
    data: reject(isEmpty)(chained),
    children: hasChildren ? children : undefined,
    text: hasChildren ? undefined : isString(vnode2.text)
      ? vnode2.text
      : (isString(vnode1.text)
        ? vnode1.text
        : undefined)
  }
})

export default mergeViews