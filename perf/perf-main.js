var Parser = require('../lib/parser');
var fuzz = require('../lib/test/fuzz');

function jsonParse(s) {
    return JSON.parse(s);
}
function parserParse(s) {
    return Parser.parse(s);
}
function test(p, sample, n) {
    console.time(p.name);
    for (var k = 0; k < n; ++k) {
        p(sample);
    }
    console.timeEnd(p.name);
}
var o = '';
while (o.length < 1000 || o.length > 2000) {
    o = JSON.stringify(fuzz.object());
}
test(jsonParse, o, 400000);
test(parserParse, o, 400000);