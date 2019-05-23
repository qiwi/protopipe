import {
  IGraph,
  IVertex,
  IEdge,
} from '../graph/'

import {
  IAny,
} from '../types'

export type IId = string

export interface ISpaceEntity {
  id: IId,
  type: IAny,
  value: IAny,
  meta: IAny
}

export type ISpaceOperator<ISpace> = {
  space: ISpace
}

export type ISpace = {
  type: 'SPACE',
  value: Array<ISpaceEntity>
}

export interface IRefEntity extends ISpaceEntity {
  type: 'REF',
  value: {
    from: IId,
    to: IId
  }
}

export type IPointer = {
  graph: IGraph,
  vertex?: IVertex,
  edge?: IEdge
}

export type IMeta = {
  id?: string,
  pointer?: IPointer,
  [key: string]: IAny
}

export type IDataRef = {
  type: 'DATA',
  value: IAny,
  meta: {}
}
