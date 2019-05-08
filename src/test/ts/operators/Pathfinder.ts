import {Pathfinder} from '../../../main/ts/operators/Pathfinder'
import {Graph} from '../../../main/ts/graph'

describe('Pathfinder', () => {

  const graph = new Graph({
    edges: ['AB', 'AC', 'BC', 'BD', 'CD', 'AD'],
    vertexes: ['A', 'B', 'C', 'D'],
    incidentor: {
      type: 'EDGE_LIST',
      representation: {
        'AB': ['A', 'B'],
        'AC': ['A', 'C'],
        'BC': ['B', 'C'],
        'BD': ['B', 'D'],
        'CD': ['C', 'D'],
        'AD': ['A', 'D']
      },
    },
  })

  describe('constructor', () => {
    it('returns proper instance', () => {
      const pathfinder = new Pathfinder(graph)

      expect(pathfinder).toBeInstanceOf(Pathfinder)
    })
  })

  // describe('proto', () => {})
  describe('static', () => {
    describe('#getDegree', () => {
      it('returns degree of vertex', () => {
        expect(Pathfinder.getDegree(graph, 'A')).toBe(3)
      })
    })

    describe('#getInDegree', () => {
      it('returns in-degree of vertex', () => {
        expect(Pathfinder.getInDegree(graph, 'A')).toBe(0)
        expect(Pathfinder.getInDegree(graph, 'B')).toBe(1)
      })
    })

    describe('#getOutDegree', () => {
      it('returns out-degree of vertex', () => {
        expect(Pathfinder.getOutDegree(graph, 'A')).toBe(3)
        expect(Pathfinder.getOutDegree(graph, 'B')).toBe(2)
      })
    })
  })
})
