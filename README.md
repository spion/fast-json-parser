# json-parser

Work in progress fast incremental (streaming) JSON parser for node

About 4 times slower than buffering a node stream then parsing it with
JSON.parse

Currently works on all valid JSON, however it also accepts invalid JSON

# build

Install typescript then simply run `tsc` from the base dir

# bench

Check out the benchmarks in the perf dir

    node perf/big-bench.js

# license

MIT
