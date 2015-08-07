import {Code} from './code'

export default class NumParser {
    private buffer  : string;
    private start   : number;
    private end     : number;
    private rest    : string

    constructor() {
        this.init('', 0)
    }

    init(str:string, k:number) {
        this.buffer = str;
        this.start = this.end = k;
        this.rest = null;
    }

    public advance(str:string, k:number) {
        var code = str.charCodeAt(k);
        var isNum = (code >= Code.Zero && code <= Code.Nine || code === Code.Dot);
        if (!isNum) { return true; }
        this.handleBuffer(str);
        this.end = k;
        return false;
    }

    private handleBuffer(str:string) {
        if (this.buffer !== str) {
            if (this.rest === null) {
                this.rest = this.buffer.substring(this.start)
            } else {
                this.rest += this.buffer;
            }
            this.buffer = str;
        }
    }

    public value() {
        var s:string;
        if (this.rest === null) {
            s = this.buffer.substring(this.start, this.end + 1)
        } else {
            s = this.rest + this.buffer.substring(0, this.end + 1)
        }
        return parseFloat(s)
    }

}

