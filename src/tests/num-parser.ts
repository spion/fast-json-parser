import "source-map-support";

import { NumParser } from "../num-parser";

//@ts-ignore
import assert = require("assert");

function test(data: string[], np: NumParser, defaultStart = 0) {
  np.init(data[0].charCodeAt(0));
  for (var i = 0; i < data.length; ++i) {
    var str = data[i];
    var start = i == 0 ? defaultStart + 1 : 0;
    for (var j = start; j < str.length; ++j) {
      if (np.advance(str, j)) {
        return np.value();
      }
    }
  }
  return np.value();
}

var np = new NumParser();
assert.equal(test(["-12.34"], np), -12.34);

assert.equal(test(["-12", ".34"], np), -12.34);
assert.equal(test(["-12", ".34", "5"], np), -12.345);

assert.equal(test(["1,"], np), 1);

//assert.equal(test(['-12','.34.5-'], np), -12.345)
