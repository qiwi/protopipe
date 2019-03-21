export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type IInput = {
  data: IAny,
  meta: IAny
}

export type IOutput = {
  data: IAny,
  meta?: IAny
}

export type IHandler = (input: IInput) => IOutput

export type IPipe = {
  handler: IHandler
}

export interface IMeta {
  opts: Array<IAnyMap>
}

export type IData = IAny
