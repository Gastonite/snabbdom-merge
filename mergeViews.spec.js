import { h } from 'snabbdom/h'
import mergeViews from './mergeViews.js'
import test from 'ava'





test('it merges props', t => {

  t.like(
    mergeViews(
      h('input', { props: { name: 'x', type: 'number' } }),
      h('input', { props: { name: 'y', type: 'text' } })
    ),
    h('input', { props: { name: 'y', type: 'text' } })
  )
})

test('it merges selectors', t => {

  t.like(
    mergeViews(
      h('span.x.y'),
      h('span.z')
    ),
    h('span.x.y.z')
  )

  t.like(
    mergeViews(
      h('span'),
      h('span.x')
    ),
    h('span.x')
  )
})

test('it composes eventlisteners', t => {

  let count = 1
  const incr = function () { ++count }
  const vnode1 = h('button', { on: { click: incr } })
  const vnode2 = h('button', { on: { click: incr } })

  const merged = mergeViews(vnode1, vnode2)


  merged.data.on.click()

  t.is(count, 3)
})

test('it composes hooks', t => {

  const incr = function (vnode) { vnode.data.attrs['data-count'] += 1 }
  const vnode1 = h('button', { hook: { insert: incr, update: incr }, attrs: { 'data-count': 1 } })
  const vnode2 = h('button', { hook: { insert: incr } })
  const merged = mergeViews(vnode1, vnode2)

  merged.data.hook.insert(merged)

  t.is(merged.data.attrs['data-count'], 3)
})

test('it appends and prepends children', t => {

  const children = [
    h('span', 'x'),
    h('span', 'y'),
    h('span', 'z')
  ]

  const merged = mergeViews(
    h('p', [
      children[0]
    ]),
    h('p', [
      children[1],
      children[2]
    ]),
  )

  t.deepEqual(merged.children, children)
})

test('text win over children', t => {

  const merged = mergeViews(
    h('p', [
      h('span', 'x'),
      h('span', 'y'),
      h('span', 'z')
    ]),
    h('p', 'hello'),
  )

  t.deepEqual(merged, {
    sel: 'p',
    data: {},
    children: undefined,
    text: 'hello'
  })
})


test('text property win over children property', t => {

  t.like(
    mergeViews(
      h('p', [
        h('span', 'x'),
        h('span', 'y'),
        h('span', 'z')
      ]),
      h('p', 'hello')
    ),
    h('p', 'hello')
  )
})


test('text vnode win over element vnode', t => {

  t.is(
    mergeViews(
      h('p', [
        h('span', 'x'),
        h('span', 'y'),
        h('span', 'z')
      ]),
      'hello'
    ),
    'hello'
  )
})
