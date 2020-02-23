import { NumParser } from "./num-parser";
import { StringParser } from "./string-parser";
import { ConstParser } from "./const-parser";
import { Code } from "./code";
import { Queue } from "./queue";
import { mkErrorMsg } from "./util";

const enum Mode {
  Value = 0,
  Key = 1,
  PrimitiveKey = 2,
  PrimitiveString = 3,
  PrimitiveNumber = 4,
  PrimitiveOther = 5,
  Colon = 6,
  Separator = 7
}

function isWhitespace(code: number) {
  return code === Code.Whitespace || code === Code.Lf || code === Code.Cr;
}

export class Parser {
  private numParser = new NumParser();
  private constParser = new ConstParser();
  private stringParser = new StringParser();
  private mode = Mode.Value;
  private stack: Queue<any> = new Queue<any>(8);
  private keys: Queue<string> = new Queue<any>(4);

  public value: any;

  public init(str?: string, k?: number) {
    this.keys = new Queue<any>(4);
    this.mode = Mode.Value;
    this.stack = new Queue<any>(8);
  }

  static parse(s: string) {
    var p = new Parser();
    p.init();
    p.push(s);
    return p.value;
  }

  static parseStream<T>(stream: { on(event: string, fn: Function): any }) {
    return new Promise<T>((resolve, reject) => {
      let p = new Parser();
      p.init();
      stream.on("data", (data: string) => p.push(data));
      stream.on("end", () => resolve(p.value));
      stream.on("error", reject);
    });
  }

  public push(str: string) {
    if (this.mode === Mode.PrimitiveKey || this.mode === Mode.PrimitiveString) {
      this.stringParser.switchString(str);
    }
    for (var k = 0; k < str.length; ++k) {
      this.advance(str, k);
    }
  }

  public setMode(mode: Mode) {
    this.mode = mode;
  }

  public advance(str: string, k: number) {
    switch (this.mode) {
      case Mode.PrimitiveKey:
        this.parsePrimitiveKeyStr(str, k);
        break;
      case Mode.PrimitiveString:
        this.parsePrimitiveStr(str, k);
        break;
      case Mode.PrimitiveNumber:
        this.parsePrimitiveNum(str, k);
        break;
      case Mode.PrimitiveOther:
        this.parsePrimitiveOther(str, k);
        break;
      case Mode.Value:
        this.parseValue(str, k);
        break;
      case Mode.Separator:
        this.parseSeparator(str, k);
        break;
      case Mode.Key:
        this.parseKey(str, k);
        break;
      case Mode.Colon:
        this.parseColon(str, k);
        break;
    }
  }

  private parseValue(str: string, k: number) {
    var code = str.charCodeAt(k);
    if (code === Code.LBrace) {
      this.open({});
      this.setMode(Mode.Key);
    } else if (code === Code.LBracket) {
      this.open([]);
      this.setMode(Mode.Value);
    } else if ((code >= Code.Zero && code <= Code.Nine) || code === Code.Minus) {
      this.numParser.init(code);
      this.setMode(Mode.PrimitiveNumber);
    } else if (code === Code.T || code === Code.F || code === Code.N) {
      this.constParser.init(code);
      this.setMode(Mode.PrimitiveOther);
    } else if (code === Code.Quote) {
      this.stringParser.init(str, k);
      this.setMode(Mode.PrimitiveString);
    } else if (code === Code.RBracket || code === Code.RBrace) {
      this.close();
    } else if (!isWhitespace(code)) {
      throw new Error(mkErrorMsg(str, k));
    }
  }

  private open(arg: string | {}) {
    if (this.value !== undefined) {
      this.stack.push(this.value);
    }
    this.value = arg;
  }

  private close() {
    if (this.stack.length < 1) return;
    var stackItem = this.stack.pop();
    if (stackItem instanceof Array) {
      stackItem.push(this.value);
    } else {
      var key = this.keys.pop();
      stackItem[key] = this.value;
    }
    this.setMode(Mode.Separator);
    this.value = stackItem;
  }

  private parseKey(str: string, k: number) {
    var code = str.charCodeAt(k);
    if (code === Code.Quote) {
      this.stringParser.init(str, k);
      this.setMode(Mode.PrimitiveKey);
    } else if (!(this.value instanceof Array) && code === Code.RBrace) {
      this.close();
    } else if (!isWhitespace(code)) {
      throw new Error(mkErrorMsg(str, k));
    }
  }

  private parseColon(str: string, k: number) {
    var code = str.charCodeAt(k);
    if (code === Code.Colon) {
      this.setMode(Mode.Value);
    } else if (!isWhitespace(code)) {
      throw new Error(mkErrorMsg(str, k));
    }
  }

  private parseSeparator(str: string, k: number) {
    var code = str.charCodeAt(k);
    var isArray = this.value instanceof Array;
    if (code === Code.Comma) {
      this.setMode(isArray ? Mode.Value : Mode.Key);
    } else if ((isArray && code === Code.RBracket) || (!isArray && code === Code.RBrace)) {
      this.close();
    } else if (!isWhitespace(code)) {
      throw new Error(mkErrorMsg(str, k));
    }
  }

  private parsePrimitiveKeyStr(str: string, k: number) {
    if (this.stringParser.advance(str, k)) {
      var key = this.stringParser.value();
      this.keys.push(key);
      this.setMode(Mode.Colon);
      this.parseColon(str, k);
    }
  }

  private addToContainer(value: any) {
    if (this.value instanceof Array) {
      this.value.push(value);
    } else {
      var key = this.keys.pop();
      this.value[key] = value;
    }
  }

  private parsePrimitiveStr(str: string, k: number) {
    if (this.stringParser.advance(str, k)) {
      this.addToContainer(this.stringParser.value());
      this.setMode(Mode.Separator);
      this.parseSeparator(str, k);
    }
  }

  private parsePrimitiveNum(str: string, k: number) {
    if (this.numParser.advance(str, k)) {
      this.addToContainer(this.numParser.value());
      this.setMode(Mode.Separator);
      this.parseSeparator(str, k);
    }
  }

  private parsePrimitiveOther(str: string, k: number) {
    if (this.constParser.advance(str, k)) {
      this.addToContainer(this.constParser.value());
      this.setMode(Mode.Separator);
      this.parseSeparator(str, k);
    }
  }
}
