import {
  staticImplements,
  IAny,
  // IAnyMap
} from '../types'
import {IProcessorStaticOperator} from './types'
import {
  ISpace,
  Extractor,
  Injector,
  IDataRef,
  IAnyValue,
  IPointer,
  IRefReducer,
} from '../space/'
import {
  IGraph,
  IVertex,
  Pathfinder
} from '../graph'

export type INetProcessorParams = {
  graph: IGraph
}

type ICxt = {
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

    const cxt: ICxt = this.getContext()

    if (targets.length === 1) {
      const target: IImpactTarget = targets[0]
      let vertex: IVertex
      let data: IAny
      let res: IAny

      if (Array.isArray(target)) {
        [vertex, data] = target
        this.injectDataRef(vertex, data, cxt)
      } else {
        vertex = target
      }

      const handler: IRefReducer = this.getHandler(vertex)
      const targetVertexes: IVertex[] = Pathfinder.getOutVertexes(cxt.graph, vertex)
      const sourceVertexes: IVertex[] = Pathfinder.getInVertexes(cxt.graph, vertex)
      const sources: IDataRef[] = Extractor.filter(
        ({type, value}: IAnyValue) => type === 'DATA_REF' && sourceVertexes.includes(value.pointer.value.vertex),
        this.space
      )

      if (sources.length === sourceVertexes.length) {
        cxt.queue++
        res = handler(...sources)

        this.injectDataRef(vertex, res, cxt)

        this.impact(...targetVertexes)
        cxt.queue--
      }


    } else {
      targets.map(target => this.impact(target))
    }

  }

  injectDataRef(vertex: IVertex, data: IAny, cxt: ICxt) {
    const pointer: IPointer = {
      type: 'POINTER',
      value: {
        graph: cxt.graph,
        vertex
      }
    }
    const dataRef: IDataRef = {
      type: 'DATA_REF',
      value: {
        pointer,
        value: data
      }
    }

    Injector.upsert(
      ({type, value}: IAnyValue) => type === 'DATA_REF' && value.pointer.value.vertex === vertex,
      this.space,
      dataRef
    )
  }

  getContext(): ICxt {
    const cxt = Extractor.findByType('CXT', this.space)

    if (!cxt) {
      throw new Error('CXT is required')
    }

    return cxt.value
  }

  getHandler(vertex: IVertex): IRefReducer {
    return (Extractor.find(
      ({type, value}: IAnyValue) => type === 'HANDLER_REF' && value.pointer.value.vertex === vertex,
       this.space,
    ) || {
      value: {
        value: (...args: IAny[]) => void args
      }
    }).value.value
  }

  static parser({graph}: INetProcessorParams) {

    const cxt: ICxt = {
      graph,
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
