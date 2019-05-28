import {IStackOperator, IStack} from '../types'

export type IStackFilterPredicate<T> = (item: T, index: number, arr: T[]) => boolean

export type IStackValueUpdateReducer = (prev: any, next: any) => any

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

  update(predicate: IStackFilterPredicate<any>, value: any, upsert?: boolean): any[] {
    return CrudStackOperator.update(this.stack, predicate, value, upsert)
  }

  del(predicate: IStackFilterPredicate<any>): any[] {
    return CrudStackOperator.del(this.stack, predicate)
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

  static update(stack: IStack<any>, predicate: IStackFilterPredicate<any>, value: any, upsert?: boolean, reducer?: IStackValueUpdateReducer): any {
    const index = stack.indexOf(this.read(stack, predicate, 1)[0])

    if (index !== -1) {
      const prev: any = stack.get(index)
      const _reducer: IStackValueUpdateReducer = reducer ? reducer : (...args) => args[0]
      const next = _reducer(prev, value)

      return stack.add(index, next)
    }

    if (upsert) {
      return this.create(stack, value)
    }

  }

  static del(stack: IStack<any>, predicate: IStackFilterPredicate<any>): any[] {
    const removed: any[] = []
    const filtered = stack.filter((item: any, index: number, arr: any[]) => {
      if (predicate(item, index, arr)) {
        removed.push(item)

        return false
      }

      return true
    })

    stack.clear()
    stack.push(...filtered)

    return removed
  }

}
