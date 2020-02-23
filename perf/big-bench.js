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

let parsers = [
  //TODO: add more tests

  testJSONParse,
  testOboe,
  testFastJsonParser
];

async function test() {
  let val = null;
  // Verify stage
  for (let parser of parsers) {
    if (!val) vals = await parser();
    else expect(await parser()).toEqual(val);
  }
  // Warmup stage
  for (let parser of parsers) {
    for (let k = 0; k < 3; ++k) await parser();
  }

  for (let parser of parsers) {
    console.time(parser.name);
    for (let k = 0; k < 10; ++k) await parser();
    console.timeEnd(parser.name);
  }
}

test();
