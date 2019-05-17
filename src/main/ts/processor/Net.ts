import {
  staticImplements,
  IAny,
} from '../types'
import {IProcessorStaticOperator} from './types'
import {
  ISpace,
  Extractor,
  Injector,
  IDataRef,
  IAnyValue,
  IRefReducer,
  IHandlerRef,
} from '../space/'
import {
  IGraph,
  IVertex,
  Pathfinder,
} from '../graph'
import {IDecomposedPromise, promisify, getDecomposedPromise} from '../util'

export type INetProcessorParams = {
  graph: IGraph,
  handler: Function
}

type ICxt = {
  queue: number,
  sync: boolean,
  override: boolean,
  dp: IDecomposedPromise,
  before: Function
  after: Function
}

type IImpactTarget = IVertex | [IVertex, IAny]

type INormalizedImpactTarget = {
  vertex: IVertex,
  data?: IAny
}

const requireByType = <T, V>(type: T, space: ISpace): V => {
  const item: IAnyValue | undefined = Extractor.findByType(type, space)

  if (!item) {
    throw new Error(`${type} is required`)
  }

  return item && item.value
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

  impact(sync: boolean, ...targets: IImpactTarget[]) {
    return NetProcessor.impact(this.space, sync, ...targets)
  }

  private static _normalizeImpactTarget(target: IImpactTarget): INormalizedImpactTarget {
    let vertex: IVertex
    let data: IAny

    if (Array.isArray(target)) {
      [vertex, data] = target

    }
    else {
      vertex = target
    }

    return {
      vertex,
      data,
    }
  }

  private static _process(cxt: ICxt, space: ISpace, graph: IGraph, vertex: IVertex, handler: IRefReducer) {
    cxt.before()

    const targetVetexes: IVertex[] = Pathfinder.getOutVertexes(graph, vertex)
    const processResult = (res: IAny) => {
      Injector.upsertDataRef(space, res, graph, vertex)
      this._impactGroup(space, ...targetVetexes)
      cxt.after()
    }

    if (cxt.sync) {
      processResult(handler())

    }
    else {
      promisify(handler())
        .then(processResult)
        .catch(e => cxt.dp.reject(e))
    }
  }

  private static _impactSingle(space: ISpace, target: IImpactTarget): void {
    const cxt: ICxt = this.getContext(space)
    const graph: IGraph = this.getGraph(space)
    const {vertex, data} = this._normalizeImpactTarget(target)

    if (data !== undefined) {
      this._process(cxt, space, graph, vertex, () => data)
      return
    }

    if (!cxt.override && Extractor.findDataRefByVertex(space, vertex)) {
      return
    }

    const handler: IRefReducer = this.getHandler(space, vertex)
    const sourceVertexes: IVertex[] = Pathfinder.getInVertexes(graph, vertex)
    const sources: IDataRef[] = Extractor.filter(
      ({type, value}: IAnyValue) => type === 'DATA_REF' && sourceVertexes.includes(value.pointer.value.vertex),
      space,
    )

    if (sources.length === sourceVertexes.length) {
      this._process(cxt, space, graph, vertex, () => handler(...sources))
    }
  }

  private static _impactGroup(space: ISpace, ...targets: IImpactTarget[]): void {
    const cxt: ICxt = this.getContext(space)

    cxt.before()
    targets.map(target => this._impactSingle(space, target))
    cxt.after()
  }

  static getHandler(space: ISpace, vertex: IVertex): IRefReducer {
    const handlerRef: IHandlerRef | undefined = Extractor.findHandlerRefByVertex(space, vertex) || this.findDefaultHandlerRef(space)

    if (!handlerRef) {
      throw new Error('HANDLER is required')
    }

    return handlerRef.value.handler.value
  }

  static findDefaultHandlerRef(space: ISpace): IHandlerRef | undefined {
    return Extractor.find(
      ({type, value}: IAnyValue) => type === 'HANDLER_REF'
        && value.pointer.value.vertex === undefined
        && value.pointer.value.edge === undefined,
      space,
    )
  }

  static impact(space: ISpace, sync: boolean, ...targets: IImpactTarget[]) {

    const cxt: ICxt = this.attachContext(space, sync)

    this._impactGroup(space, ...targets)

    return sync
      ? space
      : cxt.dp.promise

  }

  static attachContext(space: ISpace, sync: boolean): ICxt {

    if (Extractor.findByType('CXT', space)) {
      throw new Error('There\'s no place for yet another one execution context')
    }

    const dp: IDecomposedPromise = getDecomposedPromise()
    const cxt = {
      sync,
      queue: 0,
      override: false,
      dp,
      before() {
        this.queue++
      },
      after() {
        this.queue--
        if (this.queue === 0) {
          dp.resolve(space)
        }
      },
    }

    Injector.unshift(space, {
      type: 'CXT',
      value: cxt,
    })

    return cxt

  }

  static getGraph = requireByType.bind(null, 'GRAPH') as (space: ISpace) => IGraph

  static getContext = requireByType.bind(null, 'CXT') as (space: ISpace) => ICxt

  static parser({graph, handler}: INetProcessorParams) {

    // TODO implement handlers parser
    const handlers = [{
      type: 'HANDLER_REF',
      value: {
        pointer: {
          type: 'POINTER',
          value: {
            graph,
          },
        },
        handler: {
          type: 'HANDLER',
          value: handler,
        },
      },
    }]

    const space: ISpace = {
      type: 'SPACE',
      value: [{
        type: 'GRAPH',
        value: graph,
      }, ...handlers],
    }

    return space
  }

}
