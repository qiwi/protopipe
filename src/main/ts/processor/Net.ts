import {
  staticImplements,
  IAny,
  // IAnyMap
} from '../types'
import {IProcessorStaticOperator} from './types'
import {
  ISpace,
  Extractor
} from '../space/'
import {
  IGraph,
  IVertex,
  Pathfinder
} from '../graph'
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

type IImpactTarget = IVertex | [IVertex, IAny]

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

  impact(...targets: IImpactTarget[]) {
console.log(targets)
    //const vertexes: IVertex[] = Object.keys(input)
    //const cxt: ICxt = this.getContext()

   /* if (targets.length === 1) {

      cxt.queue++

      const target: IImpactTarget = targets[0]

      if (Array.isArray(target)) {
        const [vertex, data]: [IVertex, IAny] = target

      }


      const {pathfinder} = cxt

      cxt.queue++
    }

    if (vertexes.length > 1) {
      vertexes.map((vertex: IVertex) => this.impact({[vertex]: input[vertex]})) // TODO use .pick()?
    }
*/


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
