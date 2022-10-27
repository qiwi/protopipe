/** @module protopipe */

import {
  IEdge,
  IGraph,
  IGraphFeatures,
  IGraphIncidentor,
  IGraphParams,
  IVertex,
} from './types'

export * from './types'
export * from './operator/index'

/**
 * Basic Graph constructor. Stores vertexes, edges collections, features and incidentor.
 * @class Graph
 */
export class Graph implements IGraph {

  edges: Array<IEdge>
  vertexes: Array<IVertex>
  incidentor: IGraphIncidentor
  features: IGraphFeatures

  constructor(params: IGraphParams) {
    const {vertexes, edges, incidentor, features} = params

    this.vertexes = vertexes
    this.edges = edges
    this.incidentor = incidentor
    this.features = features || Graph.featureDetector(params)
  }

  static featureDetector(graph: IGraph | IGraphParams): IGraphFeatures {
    return {
      empty: graph.edges.length === 0,
    }
  }

}

export default Graph
