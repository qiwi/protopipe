import {IId, ISpaceElement, ISpaceOperator, ISpace} from '../types2'
import {CrudStackOperator} from '../../stack/operator'
import {IAny, IPredicate} from '../../types'
import {IStackValueUpdateReducer} from '../../stack/operator/Crud'

export interface IReference extends ISpaceElement {
  type: 'REF',
  value: {
    from: IId,
    to: IId
  }
}

export class RefOperator implements ISpaceOperator<ISpace> {

  space: ISpace

  constructor(space: ISpace) {
    this.space = space
  }

  static upsert(space: ISpace, type: string, value: IAny, predicate?: IPredicate) {
    const elt: ISpaceElement = {
      id: Math.random() + '',
      type,
      value,
    }
    const _predicate = predicate ? predicate : () => false
    const reducer: IStackValueUpdateReducer = (prev, next) => ({...prev, ...next, id: prev.id})

    CrudStackOperator.update(
      space.value,
      _predicate,
      elt,
      true,
      reducer,
    )
  }

  static getRels(space: ISpace, id: IId): ISpaceElement[] {
    const refs: IReference[] = CrudStackOperator.read(
      space.value,
      (item) => item.type === 'REF' && id === item.value.from,
    )
    const ids = refs.map(ref => ref.value.to)

    return CrudStackOperator.read(space.value, item => ids.includes(item.id))
  }

  static link(space: ISpace, from: IId, to: IId) {

    const type = 'REF'
    const value = {
      from,
      to,
    }

    return this.upsert(space, type, value, (item: ISpaceElement) => item.type === type && item.value.from === from && item.value.to === to)
  }

}
