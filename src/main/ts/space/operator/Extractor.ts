import {
  IAnyValue,
  IDataRef,
  ISpace,
  ISpaceOperator
} from '../types'

import {IPredicate} from '../../types'

export const find = (predicate: IPredicate, space: ISpace): IAnyValue | undefined => space.value.find(predicate)

export const findByType = (type: any, space: ISpace): IAnyValue | undefined => find((item: IAnyValue) => item.type === type, space)

export const findDataRef = findByType.bind(null, 'DATA_REF') as (space: ISpace) => IDataRef | undefined

export class Extractor implements ISpaceOperator {
  space: ISpace

  constructor(space: ISpace) {
    this.space = space
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
}
