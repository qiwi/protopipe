import {
  IAny,
  ISpace
} from '../interface'

export type IReducer = (space: ISpace, ...payload: IAny[]) => ISpace

export type ISpaceOperator = {
  space: ISpace
}
