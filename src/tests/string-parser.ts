import "source-map-support";

import { StringParser } from "../string-parser";
import { test } from "./test-subparser";
//@ts-ignore
import assert = require("assert");

var sp = new StringParser();

assert.equal(test(['"hello\\"\\\\world"'], sp), 'hello"\\world');

assert.equal(test(['"hello\\"', '\\\\world"'], sp), 'hello"\\world');

assert.equal(test(['"hello\\"\\\\w', 'orld"'], sp), 'hello"\\world');
