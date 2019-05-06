/** @module protopipe */

export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export interface IStack {
  get(index: number): any
  push(...items: Array<any>): any
  pop(): any
  shift(): any
  size(): number
  filter(cb: (item: any) => boolean): Array<any>
  last(): any
}

export type IData = IAny

export type IPath = Array<IVertex | IPathArray>

interface IPathArray extends Array<IPath> {}

export type ISequence<N, T> = {
  type: N,
  data: T
}

export type IVertexSequence = ISequence<'VERTEX_SEQUENCE', Array<IVertex>>
export type IEdgeSequence = ISequence<'EDGE_SEQUENCE', Array<IVertex>>

export type ITraverserInput = {
  sequence: ISequence<any, any>,
  graph: IGraph
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

export type IHandler = (input: IInput) => IOutput | Promise<IOutput>

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
  representation: IGraphRepresentation
}

export type IEdgeListIncidentor = IGraphIncidentor & {
  type: 'EDGE_LIST',
  representation: {
    [key: string]: [IVertex, IVertex]
  }
}

export interface IProtopipeOpts {
  graph: IGraph
  handler?: IHandler,
  traverser?: ITraverser,
  executor?: IExecutor
  parser?: IParser
  [key: string]: IAny
}

export interface IProtopipeOptsNormalized extends IProtopipeOpts {
  executor: IExecutor
}

export interface IExecutorContext extends IProtopipeOpts {
  input: IInput
}

export type IExecutorOutput = IOutput | INil | Promise<IOutput | INil>

export type IExecutor = (executorContext: IExecutorContext) => IExecutorOutput

export interface IProtopipe extends IProtopipeOptsNormalized {
  process: (input: IInput) => IExecutorOutput
}

export type IParser = (...params: Array<IAny>) => IProtopipeOptsNormalized
