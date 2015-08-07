interface ParserLike<T> {
    init(str: string, k: number):void;
    advance(str: string, k: number): boolean;
    value(): T
}

export function test<T>(data:string[], np:ParserLike<T>, defaultStart = 0):T {
    np.init(data[0], defaultStart);
    for (var i = 0; i < data.length; ++i) {
        var str = data[i];
        var start = i == 0 ? defaultStart + 1 : 0;
        for (var j = start; j < str.length; ++j) {
            if (np.advance(str, j)) {
                return np.value();
            }
        }
    }
    return np.value()
}