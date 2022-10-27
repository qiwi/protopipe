/** @module protopipe */

import {IStack, Stack} from '../stack'
import {ISpace, ISpaceElement} from './types'

export class Space implements ISpace {

  type: 'SPACE'
  value: IStack<any>

  constructor(...elts: ISpaceElement[]) {
    this.value = new Stack(...elts)
    this.type = 'SPACE'
  }

}
