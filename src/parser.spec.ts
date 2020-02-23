import * as fc from "fast-check";
import { Parser } from "./parser";

describe("parser", () => {
  it("behaves like JSON.parse", () => {
    fc.assert(
      fc.property(
        fc
          .object({
            maxDepth: 5
          })
          .map(obj => {
            let arr = [];
            let oString = JSON.stringify(obj);
            for (let k = 0; k < oString.length / 5; ++k) {
              arr.push(oString.substr(k * 5, 5));
            }
            return arr;
          }),
        packets => {
          let p = new Parser();
          p.init();
          for (let packet of packets) {
            p.push(packet);
          }
          let v = packets.join("");

          let ourParser = p.value;
          let goodParser = JSON.parse(v);
          expect(ourParser).toEqual(goodParser);
        }
      ),
      {
        numRuns: 1000
      }
    );
  });
});
