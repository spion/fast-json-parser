require('source-map-support').install()

import Parser = require('../parser')
import assert = require('assert')
import * as fuzz from './fuzz'


var Samples = 100;
for (var k = 0; k < Samples; ++k) {
    var rs = JSON.stringify(fuzz.object())
    assert.deepEqual(JSON.parse(rs), Parser.parse(rs));
}

console.log("Tested", Samples, "samples.");