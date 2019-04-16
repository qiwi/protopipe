import {
  IEdge,
  IGraphParams,
  IGraph,
  IVertex,
  IGraphIncidentor,
} from './interface'

export default class Graph implements IGraph {

  edges: Array<IEdge>
  vertexes: Array<IVertex>
  incidentor: IGraphIncidentor

  constructor(params: IGraphParams) {
    const {vertexes, edges, incidentor} = params

    this.vertexes = vertexes
    this.edges = edges
    this.incidentor = incidentor
  }

}

export {
  Graph,
  IGraph,
  IGraphParams,
}
