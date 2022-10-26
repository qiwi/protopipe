/** @module protopipe */

import {ISpace} from '../space'
import {
  IAny,
  IConstructor,
} from '../types'

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
