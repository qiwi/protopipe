/** @module protopipe */

import {
  IStack,
} from '../stack'
import {
  IAny,
} from '../types'

export type IId = string

export interface ISpaceElement {
  id: IId,
  type: IAny,
  value: IAny,
}

export type ISpaceOperator<ISpace> = {
  space: ISpace
}

export type ISpace = {
  type: 'SPACE',
  value: IStack<ISpaceElement>
}
