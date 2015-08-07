import {Code, Constants} from './code'

export default class ConstParser {
    private pos: number;
    private expect: number[];
    private val: boolean;

    constructor() {
        this.pos = 0;
        this.expect = null;
        this.val = null;
    }
    public init(code:number) {
        this.pos = 0;
        if (code === Code.T) {
            this.expect = Constants.True;
            this.val = true;
        } else if (code === Code.F) {
            this.expect = Constants.False
            this.val = false;
        } else if (code === Code.N) {
            this.expect = Constants.Null
            this.val = null;
        } else {
            throw new Error("Invalid: " + String.fromCharCode(code))
        }
    }
    public advance(str:string, k:number) {
        this.pos += 1;
        if (this.pos >= this.expect.length)
            return true;
        if (this.expect[this.pos] != str.charCodeAt(k))
            throw new Error('Invalid: ' + str)
        return false;
    }

    public value() {
        return this.val;
    }
}
