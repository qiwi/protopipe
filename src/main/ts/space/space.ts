import {ISpace, ISpaceElement} from './types'
import {IStack, Stack} from '../stack'

export class Space implements ISpace {
  type: 'SPACE'
  value: IStack<any>

  constructor(...elts: ISpaceElement[]) {
    this.value = new Stack(...elts)
    this.type = 'SPACE'
  }
}
