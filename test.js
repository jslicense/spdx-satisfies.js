var assert = require('assert')
var examples = require('./examples.json')
var satisfies = require('./')

var failed = false

function write (string) { process.stdout.write(string) }

function label (expression, approved) {
  write('satisfies(' + JSON.stringify(expression) + ', ' + JSON.stringify(approved) + ')')
}

for (const [expression, approved] of examples.returnTrue) {
  label(expression, approved)
  try {
    assert(satisfies(expression, approved) === true)
  } catch (error) {
    failed = true
    write(' did not return true\n')
    continue
  }
  write(' returned true\n')
}

// False Examples
for (const [expression, approved] of examples.returnFalse) {
  label(expression, approved)
  try {
    assert(satisfies(expression, approved) === false)
  } catch (error) {
    failed = true
    write(' did not return false\n')
    continue
  }
  write(' returned false\n')
}

// Invalid License Arrays
for (const [expression, approved] of examples.throwErrors) {
  label(expression, approved)
  try {
    satisfies(expression, approved)
  } catch (error) {
    write(' threw an exception\n')
    continue
  }
  failed = true
  write(' did not throw an exception\n')
}

process.exit(failed ? 1 : 0)
