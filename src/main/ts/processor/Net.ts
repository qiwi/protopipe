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
  IRefReducer,
} from '../space/'
import {
  IGraph,
  IVertex,
  Pathfinder
} from '../graph'
import {IDecomposedPromise, promisify, getDecomposedPromise} from '../util';

export type INetProcessorParams = {
  graph: IGraph
}

type ICxt = {
  queue: number,
  sync: boolean,
  dp: IDecomposedPromise
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

  private static _impact(space: ISpace, ...targets: IImpactTarget[]) {
    const cxt: ICxt = this.getContext(space)
    const graph: IGraph = this.getGraph(space)

    if (targets.length === 1) {
      const target: IImpactTarget = targets[0]
      let vertex: IVertex
      let data: IAny

      if (Array.isArray(target)) {
        [vertex, data] = target

        Injector.upsertDataRef(space, data, graph, vertex)
      } else {
        vertex = target
      }

      const handler: IRefReducer = this.getHandler(space, vertex)
      const targetVertexes: IVertex[] = Pathfinder.getOutVertexes(graph, vertex)
      const sourceVertexes: IVertex[] = Pathfinder.getInVertexes(graph, vertex)
      const sources: IDataRef[] = Extractor.filter(
        ({type, value}: IAnyValue) => type === 'DATA_REF' && sourceVertexes.includes(value.pointer.value.vertex),
        space
      )

      if (sources.length === sourceVertexes.length) {
        cxt.queue++

        if (cxt.sync) {
          Injector.upsertDataRef(space, handler(...sources), graph, vertex)
          this._impact(space, ...targetVertexes)
          cxt.queue--

        } else {
          promisify(handler(...sources))
            .then(res => {
              Injector.upsertDataRef(space, res, graph, vertex)
              this._impact(space, ...targetVertexes)
              cxt.queue--
            })
        }


      }


    } else {
      targets.map(target => this._impact(space,target))
    }
  }

  impact(...targets: IImpactTarget[]) {
    return NetProcessor.impact(this.space, ...targets)
  }

  static getHandler(space: ISpace, vertex: IVertex): IRefReducer {
    const handlerRef = Extractor.find(
      ({type, value}: IAnyValue) => type === 'HANDLER_REF' && value.pointer.value.vertex === vertex,
       space,
    ) || Extractor.find(
      ({type, value}: IAnyValue) => type === 'HANDLER_REF' && !value.pointer.value.vertex,
      space,
    )

    if (!handlerRef) {
      throw new Error('HANDLER is required')
    }

    return handlerRef.value.value
  }

  static impact(space: ISpace, ...targets: IImpactTarget[]) {

    this.attachContext(space)

  }

  static attachContext(space: ISpace): void {

    if (Extractor.findByType('CXT', space)) {
      throw new Error('There\'s no place for yet another one execution context')
    }

    Injector.unshift(space, {
      type: 'CXT',
      value: {
        sync: true,
        queue: 0,
        dp: getDecomposedPromise()
      }
    })

  }

  static getContext(space: ISpace): ICxt {
    const cxt = Extractor.findByType('CXT', space)


    if (!cxt) {
      throw new Error('CXT is required')
    }

    return cxt && cxt.value
  }

  static getGraph(space: ISpace): IGraph {
    const graph = Extractor.findByType('GRAPH', space)


    if (!graph) {
      throw new Error('GRAPH is required')
    }

    return graph && graph.value
  }

  static parser({graph}: INetProcessorParams) {

    const space: ISpace = {
      type: 'SPACE',
      value: [{
        type: 'GRAPH',
        value: graph
      }]
    }

    return space
  }

}
