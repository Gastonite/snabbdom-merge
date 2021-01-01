import mergeView from '.'
import unapply from 'ramda/src/unapply.js'
import pipe from 'ramda/src/pipe.js'
import map from 'ramda/src/map.js'
import reduce from 'ramda/src/reduce.js'
import head from 'ramda/src/head.js'
import tail from 'ramda/src/tail.js'
import converge from 'ramda/src/converge.js'
import apply from 'ramda/src/apply.js'
import { ensureString } from './string.js'





// const removeSlice = (start, length, string) => pipe(
//   remove(start, length),
//   join('')
// )(string)

// export const parseSelector = selector => {

// }

// export const mergeSelectors = (before, after) => {
//   debugger
//   var { 1: tagName = '', 2: sel1 = '', index } = match(
//     /^([a-z]+)(.*)/i,
//     before
//   )

//   sel1 = before
//   if (index !== undefined)
//     sel1 = removeSlice(index, tagName.length, sel1)

//   // eslint-disable-next-line no-redeclare
//   var { 1: id, index } = match(
//     /(#[a-z]+)/i,
//     sel1
//   )
//   if (index !== undefined)
//     sel1 = removeSlice(index, id.length, sel1)


//   // eslint-disable-next-line no-redeclare
//   var { 1: tagName = tagName, 2: sel2 = '', index } = match(
//     /^([a-z]+)(.*)$/i,
//     after
//   )

//   sel2 = after

//   if (index !== undefined)
//     sel2 = removeSlice(index, tagName.length, sel2)

//   // eslint-disable-next-line no-redeclare
//   var { 1: id, index } = match(
//     /(#[a-z]+)/i,
//     sel2
//   )

//   if (index !== undefined)
//     sel2 = removeSlice(index, id.length, sel2)

//   return tagName + concat(
//     sel1,
//     sel2
//   )
// }

export const mergeAllSelectors = unapply(converge(
  reduce(unapply(pipe(
    map(ensureString),
    apply(mergeView)
  ))),
  [
    head,
    tail
  ]
))

export default mergeAllSelectors
// export default () => Array.prototype.slice.call(arguments, 1).reduce(mergeView, arguments[0])
