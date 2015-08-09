import {Code} from './code'

const enum ParserState {
    Normal,
    Escaped,
    Ended
}

export default class StringParser {
    private state  : ParserState;
    private buffer : string;
    private start  : number;
    private end    : number;
    private rest   : string;

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
        this.handleBuffer(str, k)
        this.end = k;
        this.handleEscape(str, k)
        return false;
    }

    private handleBuffer(str: string, k:number) {
        if (this.buffer !== str) {
            if (this.buffer === null) {
            }
            else if (this.rest === null) {
                this.rest = this.buffer.substring(this.start)
            }
            else {
                this.rest += this.buffer.substring(this.start);
            }
            this.buffer = str;
            this.start = k;
        }
    }

    private handleEscape(str:string, k:number) {
        if (this.state !== ParserState.Escaped) {
            var code = str.charCodeAt(k);
            if (code === Code.Quote) {
                this.state = ParserState.Ended
            }
            else if (code === Code.Escape) {
                this.consolidate()
                this.state = ParserState.Escaped;
            }
        }
        else {
            this.state = ParserState.Normal;
        }
    }

    private consolidate() {
        this.rest = this.currentContent();
        this.buffer = null;
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
