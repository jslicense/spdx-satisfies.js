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

process.exit(failed ? 1 : 0)
