export function mkErrorMsg(str: string, k: number) {
  return "Unexpected " + str[k] + " at: " + k + " : " + str.substring(k - 5, k + 5);
}
