/* eslint-disable @typescript-eslint/no-var-requires */
const {
  Graph
} = require('../../../target/bundle/protopipe.js')
// const {Graph} = require('../../../target/es5/index.js')

describe('index', () => {
  it('exposes lib inners', () => {
    expect(Graph).toEqual(expect.any(Function))
  })

  it('works after uglify', () => {
    const vertexes = []
    const edges = []
    const features = {}
    const incidentor = {
      type: 'EDGE_LIST_INCDR',
      value: {},
    }
    const graphParams = {
      vertexes,
      edges,
      incidentor,
      features,
    }
    const graph = new Graph(graphParams)

    expect(graph).toBeInstanceOf(Graph)
    expect(graph.vertexes).toBe(vertexes)
    expect(graph.edges).toBe(edges)
    expect(graph.incidentor).toBe(incidentor)
    expect(graph.features).toBe(features)
  })
})