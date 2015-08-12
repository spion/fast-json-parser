import {Code} from './code'

const enum ParserState {
    Normal,
    Escaped,
    Unicode,
    Ended
}

export default class StringParser {
    private state  : ParserState;
    private buffer : string;
    private start  : number;
    private end    : number;
    private rest   : string;

    private unicode: number;
    private digitCount: number;

    constructor() {
        this.init('', 0);
    }

    public init(str:string, k:number) {
        this.state  = ParserState.Normal;
        this.buffer = null;
        this.start  = this.end = k;
        this.rest   = null;
    }

    public advance(str:string, k:number) {
        if (this.state === ParserState.Ended) {
            return true;
        }
        if (this.state === ParserState.Normal) {
            this.handleBuffer(str, k);
        }
        this.handleEscape(str, k)
        return false;
    }

    private handleBuffer(str: string, k:number) {
        if (this.buffer !== str) {
            if (this.buffer !== null) {
                if (this.rest === null) {
                    this.rest = this.buffer.substring(this.start)
                }
                else {
                    this.rest += this.buffer.substring(this.start);
                }
            }
            this.buffer = str;
            this.start = k;
        }
        this.end = k;
    }

    private handleEscape(str:string, k:number) {
        var code = str.charCodeAt(k);
        if (this.state === ParserState.Normal) {
            if (code === Code.Quote) {
                this.state = ParserState.Ended
            }
            else if (code === Code.Escape) {
                this.consolidate();
                this.state = ParserState.Escaped;
            }
        } else if (this.state === ParserState.Escaped) {
            if (code === Code.U) {
                this.state = ParserState.Unicode
                this.unicode = 0;
                this.digitCount = 0;
            } else {
                var char = this.translate(code)
                if (char !== null) { // translation found
                    this.rest += char;
                    this.buffer = null;
                } else { // reset as if backslash never existed
                    this.start = k;
                }
                this.state = ParserState.Normal
            }
        } else {
            //TODO handle nondigit case
            this.unicode = this.unicode * 16 + (code - Code.Zero)
            if (++this.digitCount === 4) {
                this.state = ParserState.Normal
                this.rest += String.fromCharCode(this.unicode);
                this.buffer = null;
            }
        }
    }

    private translate(code: number) {
        switch (code) {
            case Code.B: return "\b"
            case Code.F: return "\f"
            case Code.N: return "\n"
            case Code.R: return "\r"
            case Code.T: return "\t"
            default: return null;
        }
    }

    private consolidate() {
        this.rest = this.currentContent();
    }

    private currentContent() {
        if (this.rest === null) {
            return this.buffer.substring(this.start, this.end)
        } else if (this.buffer !== null) {
            return this.rest + this.buffer.substring(this.start, this.end)
        } else {
            return this.rest;
        }
    }

    public value():string {
        return this.currentContent() //JSON.parse(this.currentContent())
    }
}
