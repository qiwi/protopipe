/** @module protopipe */

export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type INil = null | undefined

export type ITypedValue<T, V> = {
  type: T,
  value: V
}

export interface ConstructorType<T> {
  new (...args: any[]): T
}

export type IPredicate = (...args: IAny[]) => boolean

/* tslint:disable */
export function staticImplements<T>() {
  return <U extends T>(constructor: U) => { constructor }
}
