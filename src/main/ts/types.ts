/** @module protopipe */

import {ILogger} from '@qiwi/substrate'

export {
  IPromise,
  TPredicate,
  IConfigurable,
  IConstructor,
  ITypedValue,
  INil,
  IAnyMap,
} from '@qiwi/substrate'

export type IAny = any

/* tslint:disable */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => { constructor }
}

export interface ILibCxt {
  Promise: any
  logger: ILogger
}

