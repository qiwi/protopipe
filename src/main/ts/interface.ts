export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type IData = IAny

export type ISequence = Array<IVertex>

export type IMeta = {
  sequence: ISequence
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

export type IHandler = (input: IInput) => IOutput

export type IProtopipe = {
  params: any
  graph: IGraph
  move: () => any
  transitions: [{
    condition: (sequence: ISequence) => boolean
    handler: IHandler
  }]
}

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

export interface IPipeline {
  graph: IGraph
  params: IPipelineParams
  push(pipe: IPipe): this
  exec(): IData
}
