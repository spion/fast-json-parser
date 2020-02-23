var Parser = require("../lib/parser").Parser;
var fs = require("fs");
var through = require("through2");
var oboe = require("oboe");

function stream() {
  return fs.createReadStream(__dirname + "/file.json", { encoding: "utf8" });
}

var d = "";
var s = stream();

function testJSONParse() {
  return new Promise(resolve => {
    let s = stream();
    let d = "";
    s.on("data", function(data) {
      if (data != null) d += data.toString();
    }).on("end", function() {
      resolve(JSON.parse(d));
    });
  });
}

function testOboe() {
  return new Promise(resolve => {
    oboe(stream()).done(resolve);
  });
}

function testFastJsonParser() {
  return Parser.parseStream(stream());
}

function testBaseline() {
  return new Promise(resolve => {
    let s = stream();
    let p = [];
    s.on("data", function(data) {
      p.push(data);
    }).on("end", function() {
      resolve(p);
    });
  });
}

let parsers = [
  //TODO: add more tests

  testJSONParse,
  testOboe,
  testFastJsonParser,
  testBaseline
];

async function test() {
  for (let parser of parsers) {
    console.time(parser.name);
    for (let k = 0; k < 10; ++k) await parser();
    console.timeEnd(parser.name);
  }
}

test();
