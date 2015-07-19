Test whether SPDX expressions satisfy given licensing criteria

```shellsession
npm install --save spdx-satisfies
```

In JavaScript:

<!--js
  var satisfies = require('./');
-->

```js
satisfies('MIT', 'MIT') // => true

satisfies('MIT', '(ISC OR MIT)') // => true
satisfies('Zlib', '(ISC OR (MIT OR Zlib))') // => true
satisfies('GPL-3.0', '(ISC OR MIT)') // => false

satisfies('GPL-2.0', 'GPL-2.0+') // => true
satisfies('GPL-3.0', 'GPL-2.0+') // => true
satisfies('GPL-1.0', 'GPL-2.0+') // => false

satisfies(
  'GPL-2.0',
  'GPL-2.0+ WITH Bison-exception-2.2'
) // => false
satisfies(
  'GPL-3.0 WITH Bison-exception-2.2',
  'GPL-2.0+ WITH Bison-exception-2.2'
) // => true

satisfies('(MIT OR GPL-2.0)', '(ISC OR MIT)') // => true
satisfies('(MIT AND GPL-2.0)', '(MIT OR GPL-2.0)') // => true
satisfies('(MIT AND GPL-2.0)', '(ISC OR GPL-2.0)') // => false
```
