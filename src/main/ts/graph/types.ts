/** @module protopipe */

import {
  IConstructor,
  IAny,
  ITypedValue,
} from '../types'

export type IGraphFeatures = {
  [key: string]: string | number | boolean | null
}

export type IGraphIncidentorType = string

export type IGraphRepresentation = any

export type IEdgeListIncidentor = ITypedValue<{
  [key: string]: [IVertex, IVertex]
}, 'EDGE_LIST_INCDR'>

export type IGraphIncidentor = ITypedValue<IGraphRepresentation, IGraphIncidentorType>

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

export type IGraphOperation = (...params: IAny[]) => IAny

export type IGraphOperator = {
  [key: string]: IGraphOperation
} & {
  graph: IGraph
}

export type IGraphStaticOperation = (graph: IGraph, ...params: IAny[]) => IAny

export interface IGraphStaticOperator extends IConstructor<IGraphOperator> {
  // [key: string]: IGraphStaticOperation
}

export type IPointer = {
  graph: IGraph,
  vertex?: IVertex,
  edge?: IEdge
}
