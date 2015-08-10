import {Code} from './code'

const enum Mode {
    Positive = 0,
    Negative = 1,
    Reminder = 2,
    Both = 3
}

export default class NumParser {
    private mode: number;
    private whole: number;
    private reminder: number;
    private divisor: number;

    init(code: number) {
        if (code === Code.Minus) {
            this.mode = Mode.Negative;
            this.whole = 0;
        } else {
            this.mode = Mode.Positive;
            this.whole = code - Code.Zero;
        }
        this.reminder = 0;
        this.divisor = 1;
    }

    public advance(str:string, k:number) {
        var code = str.charCodeAt(k);
        var reminderMode = this.mode & Mode.Reminder
        if (code === Code.Dot) {
            if (reminderMode) {
                throw new Error("Unexpected second . in number")
            } else {
                this.mode |= Mode.Reminder;
            }
        } else if (code >= Code.Zero && code <= Code.Nine) {
            var val = code - Code.Zero;
            if (reminderMode) {
                this.reminder = this.reminder * 10 + val
                this.divisor *= 10;
            }
            else {
                this.whole = this.whole * 10 + val;
            }
        } else {
            return true;
        }
        return false;
    }

    public value() {
        var val = this.whole + this.reminder / this.divisor;
        return this.mode & Mode.Negative ? 0 - val : val;
    }
}
