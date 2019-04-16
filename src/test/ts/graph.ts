import {
  Graph,
  IGraph,
  IGraphParams,
} from '../../main/ts/graph'

import {
  IVertex,
  IEdge,
  IEdgeListIncidentor,
} from '../../main/ts/interface'

describe('graph', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const vertexes: Array<IVertex> = []
      const edges: Array<IEdge> = []
      const incidentor: IEdgeListIncidentor = {
        type: 'EDGE_LIST',
        representation: [],
      }
      const graphParams: IGraphParams = {
        vertexes,
        edges,
        incidentor,
      }
      const graph: IGraph = new Graph(graphParams)

      expect(graph).toBeInstanceOf(Graph)
      expect(graph.vertexes).toBe(vertexes)
      expect(graph.edges).toBe(edges)
      expect(graph.incidentor).toBe(incidentor)
    })
  })
})
