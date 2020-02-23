# fast-json-parser

Fast incremental (streaming) JSON parser for node

## performance

At the moment, its about 2.5 times slower than buffering a node stream then parsing it with `JSON.parse`

However, its about 2.5 times faster than oboe.js as well.

Currently works on valid JSON, however it also accepts invalid JSON.

Check out the benchmarks in the perf dir

```
$ node perf/big-bench.js
testJSONParse: 1026.993ms
testOboe: 7270.818ms
testFastJsonParser: 2626.062ms
```

## usage example

A static convenience method is available for node streams:

```typescript
import { Parser } from "incremental-json-parser";

async function test() {
  let result = await Parser.parseStream(stream);
  console.log(result);
}
```

Or you can use the raw API:

```typescript
import { Parser } from "incremental-json-parser";

function parseStream(stream) {
  return new Promise(resolve => {
    let p = new Parser();
    p.init();
    stream.on("data", data => p.push(data))
    stream.on("end", () => resolve(p.value));
  });
}
```

## build

Install typescript then simply run `tsc` from the base dir

## todo

- moar perf! (buffer based string parser in node?)

forbid:

- forbid leading zero in numbers unless followed by dot
- forbid dot at end of number
- forbid comma before end of array and objects

test:

- end with unicode escape sequence
- add buffer splitting to fuzzer

# license

MIT
