var Parser = require("../lib/parser").Parser;
var json = JSON.stringify(require("./random.json"));

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

test(jsonParse, json, 20000);
test(parserParse, json, 20000);
