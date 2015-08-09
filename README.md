# json-parser

Work in progress fast incremental (streaming) JSON parser for node

About 3.5 times slower than buffering a node stream then parsing it with
JSON.parse

Currently works on most valid JSON, however it also accepts invalid JSON
and is unable to handle unicode escape sequences in strings.

# build

Install typescript then simply run `tsc` from the base dir

# bench

Check out the benchmarks in the perf dir

    $ node perf/big-bench.js
    JSON.parse : 163ms
    json-parser: 584ms
    oboe       : 888ms

# license

MIT
