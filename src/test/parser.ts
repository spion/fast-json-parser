require('source-map-support').install()

import Parser = require('../parser')
import * as assert from 'assert'
import * as fuzz from './fuzz'


var sample = JSON.stringify({
    a: 1,
    b: 2,
    c: {d: 3, e: [{a: 1}, {b: 2}], f: [2,3,4],
        g: null, h: false, i: true},
    d: {e: '100'},
    n: [{a: -123.4}]
});

assert.deepEqual(JSON.parse(sample), Parser.parse(sample));

var Samples = 100;
for (var k = 0; k < Samples; ++k) {
    var rs = JSON.stringify(fuzz.object())
    assert.deepEqual(JSON.parse(rs), Parser.parse(rs));
}

console.log("Tested", Samples, "samples.");