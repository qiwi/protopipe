import {IId, ISpaceElement, ISpaceOperator, ISpace} from '../types'
import {CrudStackOperator} from '../../stack/operator'
import {IAny, IPredicate} from '../../types'
import {IStackValueUpdateReducer} from '../../stack/operator/Crud'
import {IStack} from "../../stack";

export interface IReference extends ISpaceElement {
  type: 'REF',
  value: {
    from: IId,
    to: IId
  }
}

export type IDirection = 'from' | 'to'

export class RefOperator implements ISpaceOperator<ISpace> {

  space: ISpace

  constructor(space: ISpace) {
    this.space = space
  }

  static create(space: ISpace, type: string, value: IAny): ISpaceElement {
    const stack: IStack<ISpaceElement> = space.value
    const elt: ISpaceElement = {
      id: Math.random() + '',
      type,
      value,
    }

    return CrudStackOperator.create(stack, elt)
  }

  static upsert(space: ISpace, type: string, value: IAny, predicate?: IPredicate): ISpaceElement {
    const stack = space.value
    const elt: ISpaceElement = {
      id: Math.random() + '',
      type,
      value,
    }
    const _predicate = predicate ? predicate : () => false
    const reducer: IStackValueUpdateReducer = (prev, next) => ({...prev, ...next, id: prev.id})

    return CrudStackOperator.update(
      stack,
      _predicate,
      elt,
      true,
      reducer,
    )
  }

  static getRefs(space: ISpace, id: IId | IId[], direction: IDirection = 'from'): ISpaceElement[] {
    const ids = Array.isArray(id) ? id : [id]
    return CrudStackOperator.read(
      space.value,
      (item) => item.type === 'REF' && ids.includes(item.value[direction]),
    )
  }

  static get(space: ISpace, id: IId, type?: string): ISpaceElement | undefined {
    return CrudStackOperator.read(space.value, ({id: _id, type: _type}) => id === _id && (type ? type === _type : true), 1)[0]
  }

  static getRels(space: ISpace, id: IId, direction: IDirection = 'from'): ISpaceElement[] {
    const refs = this.getRefs(space, id, direction)
    const _direction: IDirection = direction === 'from' ? 'to' : 'from'
    const ids = refs.map(ref => ref.value[_direction])

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

  static read(predicate: IPredicate, space: ISpace, limit?: number): ISpaceElement[] {
    return CrudStackOperator.read(space.value, predicate, limit)
  }

  static find(predicate: IPredicate, space: ISpace): ISpaceElement | undefined {
    return this.read(predicate, space, 1)[0]
  }
}
