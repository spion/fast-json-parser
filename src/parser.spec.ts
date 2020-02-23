import * as fc from "fast-check";
import { Parser } from "./parser";

describe("parser", () => {
  it("behaves like JSON.parse", () => {
    fc.assert(
      fc.property(
        fc.object({
          maxDepth: 5
        }),
        o => {
          let oString = JSON.stringify(o, null, 2);
          let ourParser = Parser.parse(oString);
          let goodParser = JSON.parse(oString);
          expect(ourParser).toEqual(goodParser);
        }
      ),
      {
        numRuns: 1000
      }
    );
  });
});
