import {IStackOperator, IStack} from '../types'

export type IStackFilterPredicate<T> = (item: T, index: number, arr: T[]) => boolean

export class CrudStackOperator implements IStackOperator<IStack<any>> {

  stack: IStack<any>
  constructor(stack: IStack<any>) {
    this.stack = stack
  }

  create(value: any): any {
    return CrudStackOperator.create(this.stack, value)
  }

  read(predicate: IStackFilterPredicate<any>, limit?: number): any[] {
    return CrudStackOperator.read(this.stack, predicate, limit)
  }

  upsert(predicate: IStackFilterPredicate<any>, value: any): any {
    const updated = this.update(predicate, value, 1)

    return updated.length === 0
      ? this.create(value)
      : updated[0]
  }

  update(predicate: IStackFilterPredicate<any>, value: any, limit?: number): any[] {
    // @ts-ignore
    // tslint:disable-next-line
    return this.filter(predicate, limit).forEach(item => Object.assign(item, value))
  }

  del(predicate: IStackFilterPredicate<any>) {
    CrudStackOperator.del(this.stack, predicate)
  }

  static create(stack: IStack<any>, value: any): any {
    stack.push(value)

    return value
  }

  static read(stack: IStack<any>, predicate: IStackFilterPredicate<any>, limit?: number): any[] {
    if (limit === 1) {
      const found = stack.toArray().find(predicate)
      return found ? [found] : []
    }

    return stack.filter(predicate)
  }

  static upsert(stack: IStack<any>, predicate: IStackFilterPredicate<any>, value: any): any {
    const updated = this.update(stack, predicate, value, 1)

    return updated.length === 0
      ? this.create(stack, value)
      : updated[0]
  }

  static update(stack: IStack<any>, predicate: IStackFilterPredicate<any>, value: any, limit?: number): any[] {
    // @ts-ignore
    // tslint:disable-next-line
    return this.filter(stack, predicate, limit).forEach(item => Object.assign(item, value))
  }

  static del(stack: IStack<any>, predicate: IStackFilterPredicate<any>) {
    stack.clear()
    const filtered = stack.filter((item: any, index: number, arr: any[]) => !predicate(item, index, arr))
    stack.push(...filtered)
  }

}
