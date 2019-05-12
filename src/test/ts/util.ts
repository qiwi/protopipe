import {
  getGraph, getState
} from '../../main/ts/util'

import {
  Graph,
  IGraph,
  IGraphParams,
} from '../../main/ts/graph'

import {
  IAnySource,
  IEdge,
  IEdgeListIncidentor,
  IGraphFeatures,
  IGraphSource,
  ISpace,
  IVertex
} from '../../main/ts/interface'

describe('util', () => {
  describe('getGraph', () => {
    it('extracts the first IGraphSource from sources', () => {
      const vertexes: Array<IVertex> = []
      const edges: Array<IEdge> = []
      const features: IGraphFeatures = {}
      const incidentor: IEdgeListIncidentor = {
        type: 'EDGE_LIST',
        representation: {},
      }
      const graphParams: IGraphParams = {
        vertexes,
        edges,
        incidentor,
        features,
      }
      const graph: IGraph = new Graph(graphParams)
      const sources: Array<IAnySource> = [{
        type: 'GRAPH',
        value: graph
      }]

      const graphSource: IGraphSource | undefined = getGraph(...sources)

      expect(graphSource).toBe(sources[0])
    })

    it('returns undefined if not found', () => {
      const sources: Array<IAnySource> = []
      expect(getGraph(...sources)).toBeUndefined()
    })
  })

  describe('getState', () => {
    it('extracts the first ISpace from sources', () => {
      const sources: Array<IAnySource> = [{
        type: 'STATE',
        value: []
      }]
      const spaceSource: ISpace | undefined = getState(...sources)

      expect(spaceSource).toBe(sources[0])
    })

    it('returns undefined if not found', () => {
      const sources: Array<IAnySource> = []
      expect(getState(...sources)).toBeUndefined()
    })
  })
})
