```javascript
var assert = require('assert')
var satisfies = require('spdx-satisfies')
```

This package exports a single function of two arguments:

1.  an Object representing an SPDX expression

2.  an Array of Objects, each in the form of a leaf in an SPDX expression data structure

```javascript
assert(
  satisfies(
    {license: 'MIT'},
    [{license: 'MIT'}]
  )
)
```

The schema for SPDX expression data structures is the same returned by [spdx-expression-parse](https://www.npmjs.com/package/spdx-expression-parse).

```javascript
var parse = require('spdx-expression-parse')

assert(satisfies(
  parse('MIT'),
  [parse('ISC'), parse('MIT')]
))

assert(satisfies(
  {license: 'Zlib'},
  [
    {license: 'ISC'},
    {license: 'MIT'},
    {license: 'Zlib'}
  ]
))

assert(!satisfies(
  {license: 'GPL-3.0'},
  [
    {license: 'ISC'},
    {license: 'MIT'}
  ]
))


assert(satisfies(
  {license: 'GPL-2.0'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(satisfies(
  {license: 'GPL-3.0'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(satisfies(
  {license: 'GPL-1.0', plus: true},
  [{license: 'GPL-2.0', plus: true}]
))

assert(!satisfies(
  {license: 'GPL-1.0'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(satisfies(
  {license: 'GPL-2.0-only'},
  [{license: 'GPL-2.0-only'}]
))

assert(satisfies(
  {license: 'GPL-3.0-only'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(!satisfies(
  {license: 'GPL-2.0'},
  [
    {
      license: 'GPL-2.0',
      plus: true,
      exception: 'Bison-exception-2.2'
    }
  ]
))

assert(satisfies(
  {
    license: 'GPL-3.0',
    exception: 'Bison-exception-2.2'
  },
  [
    {
      license: 'GPL-2.0',
      plus: true,
      exception: 'Bison-exception-2.2'
    }
  ]
))

assert(satisfies(
  // (MIT OR GPL-2.0)
  {
    left: {license: 'MIT'},
    conjunction: 'or',
    right: {license: 'GPL-2.0'}
  },
  [
    {license: 'ISC'},
    {license: 'MIT'}
  ]
))

assert(satisfies(
  // ((MIT OR Apache-2.0) AND (ISC OR GPL-2.0))
  {
    left: {
      left: {license: 'MIT'},
      conjunction: 'or',
      right: {license: 'Apache-2.0'}
    },
    conjunction: 'and',
    right: {
      left: {license: 'ISC'},
      conjunction: 'or',
      right: {license: 'GPL-2.0'}
    }
  },
  [
    {license: 'Apache-2.0'},
    {license: 'ISC'}
  ]
))

assert(satisfies(
  // (MIT AND GPL-2.0)
  {
    left: {license: 'MIT'},
    conjunction: 'and',
    right: {license: 'GPL-2.0'}
  },
  [
    {license: 'MIT'},
    {license: 'GPL-2.0'}
  ]
))

assert(!satisfies(
  // (MIT AND GPL-2.0)
  {
    left: {license: 'MIT'},
    conjunction: 'and',
    right: {license: 'GPL-2.0'}
  },
  [
    {license: 'ISC'},
    {license: 'GPL-2.0'}
  ]
))

assert(!satisfies(
  // (MIT AND (GPL-2.0 OR ISC))
  {
    left: {license: 'MIT'},
    conjunction: 'and',
    right: {
      left: {license: 'GPL-2.0'},
      conjunction: 'or',
      right: {license: 'ISC'}
    }
  },
  [{license: 'MIT'}]
))

assert(!satisfies(
  // (MIT OR Apache-2.0) AND (ISC OR GPL-2.0)
  {
    left: {
      left: {license: 'MIT'},
      conjunction: 'or',
      right: {license: 'Apache-2.0'}
    },
    conjunction: 'and',
    right: {
      left: {license: 'ISC'},
      conjunction: 'or',
      right: {license: 'GPL-2.0'}
    }
  },
  [{license: 'MIT'}]
))

assert.throws(function () {
  satisfies('MIT', [parse('MIT')])
}, /first argument/)

assert.throws(function () {
  satisfies({invalid: 'AST'}, [parse('MIT')])
}, /first argument/)

assert.throws(function () {
  satisfies(parse('MIT'), parse('MIT'))
}, /second argument/)

assert.throws(function () {
  satisfies(parse('MIT'), parse('MIT'))
}, /second argument/)

assert.throws(function () {
  satisfies(parse('MIT'), [{invalid: 'leaf'}])
}, /second argument/)
```
