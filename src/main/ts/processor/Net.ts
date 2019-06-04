import {
  IAny,
  staticImplements,
  IPredicate,
} from '../types'
import {
  IProcessorStaticOperator,
} from './types'
import {
  ISpaceElement,
  RefOperator,
  ISpace,
  Space,
  IId,
  IReference,
} from '../space/'
import {
  IEdge,
  IGraph,
  IPointer,
  IVertex,
  Pathfinder,
} from '../graph'
import {
  IDecomposedPromise,
  promisify,
  getDecomposedPromise,
  genId,
} from '../util'
import {
  Stack
} from '../stack'

export type ISpaceReducerMap = {
  [key: string]: ISpaceReducer
}

export type IHandlerParamDeclaration = ISpaceReducer | {
  graph?: ISpaceReducer,
  vertexes?: ISpaceReducerMap,
  edges?: ISpaceReducerMap
}

export type INetProcessorParams = {
  graph: IGraph,
  handler: IHandlerParamDeclaration
}

export type ICxt = {
  queue: number,
  sync: boolean,
  override: boolean,
  dp: IDecomposedPromise,
  before: Function
  after: Function
}

export type IImpactTarget = IVertex | [IVertex, IAny]

export type INormalizedImpactTarget = {
  vertex: IVertex,
  data?: IAny
}

export type ISpaceReducer = (space: ISpace) => IAny

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

  private static _process(cxt: ICxt, space: ISpace, graph: IGraph, vertex: IVertex, fn: Function) {
    cxt.before()

    const targetVetexes: IVertex[] = Pathfinder.getOutVertexes(graph, vertex)
    const processResult = (res: IAny) => {
      const anchor = this.getAnchor(space, graph, vertex)
      const dataRef = this.getLinkedData(space, anchor.id)
      const data = RefOperator.upsert(space, 'DATA', res, dataRef ? ({id}) => dataRef.id === id : undefined)

      if (!dataRef) {
        RefOperator.link(space, anchor.id, data.id)
      }

      this._impactGroup(space, ...targetVetexes)
      cxt.after()
    }

    if (cxt.sync) {
      processResult(fn())

    }
    else {
      promisify(fn())
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
      return
    }

    const handler: ISpaceReducer = this.getHandler(space, vertex)
    const sourceVertexes: IVertex[] = Pathfinder.getInVertexes(graph, vertex)
    const anchors: IAnchor[] = sourceVertexes.map(vertex => this.getAnchor(space, graph, vertex))
    const anchorsIds: IId[] = anchors.map(({id}) => id)
    const refs: IReference[] = RefOperator.getRefs(space, anchorsIds)
    const sources = refs
      .map(({value: {to}}) => this.getData(space, undefined, to))
      .filter(elt => elt !== undefined) as IData[]

    if (sources.length === sourceVertexes.length) {
      const graphElt = this.requireElt('GRAPH', space)
      const _space = new Space(anchor, ...anchors, graphElt, ...refs, ...sources)
      this._process(cxt, space, graph, vertex, () => handler(_space))
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
    const typePredicate: IPredicate = ({type: _type}) => type === _type

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

  static getHandler(space: ISpace, vertex: IVertex): ISpaceReducer {
    const handler = this.getElt('HANDLER', space, vertex) || this.requireElt('HANDLER', space)

    return handler.value
  }

  static getContext(space: ISpace): ICxt {
    return this.requireElt('CXT', space).value
  }

  static getGraph(space: ISpace): IGraph {
    return this.requireElt('GRAPH', space).value
  }

  static getData(space: ISpace, vertex?: IVertex, id?: IId): ISpaceElement | undefined {
    if (id) {
      return RefOperator.get(space, id, 'DATA')
    }

    return this.getElt('DATA', space, vertex)
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

    space.value.unshift({
      id: genId(),
      type: 'CXT',
      value: cxt,
    })

    return cxt

  }

  static parser({graph, handler}: INetProcessorParams): ISpace {
    const space: ISpace = {
      type: 'SPACE',
      value: new Stack(),
    }

    RefOperator.create(space, 'GRAPH', graph)

    this.injectHandlers(space, handler, graph)

    return space
  }

  static injectHandlers(space: ISpace, handler: IHandlerParamDeclaration, graph: IGraph): void {
    const attachHandler = ({vertex, edge}: {vertex?: IVertex, edge?: IEdge}, handler: ISpaceReducer): void => {
      const anchor = this.getAnchor(space, graph, vertex, edge)
      const _handler: IHandler = RefOperator.create(space, 'HANDLER', handler)

      RefOperator.link(space, anchor.id, _handler.id)
    }
    const createHandlerRefsByMap = (type: 'vertex' | 'edge', map: ISpaceReducerMap = {}) =>
      Object.keys(map).forEach(key => attachHandler({[type]: key}, map[key]))

    if (typeof handler === 'function') {
      attachHandler({}, handler)
    }
    else {
      if (handler.graph) {
        attachHandler({}, handler.graph)
      }

      createHandlerRefsByMap('edge', handler.edges)
      createHandlerRefsByMap('vertex', handler.vertexes)

    }
  }

}
