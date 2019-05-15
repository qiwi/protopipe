import {
  Graph,
  Pathfinder,
} from '../../../../main/ts'

describe('Pathfinder', () => {

  const graph = new Graph({
    edges: ['AB', 'AC', 'BC', 'BD', 'CD', 'AD'],
    vertexes: ['A', 'B', 'C', 'D'],
    incidentor: {
      type: 'EDGE_LIST_INCDR',
      value: {
        'AB': ['A', 'B'],
        'AC': ['A', 'C'],
        'BC': ['B', 'C'],
        'BD': ['B', 'D'],
        'CD': ['C', 'D'],
        'AD': ['A', 'D'],
      },
    },
  })

  describe('constructor', () => {
    it('returns proper instance', () => {
      const pathfinder = new Pathfinder(graph)

      expect(pathfinder).toBeInstanceOf(Pathfinder)
    })
  })

  describe('proto', () => {
    const pathfinder = new Pathfinder(graph)

    describe('#getDegree', () => {
      it('returns degree of vertex', () => {
        expect(pathfinder.getDegree('A')).toBe(3)
      })
    })

    describe('#getInDegree', () => {
      it('returns in-degree of vertex', () => {
        expect(pathfinder.getInDegree('A')).toBe(0)
        expect(pathfinder.getInDegree('B')).toBe(1)
      })
    })

    describe('#getOutDegree', () => {
      it('returns out-degree of vertex', () => {
        expect(pathfinder.getOutDegree('A')).toBe(3)
        expect(pathfinder.getOutDegree('B')).toBe(2)
      })
    })

    describe('#getEdgesOf', () => {
      it('returns edges of vertex', () => {
        expect(pathfinder.getEdgesOf('A')).toEqual(['AB', 'AC', 'AD'])
        expect(pathfinder.getEdgesOf('B')).toEqual(['AB', 'BC', 'BD'])
      })
    })

    describe('#getInEdgesOf', () => {
      it('returns in-edges of vertex', () => {
        expect(pathfinder.getInEdgesOf('A')).toEqual([])
        expect(pathfinder.getInEdgesOf('B')).toEqual(['AB'])
      })
    })

    describe('#getOutEdgesOf', () => {
      it('returns out-edges of vertex', () => {
        expect(pathfinder.getOutEdgesOf('A')).toEqual(['AB', 'AC', 'AD'])
        expect(pathfinder.getOutEdgesOf('B')).toEqual(['BC', 'BD'])
      })
    })
  })

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

    describe('#getEdgesOf', () => {
      it('returns edges of vertex', () => {
        expect(Pathfinder.getEdgesOf(graph, 'A')).toEqual(['AB', 'AC', 'AD'])
        expect(Pathfinder.getEdgesOf(graph, 'B')).toEqual(['AB', 'BC', 'BD'])
      })
    })

    describe('#getInEdgesOf', () => {
      it('returns in-edges of vertex', () => {
        expect(Pathfinder.getInEdgesOf(graph, 'A')).toEqual([])
        expect(Pathfinder.getInEdgesOf(graph, 'B')).toEqual(['AB'])
      })
    })

    describe('#getOutEdgesOf', () => {
      it('returns out-edges of vertex', () => {
        expect(Pathfinder.getOutEdgesOf(graph, 'A')).toEqual(['AB', 'AC', 'AD'])
        expect(Pathfinder.getOutEdgesOf(graph, 'B')).toEqual(['BC', 'BD'])
      })
    })
  })
})
