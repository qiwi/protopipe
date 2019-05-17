import {
  IAnyValue,
  IDataRef,
  IHandlerRef,
  ISpace,
  ISpaceOperator,
} from '../types'

import {IPredicate} from '../../types'
import {IVertex} from '../../graph'

export const filter = (predicate: IPredicate, space: ISpace): IAnyValue[] => space.value.filter(predicate)

export const find = (predicate: IPredicate, space: ISpace): IAnyValue | undefined => space.value.find(predicate)

export const findByType = (type: any, space: ISpace): IAnyValue | undefined => find((item: IAnyValue) => item.type === type, space)

export const findDataRef = findByType.bind(null, 'DATA_REF') as (space: ISpace) => IDataRef | undefined

export const findRefByVertex = (type: any, space: ISpace, vertex: IVertex): IAnyValue | undefined => Extractor.find(
  ({type: _type, value}: IAnyValue) => type === _type && value.pointer.value.vertex === vertex,
  space,
)

export const findHandlerRefByVertex = findRefByVertex.bind(null, 'HANDLER_REF') as (space: ISpace, vertex: IVertex) => IHandlerRef | undefined
export const findDataRefByVertex = findRefByVertex.bind(null, 'DATA_REF') as (space: ISpace, vertex: IVertex) => IDataRef | undefined

export class Extractor implements ISpaceOperator {

  space: ISpace

  constructor(space: ISpace) {
    this.space = space
  }

  filter(predicate: IPredicate) {
    return Extractor.filter(predicate, this.space)
  }

  find(predicate: IPredicate) {
    return Extractor.find(predicate, this.space)
  }

  findByType(type: any): IAnyValue | undefined {
    return Extractor.findByType(type, this.space)
  }

  findDataRef(): IDataRef | undefined {
    return Extractor.findDataRef(this.space)
  }

  static find = find

  static findByType = findByType

  static findDataRef = findDataRef

  static filter = filter

  static findRefByVertex = findRefByVertex

  static findHandlerRefByVertex = findHandlerRefByVertex

  static findDataRefByVertex = findDataRefByVertex

}
