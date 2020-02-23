var Parser = require("../lib/parser").Parser;
//var json = JSON.stringify(require("./random.json"));

let json = JSON.stringify(new Array(1000000).fill(0.12312312312312315));

function JSONParse(s) {
  return JSON.parse(s);
}
function fastParserParse(s) {
  return Parser.parse(s);
}
function test(p, sample, n) {
  console.time(p.name);
  for (var k = 0; k < n; ++k) {
    p(sample);
  }
  console.timeEnd(p.name);
}

test(JSONParse, json, 5);
test(fastParserParse, json, 5);
