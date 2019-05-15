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
  graph: IGraph,
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

  private _impact(cxt: ICxt, ...targets: IImpactTarget[]) {
    if (targets.length === 1) {
      const target: IImpactTarget = targets[0]
      let vertex: IVertex
      let data: IAny

      if (Array.isArray(target)) {
        [vertex, data] = target

        Injector.upsertDataRef(this.space, data, cxt.graph, vertex)
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

        if (cxt.sync) {
          Injector.upsertDataRef(this.space, handler(...sources), cxt.graph, vertex)
          this._impact(cxt, ...targetVertexes)
          cxt.queue--

        } else {
          promisify(handler(...sources))
            .then(res => {
              Injector.upsertDataRef(this.space, res, cxt.graph, vertex)
              this._impact(cxt, ...targetVertexes)
              cxt.queue--
            })
        }


      }


    } else {
      targets.map(target => this.impact(target))
    }
  }

  impact(...targets: IImpactTarget[]) {

    const cxt: ICxt = this.getContext()
    const dp = getDecomposedPromise()






    if (cxt.sync) {
      return this.space
    } else {

    }
  }

  getContext(): ICxt {
    const cxt = Extractor.findByType('CXT', this.space)


    if (!cxt) {
      throw new Error('CXT is required')
    }

    return cxt.value
  }

  createContext(): ICxt {
    // const cxt = Extractor.findByType('CXT', this.space)
    const dp = getDecomposedPromise()
    const cxt = {
      space: this.space,
      queue: 0,
      dp
    }

    if (!cxt) {
      throw new Error('CXT is required')
    }

    return {...cxt.value, }
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
