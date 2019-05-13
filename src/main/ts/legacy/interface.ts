/** @module protopipe */

export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type IPath = Array<IVertex | IPathArray>

interface IPathArray extends Array<IPath> {}

export type ITypedValue<T, V> = {
  type: T,
  value: V
}

export type IStreamValue = {
  meta: IMeta,
  data: IAny
}

export type IAnySource = ITypedValue<IAny, IAny>
export type IOptSource = ITypedValue<'OPTION', IAnyMap>
export type IStreamSource = ITypedValue<'STREAM', IStreamValue>
export type IGraphSource = ITypedValue<'GRAPH', IGraph>
export type IMetaSource = ITypedValue<'META', IMeta>
export type IEventSource = ITypedValue<'EVENT', IEvent>


export type IActor = (...sources: Array<IStreamSource | IOptSource>) => IStreamSource[]
export type IWalker = (...sources: Array<IMetaSource | IGraphSource>) => IMetaSource[]
export type IResolver = (...sources: Array<IMetaSource | IStreamSource>) => IStreamSource[]

export type IEvent = {
  id: string,
  name: string,
  type: string,
  timestamp: number,
  snapshot: ISnapshot
}

export type IRef = IEdgeRef | IEdgeRef

export type IEdgeRef = ITypedValue<'EDGE_REF', IAny>

// Snapshot is a data atom
export type ISnapshot = {
  type: 'SNAPSHOT'
  meta: {
    refs: IRef[]
  }
  value: IAny
}
export type ISpace = {
  type: 'SPACE',
  value: Array<ISnapshot>
}




export type IProcessor = (...sources: Array<IGraphSource | ISpace>) => ISpace

export interface IStack {
  get(index: number): any
  push(...items: Array<any>): any
  pop(): any
  shift(): any
  size(): number
  filter(cb: (item: any) => boolean): Array<any>
  last(): any,
  first(): any,
}

export type IData = IAny

export type ISequence<N, T> = {
  type: N,
  data: T
}

export type IVertexSequence = ISequence<'VERTEX_SEQUENCE', Array<IVertex>>
export type IEdgeSequence = ISequence<'EDGE_SEQUENCE', Array<IVertex>>

export type ITraverserInput = {
  sequence: ISequence<any, any>,
  graph: IGraph,
  stack?: IStack // events stack, data stack — whatever
}

export type ITraverserOutput = Array<ISequence<any, any>> | null

export type ITraverser = (input: ITraverserInput) => ITraverserOutput

export type INil = null | undefined

export type IMode = 'sync' | 'async' | undefined | null

export type IMeta = {
  sequence: ISequence<any, any>
  mode?: IMode,
  [key: string]: IAny
}

export type IOpts = IAny

export type IInput = {
  data: IData
  meta: IMeta
  opts: IOpts
}

export type IOutput = {
  data: IData
  meta?: IMeta
  opts?: IOpts,
  stack?: IStack
}

export type IHandler = (input: Array<IInput>) => IOutput | Promise<IOutput>

export type IPipe = {
  handler: IHandler
}

export type IPipelineParams = {}

export type IVertexId = string

export type IVertex = string

export type IEdge = string

export type IArrow = {
  head: IVertex
  tail: IVertex
}

export type IGraphParams = {
  vertexes: Array<IVertex>,
  edges: Array<IEdge>,
  incidentor: IGraphIncidentor,
  features?: IGraphFeatures
}

export type IGraph = IGraphParams & {
  features?: IGraphFeatures // TODO make required
}

export type IGraphIncidentorType = string

export type IGraphRepresentation = any

export type IGraphFeatures = {
  [key: string]: string | number | boolean | null
}

export type IGraphFeatureDetector = (graph: IGraph) => IGraphFeatures

export interface IGraphOperationContext {
  [key: string]: IAny
}

export type IGraphOperation = (context: any) => any

export type IGraphOperationMap = {
  [key: string]: IGraphOperation
}

export interface IGraphOperator {
  graph: IGraph,
  operations?: IGraphOperationMap,
  features?: IGraphFeatures,
  [key: string]: any
}

export type IGraphIncidentor = {
  type: IGraphIncidentorType,
  value: IGraphRepresentation
}

export type IEdgeListIncidentor = IGraphIncidentor & {
  type: 'EDGE_LIST_INCDR',
  value: {
    [key: string]: [IVertex, IVertex]
  }
}

export interface IProtopipeParams {
  graph: IGraph
  handler?: IHandler,
  traverser?: ITraverser,
  executor?: IExecutor
  parser?: IParser
  [key: string]: IAny
}

export interface IProtopipeParamsNormalized extends IProtopipeParams {
  executor: IExecutor,
  handler: IHandler,
  traverser: ITraverser
}

export interface IExecutorContext extends IProtopipeParamsNormalized {
  input: IInput
}

export type IExecutorOutput = IOutput | INil | Promise<IOutput | INil>

export type IExecutor = (executorContext: IExecutorContext) => IExecutorOutput

export interface IProtopipe extends IProtopipeParamsNormalized {
  process: (input: IInput) => IExecutorOutput
}

export type IParser = (...params: Array<IAny>) => IProtopipeParamsNormalized
