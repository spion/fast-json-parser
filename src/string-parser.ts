
import {Code} from './code'

const enum ParserState {
    Normal,
    Escaped,
    Ended
}

export default class StringParser {
    private state:ParserState;
    private buffer: string;
    private start: number;
    private end: number;
    private rest: string;
    constructor() {
        this.init('', 0);
    }
    public init(str:string, k:number) {
        this.state = ParserState.Escaped;
        this.buffer = str;
        this.start = this.end = k;
        this.rest = null;
        this.advance(str, k)
    }
    public advance(str:string, k:number) {
        if (this.state === ParserState.Ended) {
            return true;
        }
        this.handleBuffer(str)
        this.end = k;
        this.handleEscape(str, k)
        return false;
    }

    private handleEscape(str:string, k:number) {
        if (this.state !== ParserState.Escaped) {
            var code = str.charCodeAt(k);
            if (code === Code.Quote) {
                this.state = ParserState.Ended
            } else if (code === Code.Escape) {
                this.state = ParserState.Escaped;
            }
        } else {
            this.state = ParserState.Normal;
        }
    }
    private handleBuffer(str: string) {
        if (this.buffer !== str) {
            if (this.rest === null) {
                this.rest = this.buffer.substring(this.start)
            } else {
                this.rest += this.buffer;
            }
            this.buffer = str;
        }

    }
    public value():string {
        var s:string;
        if (this.rest === null) {
            s = this.buffer.substring(this.start, this.end + 1)
        } else {
            s = this.rest + this.buffer.substring(0, this.end + 1)
        }
        return JSON.parse(s)
    }
}
