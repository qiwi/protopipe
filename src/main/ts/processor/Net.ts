import {
  staticImplements,
  IAny, IPredicate,
} from '../types'
import {
  IProcessorStaticOperator
} from './types'
import {
  ISpaceElement,
  RefOperator,
  ISpace,
  IReference, IId,
  /*Extractor,
  Injector,
  IDataRef,
  IAnyValue,
  IRefReducer,
  IHandlerRef,*/
} from '../space/'
import {
  IEdge,
  IGraph,
  IPointer,
  IVertex,
  Pathfinder,
} from '../graph'
import {IDecomposedPromise, promisify, getDecomposedPromise} from '../util'

type IRefReducerMap = {
  [key: string]: IRefReducer
}

export type IHandlerParamDeclaration = IRefReducer | {
  graph?: IRefReducer,
  vertexes?: IRefReducerMap,
  edges?: IRefReducerMap
}

export type INetProcessorParams = {
  graph: IGraph,
  handler: IHandlerParamDeclaration
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
  // const item: IReference | undefined = Extractor.findByType(type, space)
  const item: ISpaceElement | undefined = RefOperator.find(({type: _type}) => type === _type, space)

  if (!item) {
    throw new Error(`${type} is required`)
  }

  return item && item.value
}


export type IRefReducer = (...refs: Array<ISpaceElement>) => IAny

export interface IAnchor extends ISpaceElement {
  type: 'ANCHOR',
  value: IPointer
}

export interface IData extends ISpaceElement {
  type: 'DATA',
  value: IAny
}

export interface IHandler extends ISpaceElement {
  type: 'HANDLER',
  value: Function
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

  /*private static readOrCreate(predicate: IPredicate, space: ISpace, value): ISpaceElement {

  }*/

  static getAnchor(space: ISpace, graph: IGraph, vertex?: IVertex, edge?: IEdge): IAnchor {
    return RefOperator.find(item =>
      item.type === 'ANCHOR'
      && graph === item.value.graph
      && (vertex ? item.value.vertex === vertex : item.value.vertex === undefined)
      && (edge ? item.value.edge === edge : item.value.edge === undefined)
    , space) || RefOperator.create(space, 'ANCHOR', {graph, vertex, edge})
  }

  static getLinkedData(space: ISpace, anchorId: IId) {
    return RefOperator.getRels(space, anchorId).filter(({type}) => type === 'DATA')[0]
  }

  private static _process(cxt: ICxt, space: ISpace, graph: IGraph, vertex: IVertex, handler: IRefReducer) {
    cxt.before()

    const targetVetexes: IVertex[] = Pathfinder.getOutVertexes(graph, vertex)
    const processResult = (res: IAny) => {
      const anchor = this.getAnchor(space, graph, vertex)
      const dataRef = this.getLinkedData(space, anchor.id)
      const data = RefOperator.upsert(space, 'DATA', res, dataRef ? ({id}) => dataRef.id === id : null)

      if (!dataRef) {
        RefOperator.link(space, anchor.id, data.id)
      }

      // Injector.upsertDataRef(space, res, graph, vertex)
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
    const anchor = this.getAnchor(space, graph, vertex)
    const dataRef = this.getLinkedData(space, anchor.id)

    if (!cxt.override && dataRef) {
    // if (!cxt.override && Extractor.findDataRefByVertex(space, vertex)) {
      return
    }

    const handler: IRefReducer = this.getHandler(space, vertex)
    const sourceVertexes: IVertex[] = Pathfinder.getInVertexes(graph, vertex)
    const anchors: IAnchor[] = sourceVertexes.map(vertex => this.getAnchor(space, graph, vertex))
    const anchorsIds: IId[] = anchors.map(({id}) => id)
    const sources: IData[] = RefOperator.read(({type, id}) =>
      type === 'DATA'
      && !!RefOperator.find(({value: {from, to}}) => to === id && anchorsIds.includes(from), space)
    , space)
    /*const sources: IDataRef[] = Extractor.filter(
      ({type, value}: IAnyValue) => type === 'DATA_REF' && sourceVertexes.includes(value.pointer.value.vertex),
      space,
    )*/

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

  static getRelsByVertex(space: ISpace, vertex: IVertex): ISpaceElement[] {
    const graph: IGraph = this.getGraph(space)
    const anchor = this.getAnchor(space, graph, vertex)

    return RefOperator.getRels(space, anchor.id)
  }

  static getElt(type: string, space: ISpace, vertex?: IVertex): ISpaceElement | undefined {
    const typePredicate = ({type: _type}) => type === _type

    if (vertex) {
      return this.getRelsByVertex(space, vertex).find(typePredicate)
    }

    return RefOperator.find(typePredicate, space)
  }

  static requireElt(type: string, space: ISpace, vertex?: IVertex) {
    const elt = this.getElt(type, space, vertex)

    if (!elt) {
      throw new Error(`${type} is required`)
    }

    return elt
  }

  static getHandler(space: ISpace, vertex: IVertex): IRefReducer {
    const handler =  this.getElt('HANDLER', space, vertex) || this.requireElt('HANDLER', space)

    return handler.value
  }

  static getContext(space: ISpace): ICxt {
    return this.requireElt('CXT', space).value
  }

  static getGraph(space: ISpace): IGraph {
    return this.requireElt('GRAPH', space).value
  }

  static impact(space: ISpace, sync: boolean, ...targets: IImpactTarget[]) {

    const cxt: ICxt = this.attachContext(space, sync)

    this._impactGroup(space, ...targets)

    return sync
      ? space
      : cxt.dp.promise

  }

  static attachContext(space: ISpace, sync: boolean): ICxt {

    if (this.getElt('CXT', space)) {
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

    space.value.unshift( {
      id: '' + Math.random(),
      type: 'CXT',
      value: cxt
    })

    return cxt

  }

  /*static getGraph = requireByType.bind(null, 'GRAPH') as (space: ISpace) => IGraph

  static getContext = requireByType.bind(null, 'CXT') as (space: ISpace) => ICxt*/

  static parser({graph, handler}: INetProcessorParams) {

    const handlers = this.parseHandlers(handler, graph)
    return {
      type: 'SPACE',
      value: [{
        id: '' + Math.random(),
        type: 'GRAPH',
        value: graph,
      }, ...handlers],
    }
  }

  static parseHandlers(handler: IHandlerParamDeclaration, graph: IGraph): IHandlerRef[] {
    const handlers: IHandlerRef[] = []
    const createHandlerRef = (pointer: {graph: IGraph, vertex?: IVertex, edge?: IEdge}, handler: IRefReducer): IHandlerRef => ({
      type: 'HANDLER_REF',
      value: {
        pointer: {
          type: 'POINTER',
          value: pointer,
        },
        handler: {
          type: 'HANDLER',
          value: handler,
        },
      },
    })
    const createHandlerRefsByMap = (type: 'vertex' | 'edge', map: IRefReducerMap, graph: IGraph) =>
      Object.keys(map).map(key =>
        createHandlerRef({graph, [type]: key}, map[key]))

    if (typeof handler === 'function') {
      handlers.push(createHandlerRef({graph}, handler))
    }
    else {
      if (handler.graph) {
        handlers.push(createHandlerRef({graph}, handler.graph))
      }

      handlers.push(...createHandlerRefsByMap('edge', handler.edges || {}, graph))
      handlers.push(...createHandlerRefsByMap('vertex', handler.vertexes || {}, graph))

    }

    return handlers
  }

}
