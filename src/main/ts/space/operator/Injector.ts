import {
  IAnyValue,
  IDataRef,
  IPointer,
  ISpace,
  ISpaceOperator,
} from '../types'

import {find} from './Extractor'

import {
  IAny,
  IPredicate,
} from '../../types'

import {
  IEdge,
  IGraph,
  IVertex,
} from '../../graph'

export const upsert = (predicate: IPredicate, space: ISpace, item: IAnyValue): IAnyValue => {
  const target = find(predicate, space)

  if (target) {
    return {...target, ...item}
  }

  return push(space, item)
}

export const push = (space: ISpace, item: IAnyValue): IAnyValue => {
  space.value.push(item)

  return item
}

export const unshift = (space: ISpace, item: IAnyValue): IAnyValue => {
  space.value.unshift(item)

  return item
}

export const upsertRef = (type: IAny, space: ISpace, data: IAny, graph: IGraph, vertex?: IVertex, edge?: IEdge) => {
  const pointer: IPointer = {
    type: 'POINTER',
    value: {
      graph,
      vertex,
      edge,
    },
  }
  const dataRef: IDataRef = {
    type,
    value: {
      pointer,
      value: data,
    },
  }

  upsert(
    ({type: _type, value}: IAnyValue) =>
      type === _type
      && (value.pointer)
      && (!vertex || value.pointer.value.vertex === vertex)
      && (!edge || value.pointer.value.edge === edge),
    space,
    dataRef,
  )
}

const upsertDataRef = upsertRef.bind(null, 'DATA_REF') as (space: ISpace, data: IAny, graph: IGraph, vertex?: IVertex, edge?: IEdge) => IDataRef

export class Injector implements ISpaceOperator {

  space: ISpace

  constructor(space: ISpace) {
    this.space = space
  }

  upsert(predicate: IPredicate, item: IAnyValue) {
    return Injector.upsert(predicate, this.space, item)
  }

  static upsert = upsert

  static upsertDataRef = upsertDataRef

  static push = push

  static unshift = unshift

}
