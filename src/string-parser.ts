import { Code } from "./code";

const enum ParserState {
  Normal,
  Escaped,
  Unicode,
  Ended
}

export class StringParser {
  private state = ParserState.Normal;
  private buffer: string | null = null;
  private start: number = 0;
  private end: number = 0;
  private rest: string | null = null;

  private unicode: number = 0;
  private digitCount: number = 0;

  constructor() {
    this.init("", 0);
  }

  public init(str: string, k: number) {
    this.state = ParserState.Normal;
    this.buffer = null;
    this.start = this.end = k;
    this.rest = null;
  }

  public advance(str: string, k: number) {
    if (this.state === ParserState.Ended) {
      return true;
    }
    var code = str.charCodeAt(k);
    switch (this.state) {
      case ParserState.Normal:
        this.handleBuffer(str, k);
        if (code === Code.Quote) {
          this.state = ParserState.Ended;
        } else if (code === Code.Escape) {
          this.consolidate();
          this.state = ParserState.Escaped;
        }
        break;
      case ParserState.Escaped:
        if (code === Code.U) {
          this.state = ParserState.Unicode;
          this.unicode = 0;
          this.digitCount = 0;
        } else {
          var char = this.translate(code);
          if (char !== null) {
            // translation found
            this.rest += char;
            this.buffer = null;
          } else {
            // reset as if backslash never existed
            this.start = k;
          }
          this.state = ParserState.Normal;
        }
        break;
      case ParserState.Unicode:
        this.unicode = this.unicode * 16 + (code - Code.Zero);
        if (++this.digitCount === 4) {
          this.state = ParserState.Normal;
          this.rest += String.fromCharCode(this.unicode);
          this.buffer = null;
        }
    }
    return false;
  }

  private handleBuffer(str: string, k: number) {
    if (this.buffer !== str) {
      if (this.buffer !== null) {
        if (this.rest === null) {
          this.rest = this.buffer.substring(this.start);
        } else {
          this.rest += this.buffer.substring(this.start);
        }
      }
      this.buffer = str;
      this.start = k;
    }
    this.end = k;
  }

  private translate(code: number) {
    switch (code) {
      case Code.B:
        return "\b";
      case Code.F:
        return "\f";
      case Code.N:
        return "\n";
      case Code.R:
        return "\r";
      case Code.T:
        return "\t";
      default:
        return null;
    }
  }

  private consolidate() {
    this.rest = this.currentContent();
  }

  private currentContent() {
    if (this.rest === null) {
      return this.buffer!.substring(this.start, this.end);
    } else if (this.buffer !== null) {
      return this.rest + this.buffer.substring(this.start, this.end);
    } else {
      return this.rest;
    }
  }

  public value(): string {
    return this.currentContent(); //JSON.parse(this.currentContent())
  }
}
