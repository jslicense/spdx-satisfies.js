var examples = require('./examples.json')
var satisfies = require('./')
var tape = require('tape')

function label(expression, approved) {
  return JSON.stringify(expression) + ', ' + JSON.stringify(approved)
}

for (const [expression, approved] of examples.returnTrue) {
  tape.test(label(expression, approved), t => {
    t.assert(satisfies(expression, approved), 'returns true')
    t.end()
  })
}

// False Examples
for (const [expression, approved] of examples.returnFalse) {
  tape.test(label(expression, approved), t => {
    t.assert(!satisfies(expression, approved))
    t.end()
  })
}

// Invalid License Arrays
for (const [expression, approved] of examples.throwErrors) {
  tape.test(label(expression, approved), t => {
    t.throws(() => satisfies(expression, approved))
    t.end()
  })
}
