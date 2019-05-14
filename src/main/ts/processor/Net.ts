import {staticImplements, IAny} from '../types'
import {IProcessorStaticOperator} from './types'
import {ISpace} from '../space/'
import {IGraph, Pathfinder} from '../graph'
import {Extractor} from '../space/'
/*import {Extra}

const executor = (space: ISpace, mode: string, pointer: IPointer) => {

}*/


export type INetProcessorParams = {
  graph: IGraph
}

type ICxt = {
  pathfinder: Pathfinder,
  queue: number,
  graph: IGraph,
  sync: boolean
}

/**
 * Net processor.
 */
@staticImplements<IProcessorStaticOperator>()
export class NetProcessor {
  [key: string]: IAny
  space: ISpace

  constructor(params: INetProcessorParams) {
    this.space = NetProcessor.parser(params)
  }

  impact() {
    const cxt: ICxt = this.getContext()

    const {pathfinder} = cxt

    cxt.queue++
  }

  getContext(): ICxt {
    const cxt = Extractor.findByType('CXT', this.space)

    if (!cxt) {
      throw new Error('CXT is required')
    }

    return cxt.value
  }

  static parser({graph}: INetProcessorParams) {

    const pathfinder = new Pathfinder(graph)
    const cxt: ICxt = {
      graph,
      pathfinder,
      sync: true,
      queue: 0
    }

    const space: ISpace = {
      type: 'SPACE',
      value: [{
        type: 'CXT',
        value: cxt
      }]
    }

    return space
  }

}
