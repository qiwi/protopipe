import { ITypedValue } from '../types'

export type IGraphFeatures = {
  [key: string]: string | number | boolean | null
}

export type IGraphIncidentorType = string

export type IGraphRepresentation = any

export type IEdgeListIncidentor = ITypedValue<'EDGE_LIST_INCDR', {
  [key: string]: [IVertex, IVertex]
}>

export type IGraphIncidentor = ITypedValue<IGraphIncidentorType, IGraphRepresentation>

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
