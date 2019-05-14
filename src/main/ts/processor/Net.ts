import {staticImplements, IAny} from '../types'
import {IProcessorStaticOperator} from './types'
import {ISpace} from '../space/types'
/*import {Extra}

const executor = (space: ISpace, mode: string, pointer: IPointer) => {

}*/


/**
 * Net processor.
 */
@staticImplements<IProcessorStaticOperator>()
export class NetProcessor {
  [key: string]: IAny
  space: ISpace

  constructor(...args: IAny[]) {
    this.space = NetProcessor.parser(...args)
  }

  static parser(...args: IAny[]) {
    console.log('args=', args)
    const space: ISpace = {
      type: 'SPACE',
      value: []
    }

    return space
  }
}
