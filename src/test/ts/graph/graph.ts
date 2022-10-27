import {
  Graph,
  IEdge,
  IEdgeListIncidentor,
  IGraph,
  IGraphFeatures,
  IGraphParams,
  IVertex,
} from '../../../main/ts/'

describe('graph', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const vertexes: Array<IVertex> = []
      const edges: Array<IEdge> = []
      const features: IGraphFeatures = {}
      const incidentor: IEdgeListIncidentor = {
        type: 'EDGE_LIST_INCDR',
        value: {},
      }
      const graphParams: IGraphParams = {
        vertexes,
        edges,
        incidentor,
        features,
      }
      const graph: IGraph = new Graph(graphParams)

      expect(graph).toBeInstanceOf(Graph)
      expect(graph.vertexes).toBe(vertexes)
      expect(graph.edges).toBe(edges)
      expect(graph.incidentor).toBe(incidentor)
      expect(graph.features).toBe(features)
    })
  })
})
