export interface IStack<T> {
  get(index: number): T
  push(...items: Array<T>): T
  pop(): T
  shift(): T
  unshift(...items: Array<T>): T
  size(): number
  filter(cb: (item: T, index: number, arr: Array<T>) => boolean): Array<T>
  last(): T,
  first(): T,
  toArray(): Array<T>
  clear(): void
  indexOf(item: T): number
  add(index: string | number, item: T): T
}

export type IStackOperator<IStack> = {
  stack: IStack
}
