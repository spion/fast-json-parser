function cc(s: string) {
  return s.charCodeAt(0);
}

export var Constants = {
  Null: [].map.call("null", cc) as number[],
  True: [].map.call("true", cc) as number[],
  False: [].map.call("false", cc) as number[]
};

export const enum Code {
  LBrace = 123,
  RBrace = 125,
  LBracket = 91,
  RBracket = 93,
  Quote = 34,
  Colon = 58,
  Plus = 43,
  Comma = 44,
  Minus = 45,
  Zero = 48,
  Nine = 57,
  Dot = 46,
  T = 116,
  F = 102,
  N = 110,
  R = 114,
  B = 98,
  U = 117,
  Escape = 92,
  Slash = 47,
  Whitespace = 32,
  Lf = 10,
  Cr = 13,
  e = 101,
  E = 69
}
