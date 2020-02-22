import { Code, Constants } from "./code";

export class ConstParser {
  private pos: number = 0;
  private expect: number[] | null = null;

  public init(code: number) {
    this.pos = 0;
    if (code === Code.T) {
      this.expect = Constants.True;
    } else if (code === Code.F) {
      this.expect = Constants.False;
    } else if (code === Code.N) {
      this.expect = Constants.Null;
    } else {
      throw new Error("Invalid: " + String.fromCharCode(code));
    }
  }

  public advance(str: string, k: number) {
    this.pos += 1;
    if (this.pos >= this.expect!.length) return true;
    if (this.expect![this.pos] !== str.charCodeAt(k)) throw new Error("Invalid: " + str);
    return false;
  }

  public value() {
    return this.expect === Constants.True ? true : this.expect === Constants.False ? false : null;
  }
}
