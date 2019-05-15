import {
  ConstructorType,
  IAny,
} from '../types'
import {ISpace} from '../space/types'

export type ISpaceParser = (...args: IAny[]) => ISpace

export type IProcessorMethod = (...args: IAny) => IAny
export type IProcessorStaticMethod = (space: ISpace, ...args: IAny) => IAny

export type IProcessor = {
  [key: string]: IProcessorMethod
} & {
  space: ISpace
}

export interface IProcessorStaticOperator extends ConstructorType<IProcessor> {
  parser: ISpaceParser
}