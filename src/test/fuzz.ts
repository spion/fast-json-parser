export function int(start:number, end:number) {
    return start + Math.floor(Math.random() * (end + 0.999999))
}

export function number() {
    var v = Math.random()
    if (v < 0.1) {
        v = int(-3, 3)
    } else {
        return (Math.random() - 0.5) * 100000
    }
}

var sTable = '\\"`1234567890!@#$xcvb::\\""asdfghjk\'\'';

export function string() {
    var n = int(0, 20), s = ''
    for (var k = 0; k < n; ++k) {
        s += sTable[int(0, sTable.length - 1)]
    }
    return s
}

var others = [null, true, false];

export function other() {
    return others[int(0, 2)];
}

export function array() {
    var n = int(0, 20), s:any[] = []
    for (var k = 0; k < n; ++k) {
        s.push(value())
    }
    return s;
}

export function object() {
    var o:any = {};
    var n = int(0, 20);
    for (var k = 0; k < n; ++k) {
        o[string()] = value();
    }
    return o;
}

export function value() {
    var choice = Math.random()
    if (choice < 0.3)
        return number()
    if (choice < 0.6)
        return string()
    if (choice < 0.92)
        return other()
    if (choice < 0.96)
        return array()
    return object()
}
