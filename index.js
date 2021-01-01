export * from './mergeViews.js'
// import curryN from 'ramda/src/curryN'
// import isEmpty from 'ramda/src/isEmpty'
// import assoc from 'ramda/src/assoc'
// import reduce from 'ramda/src/reduce'
// import merge from 'ramda/src/merge'
// import reject from 'ramda/src/reject'
// import concat from 'ramda/src/concat'
// import mergeWith from 'ramda/src/mergeWith'
// import mergeSelectors from './mergeSelectors'
// const isString = x => typeof x === 'string'





// export const mergeViews = curryN(2, (vnode1, vnode2) => {

//   if (typeof vnode1 === 'string' || typeof vnode2 === 'string' || !vnode2)
//     return vnode2

//   var data1 = vnode1 && vnode1.data || {}
//   var data2 = vnode2 && vnode2.data || {}

//   var merged = reduce(
//     (result, key) => assoc(
//       key,
//       merge(data1[key], data2[key]),
//     )(result),
//     merge(data1, data2),
//     ['props', 'class', 'style', 'attrs', 'dataset']
//   )

//   // Chain all hook and eventlistener functions together
//   var chained = reduce(
//     (result, key) => {

//       data1[key] = data1[key] || {}
//       data2[key] = data2[key] || {}

//       var chainHandlers = (fn1, fn2) => function () {
//         fn1.apply(null, arguments)
//         fn2.apply(null, arguments)
//       }

//       var chained = mergeWith(
//         chainHandlers,
//         data1[key],
//         data2[key]
//       )

//       return assoc(key, chained, result)
//     },
//     merged,
//     ['on', 'hook']
//   )

//   var children = 'children' in vnode2 && vnode2.children === undefined
//     ? []
//     : concat(vnode1.children || [], vnode2.children || [])

//   var hasChildren = !isEmpty(children)

//   var sel = vnode2 && 'sel' in vnode2 && vnode2.sel === undefined
//     ? undefined
//     : mergeSelectors(vnode1.sel, vnode2.sel) || undefined

//   return !sel ? undefined : {
//     sel,
//     data: reject(isEmpty)(chained),
//     children: hasChildren ? children : undefined,
//     text: hasChildren ? undefined : isString(vnode2.text)
//       ? vnode2.text
//       : (isString(vnode1.text)
//         ? vnode1.text
//         : undefined)
//   }
// })

// export default mergeViews