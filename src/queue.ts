//var arr:any = []

export class Queue<T> {
  public length: number;
  [key: number]: T;

  constructor(private _capacity: number) {
    this.length = 0;
    for (var k = 0; k < _capacity; ++k) this[k] = undefined as any;
  }
  public push(element: T) {
    this[this.length++] = element;
  }
  public pop(): any {
    return this[--this.length];
  }
}
