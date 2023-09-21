`satisfies(SPDX license expression, array of approved licenses)`

Approved licenses may be simple license identifiers like `MIT`, plus-ranges like `EPL-2.0+`, or licenses with exceptions like `Apache-2.0 WITH LLVM`.  They may _not_ be compound expressions using `AND` or `OR`.

```javascript
var assert = require('assert')
var satisfies = require('spdx-satisfies')

assert(satisfies('MIT', ['MIT', 'ISC', 'BSD-2-Clause', 'Apache-2.0']))
assert(satisfies('GPL-2.0 OR MIT', ['MIT']))
assert(!satisfies('GPL-2.0 AND MIT', ['MIT']))
assert(satisfies('GPL-3.0', ['GPL-2.0+']))
assert(!satisfies('GPL-1.0', ['GPL-2.0+']))
```
