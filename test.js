var assert = require('assert')
var examples = require('./examples.json')
var satisfies = require('./')

var failed = false

function write (string) { process.stdout.write(string) }

function label (example) {
  write('satisfies(' + JSON.stringify(example[0]) + ', ' + JSON.stringify(example[1]) + ')')
}

examples.returnTrue.forEach(function (example) {
  label(example)
  try {
    assert(satisfies(example[0], example[1]) === true)
  } catch (error) {
    failed = true
    write(' did not return true\n')
    return
  }
  write(' returned true\n')
})

// False Examples
examples.returnFalse.forEach(function (example) {
  label(example)
  try {
    assert(satisfies(example[0], example[1]) === false)
  } catch (error) {
    failed = true
    write(' did not return false\n')
    return
  }
  write(' returned false\n')
})

// Invalid License Arrays
examples.throwErrors.forEach(function (example) {
  label(example)
  try {
    satisfies(example[0], example[1])
  } catch (error) {
    write(' threw an exception\n')
    return
  }
  failed = true
  write(' did not throw an exception\n')
})

// https://github.com/jslicense/spdx-satisfies.js/issues/20
for (const [spdx, approved] of [
  ['LGPL-2.1', ['LGPL-3.0']],
  ['LGPL-3.0', ['LGPL-2.1']],
  ['AGPL-1.0', ['AGPL-3.0']],
  ['CDDL-1.1', ['CDDL-1.0']],
  ['GPL-2.0', ['GPL-3.0']]
]) {
  write('satisfies(' + JSON.stringify(spdx) + ', ' + JSON.stringify(approved) + ')')
  if (satisfies(spdx, approved)) {
    failed = true
    write(' wrongly returned true\n')
  } else {
    write(' returned false\n')
  }
}

process.exit(failed ? 1 : 0)
