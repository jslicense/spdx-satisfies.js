var compare = require('spdx-compare')
var parse = require('spdx-expression-parse')
var ranges = require('spdx-ranges')

var rangesAreCompatible = function (first, second) {
  return (
    first.license === second.license ||
    ranges.some(function (range) {
      return (
        licenseInRange(first.license, range) &&
        licenseInRange(second.license, range)
      )
    })
  )
}

function licenseInRange (license, range) {
  return (
    range.indexOf(license) !== -1 ||
    range.some(function (element) {
      return (
        Array.isArray(element) &&
        element.indexOf(license) !== -1
      )
    })
  )
}

var identifierInRange = function (identifier, range) {
  return (
    identifier.license === range.license ||
    compare.gt(identifier.license, range.license) ||
    compare.eq(identifier.license, range.license)
  )
}

var licensesAreCompatible = function (first, second) {
  if (first.exception !== second.exception) {
    return false
  } else if (second.hasOwnProperty('license')) {
    if (second.hasOwnProperty('plus')) {
      if (first.hasOwnProperty('plus')) {
        // first+, second+
        return rangesAreCompatible(first, second)
      } else {
        // first, second+
        return identifierInRange(first, second)
      }
    } else {
      if (first.hasOwnProperty('plus')) {
        // first+, second
        return identifierInRange(second, first)
      } else {
        // first, second
        return first.license === second.license
      }
    }
  }
}

function normalizeGPLIdentifiers (argument) {
  var license = argument.license
  if (license) {
    if (endsWith(license, '-or-later')) {
      argument.license = license.replace('-or-later', '')
      argument.plus = true
    } else if (endsWith(license, '-only')) {
      argument.license = license.replace('-only', '')
      delete argument.plus
    }
  } else if (argument.left && argument.right) {
    argument.left = normalizeGPLIdentifiers(argument.left)
    argument.right = normalizeGPLIdentifiers(argument.right)
  }
  return argument
}

function endsWith (string, substring) {
  return string.indexOf(substring) === string.length - substring.length
}

function licenseString (e) {
  if (e.hasOwnProperty('noassertion')) return 'NOASSERTION'
  if (e.license) return `${e.license}${e.plus ? '+' : ''}${e.exception ? ` WITH ${e.exception}` : ''}`
}

// Expand the given expression into an equivalent array where each member is an array of licenses AND'd
// together and the members are OR'd together. For example, `(MIT OR ISC) AND GPL-3.0` expands to
// `[[GPL-3.0 AND MIT], [ISC AND MIT]]`. Note that within each array of licenses, the entries are
// normalized (sorted) by license name.
function expand (expression) {
  return sort(expandInner(expression))
}

function expandInner (expression) {
  if (!expression.conjunction) return [{ [licenseString(expression)]: expression }]
  if (expression.conjunction === 'or') return expandInner(expression.left).concat(expandInner(expression.right))
  if (expression.conjunction === 'and') {
    var left = expandInner(expression.left)
    var right = expandInner(expression.right)
    return left.reduce(function (result, l) {
      right.forEach(function (r) { result.push(Object.assign({}, l, r)) })
      return result
    }, [])
  }
}

function sort (licenseList) {
  var sortedLicenseLists = licenseList
    .filter(function (e) { return Object.keys(e).length })
    .map(function (e) { return Object.keys(e).sort() })
  return sortedLicenseLists.map(function (list, i) {
    return list.map(function (license) { return licenseList[i][license] })
  })
}

/**
 * Checks if all the licenses on the first argument are satisfied by any license on the second argument.
 * @param {object[]} one - Source licenses.
 * @param {object[]} two - Target licenses.
 * @return {boolean} - Whether all the licenses on the first argument are satisfied by the target licenses.
 */
function isExpressionCompatible (one, two) {
  if (one.length !== two.length) return false
  return one.every(function (o) {
    return two.some(function (t) { return licensesAreCompatible(o, t) })
  })
}

/**
 * Checks whether any group of licenses satisfies any target group of licenses.
 * e.g. [[MIT], [GPL-1.0+, Apache-2.0]] checked against
 * [[ISC, GPL-2.0], [GPL-2.0, Apache-2.0]] will return true.
 * @param {(object[])[]} one - Groups of licenses to be checked.
 * @param {(object[])[]} two - Target groups of licenses.
 * @return {boolean} - Whether any group of licenses in "one" satisfies any group of licenses of the "two" (the target).
 */
function anyExpressionCompatible (one, two) {
  return one.some(function (o) {
    return two.some(function (t) {
      return isExpressionCompatible(o, t)
    })
  })
}

/**
 * Check if "first" satisfies "second".
 * @param {string} first - A valid SPDX expression.
 * @param {string|string[]} second - A string with a SPDX expression or a list of licenses.
 * @return {boolean} - Whether "first" satisfies "second".
 */
function satisfies (first, second) {
  var one = expand(normalizeGPLIdentifiers(parse(first)))
  var two
  if (Array.isArray(second)) {
    two = second.map(l => normalizeGPLIdentifiers(parse(l)))
    if (two.some(l => !!l.conjunction)) throw new Error('AND and OR operator are not allowed')
    two = two.map(l => [l])
  } else {
    two = expand(normalizeGPLIdentifiers(parse(second)))
  }
  return anyExpressionCompatible(one, two)
}

module.exports = satisfies
