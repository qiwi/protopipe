import executor from '../../main/ts/executor'
import Graph from '../../main/ts/graph'
import {
  IMode,
  IInput,
  IOutput,
  ITraverserInput,
  ITraverserOutput,
  IHandler,
  IVertex,
} from '../../main/ts/interface'

describe('executor', () => {
  const input: IInput = {data: 'foo', meta: {sequence: {type: 'chain', data: []}}, opts: {}}
  const graph = new Graph({
    edges: ['AB', 'BC'],
    vertexes: ['A', 'B', 'C'],
    incidentor: {
      type: 'EDGE_LIST',
      representation: {
        'AB': ['A', 'B'],
        'BC': ['B', 'C'],
      },
    },
  })
  const handler = ({data}: IInput): IOutput => ({data: {count: (data.count + 1 || 0)}})
  const traverser = ({sequence, graph}: ITraverserInput): ITraverserOutput | null => {
    if (sequence.data.length === 0) {
      return [{type: 'chain', data: ['A']}]
    }

    const representation: Array<[IVertex, IVertex]> = Object.values(graph.incidentor.representation)
    const prev = sequence.data[sequence.data.length - 1]
    const next: IVertex | null = (representation.find(([head]) => head === prev) || [])[1] || null

    if (next === null) {
      return null
    }

    return [{type: 'chain', data: [...sequence.data, next]}]
  }

  describe('SYNC', () => {
    it('transits data from `source` to `target` vertex', () => {
      const res = executor({graph, handler, traverser, input})

      expect(res).toEqual({
        opts: {},
        data: {
          count: 2,
        },
        meta: {
          sequence: {
            type: 'chain',
            data: [
              'A',
              'B',
              'C',
            ],
          },
        },
        stack: {
          _storage: [{
            data: 'foo',
            meta: {sequence: {type: 'chain', data: []}},
            'opts': {},
          }, {
            data: {count: 0},
            meta: {sequence: {type: 'chain', data: ['A']}},
            opts: {},
          }, {
            data: {count: 1},
            meta: {sequence: {type: 'chain', data: ['A', 'B']}},
            opts: {},
          }, {
            data: {count: 2},
            meta: {sequence: {type: 'chain', data: ['A', 'B', 'C']}},
            opts: {},
          }],
        },
      })
    })
  })

  describe('ASYNC', () => {
    it('transits data from `source` to `target` vertex', async() => {
      const mode: IMode = 'async'
      const input: IInput = {data: 'foo', meta: {sequence: {type: 'chain', data: []}, mode}, opts: {}}
      const handler: IHandler = ({data, meta}: IInput) => new Promise((resolve) => {
        setTimeout(() => resolve({data: {path: (data.path || '') + meta.sequence.data.slice(-1)}}), 100)
      })
      const res = executor({graph, handler, traverser, input})

      await expect(res).resolves.toEqual({
        opts: {},
        data: {
          path: 'ABC',
        },
        meta: {
          mode: 'async',
          sequence: {
            type: 'chain',
            data: [
              'A',
              'B',
              'C',
            ],
          },
        },
        stack: {
          _storage: [{
            data: 'foo',
            meta: {mode: 'async', sequence: {type: 'chain', data: []}},
            'opts': {},
          }, {
            data: {path: 'A'},
            meta: {mode: 'async', sequence: {type: 'chain', data: ['A']}},
            opts: {},
          }, {
            data: {path: 'AB'},
            meta: {mode: 'async', sequence: {type: 'chain', data: ['A', 'B']}},
            opts: {},
          }, {
            data: {path: 'ABC'},
            meta: {mode: 'async', sequence: {type: 'chain', data: ['A', 'B', 'C']}},
            opts: {},
          }],
        },
      })
    })
  })
})
