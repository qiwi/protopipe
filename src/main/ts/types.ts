/** @module protopipe */

import {ILogger} from '@qiwi/substrate'

export {
  IPromise,
  TPredicate,
  IConfigurable,
  IConstructor,
  ITypedValue,
} from '@qiwi/substrate'

export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type INil = null | undefined

export type ITypedValue<T, V> = {
  type: T,
  value: V
}

/* tslint:disable */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => { constructor }
}

export interface ILibCxt {
  Promise: any
  logger: ILogger
}

