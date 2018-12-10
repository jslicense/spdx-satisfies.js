'use strict'

/* global it */

var assert = require('assert')
var satisfies = require('..')

it('satisfies equal licenses', function () {
  assert.equal(
    satisfies('MIT', 'MIT'),
    true
  )
})

it('satisfies OR licenses', function () {
  assert.equal(
    satisfies('MIT', 'MIT OR Apache-2.0'),
    true
  )
})

it('does not satisfy AND licenses', function () {
  assert.equal(
    satisfies('MIT', 'MIT AND Apache-2.0'),
    false
  )
})
