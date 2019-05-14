import {
  IAnyValue,
  IDataRef,
  ISpace,
  ISpaceOperator
} from '../types'

export const findByType = (type: any, space: ISpace): IAnyValue | undefined => space.value.find((item: IAnyValue) => item.type === type)

export const findDataRef = findByType.bind(null, 'DATA_REF') as (space: ISpace) => IDataRef | undefined

export class Extractor implements ISpaceOperator {
  space: ISpace

  constructor(space: ISpace) {
    this.space = space
  }

  findByType(type: any): IAnyValue | undefined {
    return Extractor.findByType(type, this.space)
  }

  findDataRef(): IDataRef | undefined {
    return Extractor.findDataRef(this.space)
  }

  static findByType = findByType

  static findDataRef = findDataRef
}
