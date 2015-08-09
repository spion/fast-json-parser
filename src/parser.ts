import NumParser    from './num-parser'
import StringParser from './string-parser'
import ConstParser  from './const-parser'
import {Code}       from './code'

const enum Mode {
    Value,
    Key,
    PrimitiveKey,
    PrimitiveString,
    PrimitiveNumber,
    PrimitiveOther,
    Colon,
    Separator
}

function isWhitespace(code:number) {
    return code === Code.Whitespace || code === Code.Lf || code === Code.Cr;
}

class Parser {
    private numParser = new NumParser();
    private constParser = new ConstParser();
    private stringParser = new StringParser();
    private mode = Mode.Value
    private stack: any[] = [];

    private keys:string[] = [];
    private value: any;

    public init(str?: string, k?: number) {
        this.keys = [];
        this.mode = Mode.Value;
        this.stack = [];
    }

    public advance(str: string, k: number) {
        switch (this.mode) {
            case Mode.PrimitiveKey: this.parsePrimitiveKeyStr(str, k); break;
            case Mode.PrimitiveString: this.parsePrimitiveStr(str, k); break;
            case Mode.PrimitiveNumber: this.parsePrimitiveNum(str, k); break;
            case Mode.PrimitiveOther: this.parsePrimitiveOther(str, k); break;
            case Mode.Value: this.parseValue(str, k); break;
            case Mode.Separator: this.parseSeparator(str, k); break;
            case Mode.Key: this.parseKey(str, k); break;
            case Mode.Colon: this.parseColon(str, k); break;
        }
    }

    public push(str:string) {
        for (var k = 0; k < str.length; ++k) {
            this.advance(str, k);
        }
    }

    static parse(s:string) {
        var p = new Parser();
        p.init();
        p.push(s)
        return p.value;
    }

    private open(arg:string|{}) {
        if (this.value !== undefined) {
            this.stack.push(this.value)
        }
        this.value = arg;
    }
    private close() {
        if (this.stack.length < 1) return;
        var stackItem = this.stack.pop();
        if (stackItem instanceof Array) {
            stackItem.push(this.value)
        } else {
            stackItem[this.keys.pop()] = this.value;
        }
        this.value = stackItem;
        this.mode = Mode.Separator
    }


    private parseValue = function(str:string, k:number) {
        var code = str.charCodeAt(k);
        if (code === Code.LBrace) {
            this.open({});
            this.mode = Mode.Key;
        }
        else if (code === Code.LBracket) {
            this.open([])
            this.mode = Mode.Value
        }
        else if ((code >= Code.Zero && code <= Code.Nine) || code === Code.Minus) {
            this.numParser.init(str, k)
            this.mode = Mode.PrimitiveNumber;
        }
        else if (code === Code.T || code === Code.F || code === Code.N) {
            this.constParser.init(code)
            this.mode = Mode.PrimitiveOther
        }
        else if (code === Code.Quote) {
            this.stringParser.init(str, k)
            this.mode = Mode.PrimitiveString;
        }
        else if (code === Code.RBracket || code === Code.RBrace) {
            this.close()
        }
        else if (!isWhitespace(code)) {
            throw new Error("Unexpected " + str[k] + " at: " + k + " : " + str.substring(k - 5, k + 5));
        }
    }
    private parseKey(str:string, k:number) {
        var code = str.charCodeAt(k);
        if (code === Code.Quote) {
            this.stringParser.init(str, k)
            this.mode = Mode.PrimitiveKey;
        }
        else if (!(this.value instanceof Array) && code === Code.RBrace) {
            this.close()
        }
        else if (!isWhitespace(code)) {
            throw new Error("Unexpected " + str[k] + " at: " + k + " : " + str.substring(k - 5, k + 5));
        }
    }
    private parseColon(str:string, k:number) {
        var code = str.charCodeAt(k);
        if (code === Code.Colon) {
            this.mode = Mode.Value;
        }
        else if (!isWhitespace(code)) {
            throw new Error("Unexpected " + str[k] + " at: " + k + " : " + str.substring(k - 5, k + 5));
        }
    }
    private parseSeparator(str:string, k:number) {
        var code = str.charCodeAt(k);
        if (code === Code.Comma) {
            this.mode = Mode.Value;
            if (this.value instanceof Array) {
                this.mode = Mode.Value
            } else {
                this.mode = Mode.Key
            }
        }
        else if ((this.value instanceof Array && code === Code.RBracket)
            || (!(this.value instanceof Array) && code === Code.RBrace)) {
            this.close()
        }
        else if (!isWhitespace(code)) {
            throw new Error("Unexpected " + str[k] + " at: " + k + " : " + str.substring(k - 5, k + 5));
        }
    }


    private parsePrimitiveKeyStr(str:string, k:number) {
        if (this.stringParser.advance(str, k)) {
            this.keys.push(this.stringParser.value());
            this.mode = Mode.Colon;
            this.parseColon(str, k)
        }
    }

    private parsePrimitiveStr(str:string, k:number) {
        if (this.stringParser.advance(str, k)) {
            if ( this.value instanceof Array) {
                this.value.push(this.stringParser.value())
            } else {
                this.value[this.keys.pop()] = this.stringParser.value()
            }
            this.mode = Mode.Separator
            this.parseSeparator(str, k)
        }
    }

    private parsePrimitiveNum(str:string, k:number) {
        if (this.numParser.advance(str, k)) {
            if ( this.value instanceof Array) {
                this.value.push(this.numParser.value())
            } else {
                this.value[this.keys.pop()] = this.numParser.value()
            }
            this.mode = Mode.Separator
            this.parseSeparator(str, k)
        }
    }

    private parsePrimitiveOther(str:string, k:number) {
        if (this.constParser.advance(str, k)) {
            if (this.value instanceof Array) {
                this.value.push(this.constParser.value())
            } else {
                this.value[this.keys.pop()] = this.constParser.value()
            }
            this.mode = Mode.Separator
            this.parseSeparator(str, k)
        }
    }
}

export = Parser
