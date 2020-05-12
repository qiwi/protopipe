/** @module protopipe */

import {
  IAny,
  IConstructor,
} from '../types'

import {ISpace} from '../space'

export type ISpaceParser = (...args: IAny[]) => ISpace

export type IProcessorMethod = (...args: IAny[]) => IAny
export type IProcessorStaticMethod = (space: ISpace, ...args: IAny[]) => IAny

export type IProcessor = {
  [key: string]: IProcessorMethod
} & {
  space: ISpace
}

export interface IProcessorStaticOperator extends IConstructor<IProcessor> {
  parser: ISpaceParser
}
