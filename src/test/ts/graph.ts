import {
  Graph,
  IGraph,
  IGraphParams,
} from '../../main/ts/graph'

import {
  IArrow,
  IVertex,
} from '../../main/ts/interface'

describe('graph', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const vertexes: Array<IVertex> = []
      const arrows: Array<IArrow> = []
      const graphParams: IGraphParams = {
        vertexes,
        arrows,
      }
      const graph: IGraph = new Graph(graphParams)

      expect(graph).toBeInstanceOf(Graph)
      expect(graph.vertexes).toBe(vertexes)
      expect(graph.arrows).toBe(arrows)
    })
  })
})
