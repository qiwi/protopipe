/** @module protopipe */

import {IStack as _IStack} from '@qiwi/substrate-types'

export interface IStack<T> extends _IStack<T> {
  toArray(): Array<T>
  filter(cb: (item: T, index: number, arr: Array<T>) => boolean): Array<T>
}

export type IStackOperator<IStack> = {
  stack: IStack
}
