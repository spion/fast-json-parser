//require('source-map-support').install()

import Parser = require('../parser')
import * as fuzz from './fuzz'


function jsonParse(s:string) {
    return JSON.parse(s);
}

function parserParse(s: string) {
    return Parser.parse(s)
}

function test(p:any, sample:any, n:number) {
    console.time(p.name)
    for (var k = 0; k < n; ++k) {
        p(sample)
    }
    console.timeEnd(p.name)
}

var o = ''
while (o.length < 1000 || o.length > 2000) {
    o = JSON.stringify(fuzz.object());
}

test(jsonParse, o, 400000)
test(parserParse, o, 400000)