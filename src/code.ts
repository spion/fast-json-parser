function cc(s:string) { return s.charCodeAt(0) }

export var Constants = {
    Null: [].map.call('null', cc),
    True: [].map.call('true', cc),
    False: [].map.call('false', cc)
}

export var Code = {
    LBrace: cc('{'),
    RBrace: cc('}'),
    LBracket: cc('['),
    RBracket: cc(']'),
    Quote: cc('"'),
    Colon: cc(':'),
    Comma: cc(','),
    Minus: cc('-'),
    Zero: cc('0'),
    Nine: cc('9'),
    Dot: cc('.'),
    T: cc('t'),
    F: cc('f'),
    N: cc('n'),
    Escape: cc('\\'),
    Whitespace: cc(' '),
    Lf: cc("\n"),
    Cr: cc("\r")
};
