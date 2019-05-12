export type IGraphFeatures = {
  [key: string]: string | number | boolean | null
}

export type IGraphIncidentorType = string

export type IGraphRepresentation = any

export type IGraphIncidentor = {
  type: IGraphIncidentorType,
  representation: IGraphRepresentation
}

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
