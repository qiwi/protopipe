export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type ITypedValue<T, V> = {
  type: T,
  value: V
}
