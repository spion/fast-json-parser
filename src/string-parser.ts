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
    this.buffer = str;
    this.start = this.end = k + 1;
    this.rest = null;
  }

  public advance(str: string, k: number) {
    switch (this.state) {
      case ParserState.Normal:
        this.parseNormal(str.charCodeAt(k), k);
        return false;
      case ParserState.Ended:
        return true;
      case ParserState.Escaped:
        this.parseEscaped(str.charCodeAt(k), k);
        return false;
      case ParserState.Unicode:
        this.parseUnicode(str.charCodeAt(k), k);
        return false;
    }
  }

  public switchString(str: string) {
    if (this.buffer !== null) {
      let endOfString = this.state === ParserState.Ended ? this.end : this.buffer.length;
      if (this.rest === null) {
        this.rest = this.buffer.substring(this.start, endOfString);
      } else {
        this.rest += this.buffer.substring(this.start, endOfString);
      }
    }
    this.buffer = str;
    this.start = this.end = 0;
  }

  private parseNormal(code: number, k: number) {
    this.end = k;
    if (code === Code.Quote) {
      this.state = ParserState.Ended;
    } else if (code === Code.Escape) {
      this.consolidate();
      this.state = ParserState.Escaped;
    }
  }

  private parseEscaped(code: number, k: number) {
    if (code === Code.U) {
      this.state = ParserState.Unicode;
      this.unicode = 0;
      this.digitCount = 0;
    } else {
      var char = this.translate(code);
      if (char !== null) {
        // translation found
        this.rest += char;
        this.start = k + 1;
      } else {
        // reset as if backslash never existed
        this.start = k;
      }
      this.state = ParserState.Normal;
    }
  }

  private parseUnicode(code: number, k: number) {
    this.unicode = this.unicode * 16 + (code - Code.Zero);
    if (++this.digitCount === 4) {
      this.state = ParserState.Normal;
      this.rest += String.fromCharCode(this.unicode);
      this.start = k + 1;
    }
  }

  private translate(code: number) {
    switch (code) {
      case Code.N:
        return "\n";
      case Code.R:
        return "\r";
      case Code.T:
        return "\t";
      case Code.B:
        return "\b";
      case Code.F:
        return "\f";
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
