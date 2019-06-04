/** @module protopipe */

import {
  IAny,
} from '../types'

import {
  IStack,
} from '../stack'

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
