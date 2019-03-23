export type IAny = any

export type IAnyMap = {
  [key: string]: IAny
}

export type IData = IAny

export type IMeta = IAnyMap

export type IOpts = IAny

export type IInput = {
  data: IData,
  meta: IMeta,
  opts: IOpts
}

export type IOutput = {
  data: IData,
  meta?: IMeta
}

export type IHandler = (input: IInput) => IOutput

export type IPipe = {
  handler: IHandler
}

export type IPipelineParams = {}

export type IVertexId = string

export type IVertex = {
  id: IVertexId,
  handler: IHandler
}

export type IGraph = {
  vertexes: {
    [key: string]: IVertex
  }
}

export interface IPipeline {
  graph: IGraph
  params: IPipelineParams
  push(pipe: IPipe): this
  exec(): IData
}
