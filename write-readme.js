var examples = require('./examples.json')
function write (string) { process.stdout.write(string + '\n') }

write('`satisfies(SPDX license expression, array of approved licenses)`')
write('')

write('Approved licenses may be simple license identifiers like `MIT`, plus-ranges like `EPL-2.0+`, or licenses with exceptions like `Apache-2.0 WITH LLVM`.  They may _not_ be compound expressions using `AND` or `OR`.')
write('')

write('```javascript')
write("var assert = require('assert')")
write("var satisfies = require('spdx-satisfies')")
write('')

write('// True Examples')
write('for (const [spdxExpression, arrayOfApproved] of [')
write(examples.returnTrue.map(function (e) { return '  ' + JSON.stringify(e) }).join(',\n'))
write(']) assert(satisfies(spdxExpression, arrayOfApproved))')
write('')

write('// False Examples')
write('for (const [spdxExpression, arrayOfApproved] of [')
write(examples.returnFalse.map(function (e) { return '  ' + JSON.stringify(e) }).join(',\n'))
write(']) assert(!satisfies(spdxExpression, arrayOfApproved))')
write('')

write('// Exceptions')
write('for (const [spdxExpression, arrayOfApproved] of [')
write(examples.throwErrors.map(function (e) { return '  ' + JSON.stringify(e) }).join(',\n'))
write(']) assert.throws(function () { satisfies(spdxExpression, arrayOfApproved) })')
write('```')
