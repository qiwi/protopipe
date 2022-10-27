/** @module protopipe */

import { ILogger } from '@qiwi/substrate'

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

export function staticImplements<T>() {
  /* eslint-disable-next-line no-unused-expressions */
  return <U extends T>(constructor: U) => { constructor }
}

export interface ILibCxt {
  Promise: any
  logger: ILogger
}
