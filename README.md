# json-parser

Work in progress fast incremental (streaming) JSON parser for node

About 3.3 times slower than buffering a node stream then parsing it with
JSON.parse

Currently works on most valid JSON, however it also accepts invalid JSON.

TODO:

- floating point slow case with large numbers
- moar perf! (buffer based string parser in node?)

TO forbid:

- forbid leading zero in numbers unless followed by dot
- forbid dot at end of number
- forbid comma before end of array and objects

TO test:

- end with unicode escape sequence
- add buffer splitting to fuzzer

# build

Install typescript then simply run `tsc` from the base dir

# bench

Check out the benchmarks in the perf dir

```
$ node perf/big-bench.js
testOboe: 3795.106ms
testJSONParse: 503.485ms
testThisParser: 1658.633ms
```

# license

MIT
