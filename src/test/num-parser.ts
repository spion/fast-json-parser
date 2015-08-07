import 'source-map-support'

import NumParser from '../num-parser'
import {test} from './test-subparser'
import assert = require('assert')

var np = new NumParser()
assert.equal(test(['-12.34'], np), -12.34)

assert.equal(test(['-12','.34'], np), -12.34)
assert.equal(test(['-12','.34','5'], np), -12.345)

assert.equal(test(['1,'], np), 1)

//assert.equal(test(['-12','.34.5-'], np), -12.345)

