import {
  IAnyValue,
  ISpace,
  ISpaceOperator
} from '../types'

import {find} from './Extractor'
import {IPredicate} from '../../types'

export const upsert = (predicate: IPredicate, space: ISpace, item: IAnyValue): IAnyValue => {
  const target = find(predicate, space)

  if (target) {
    return Object.assign(target, item)
  }

  space.value.push(item)

  return item
}


export class Injector implements ISpaceOperator {
  space: ISpace

  constructor(space: ISpace) {
    this.space = space
  }

  upsert(predicate: IPredicate, item: IAnyValue) {
    return Injector.upsert(predicate, this.space, item)
  }

  static upsert = upsert
}
