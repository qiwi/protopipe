export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type IData = IAny

export type ISequence = Array<IVertex>

export type INil = null | undefined

export type IMode = 'sync' | 'async' | undefined | null

export type IMeta = {
  sequence: ISequence
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
  opts?: IOpts
}

export type IHandler = (input: IInput) => IOutput | Promise<IOutput>

export type IPipe = {
  handler: IHandler
}

export type IPipelineParams = {}

export type IVertexId = string

export type IVertex = string

export type IEdge = [IVertexId, IVertexId]

export type IArrow = {
  head: IVertex
  tail: IVertex
}

export type IGraphParams = {
  vertexes: Array<IVertex>
  arrows: Array<IArrow>
}

export interface IGraph {
  vertexes: Array<IVertex>
  arrows: Array<IArrow>
}

export type ITraverserInput = IInput & {
  graph: IGraph
}

export type ITraverserOutput = {
  meta: IMeta,
  data?: IData,
  opts?: IOpts
}

export type ITraverser = (input: ITraverserInput) => ITraverserOutput | null

export type IProtopipeOpts = {
  graph: IGraph
  handler: IHandler,
  traverser: ITraverser,
  executor?: IExecutor
}

export type IExecutorContext = IProtopipeOpts & IInput

export type IExecutorOutput = IOutput | INil | Promise<IOutput | INil>

export type IExecutor = (executorContext: IExecutorContext) => IExecutorOutput

export interface IProtopipe {
  graph: IGraph
  handler: IHandler,
  traverser: ITraverser,
  executor: IExecutor,
  process: (input: IInput) => IExecutorOutput
}
