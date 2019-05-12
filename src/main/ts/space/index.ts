
import {
  IAnyValue,
  IDataRef,
  ISpace,
} from './types'

export * from './types'

export const findByType = (type: any, space: ISpace): IAnyValue | undefined => space.value.find((item: IAnyValue) => item.type === type)

export const findDataRefs = findByType.bind(null,'DATA_REF') as (space: ISpace) => IDataRef | undefined
//export const findDataRefs = (space: ISpace): IDataRef | undefined => findByType('DATA_REF', space)
