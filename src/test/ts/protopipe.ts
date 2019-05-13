import {
  IEdgeListIncidentor,
  IExecutor,
  IExecutorContext,
  IExecutorOutput,
  IGraph,
  IHandler,
  IInput,
  IOutput,
  ITraverser,
  ITraverserInput,
  ITraverserOutput,
  IVertex,
} from '../../main/ts/interface'

import Graph from '../../main/ts/graph'
import {Protopipe, protopipe} from '../../main/ts/protopipe'
import executor from '../../main/ts/executor'

describe('Protopipe', () => {
  const input = {data: 'foo', meta: {sequence: {type: 'chain', data: []}}, opts: {}}
  const edges = ['AB', 'BC']
  const vertexes = ['A', 'B', 'C']
  const graph = new Graph({
    edges,
    vertexes,
    incidentor: {
      type: 'EDGE_LIST',
      value: {
        'AB': ['A', 'B'],
        'BC': ['B', 'C'],
      },
    } as IEdgeListIncidentor,
  })
  const handler = ({data}: IInput): IOutput => ({data: {count: (data.count + 1 || 0)}})
  const traverser = ({sequence, graph}: ITraverserInput): ITraverserOutput | null => {
    if (sequence.data.length === 0) {
      return [{type: 'chain', data: ['A']}]
    }

    const value: Array<[IVertex, IVertex]> = Object.values(graph.incidentor.value)
    const prev = sequence.data[sequence.data.length - 1]
    const next: IVertex | null = (value.find(([head]) => head === prev) || [])[1] || null

    if (next === null) {
      return null
    }

    return [{type: 'chain', data: [...sequence.data, next]}]
  }

  describe('class', () => {
    const protopipe = new Protopipe({
      graph,
      traverser,
      handler,
    })

    describe('constructor', () => {
      it('returns proper instance', () => {
        expect(protopipe).toBeInstanceOf(Protopipe)
        expect(protopipe.handler).toBe(handler)
        expect(protopipe.traverser).toBe(traverser)
        expect(protopipe.executor).toBe(executor)
      })
    })

    describe('proto', () => {
      it('#process processes data', () => {
        const res = protopipe.process(input)

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

    describe('static', () => {
      describe('#handler', () => {
        it('works as identity', () => {
          const input = {
            data: {},
            meta: {sequence: {type: 'chain', data: []}},
            opts: {},
          }
          expect(Protopipe.handler(input)).toBe(input)
        })
      })

      describe('#traverser', () => {
        const graph = {
          edges: ['AB', 'BC'],
          vertexes: ['A', 'B', 'C'],
          incidentor: {
            type: 'EDGE_LIST',
            value: {
              'AB': ['A', 'B'],
              'BC': ['B', 'C'],
            },
          },
        }

        it('resolves the first graph vertex as entry point (empty sequence)', () => {
          const input: ITraverserInput = {
            graph,
            sequence: {type: 'chain', data: []},
          }

          expect(Protopipe.traverser(input)).toEqual([{
            type: 'chain',
            data: ['A'],
          }])
        })

        it('resolves next vertex by prev meta.sequence and graph declaration', () => {
          expect(Protopipe.traverser({
            graph,
            sequence: {type: 'chain', data: ['B']},
          })).toEqual([{
            type: 'chain',
            data: ['B', 'C'],
          }])
        })

        it('returns null if path is not found', () => {
          expect(Protopipe.traverser({
            graph,
            sequence: {type: 'chain', data: ['D']},
          })).toEqual(null)
        })
      })

      describe('#graph', () => {
        it('contains default empty graph', () => {
          expect(Protopipe.graph).toEqual({
            vertexes: [],
            edges: [],
            incidentor: {
              type: 'EDGE_LIST',
              value: {},
            },
          })
        })
      })

      describe('#parser', () => {
        it('extracts protopipe opt from params', () => {
          const handler: IHandler = (input: IInput): IOutput => input
          const graph: IGraph = new Graph({
            edges: [],
            vertexes: [],
            incidentor: {
              type: 'EDGE_LIST',
              value: {},
            },
          })
          const traverser: ITraverser = (input: ITraverserInput): ITraverserOutput => [input.sequence]
          const executor: IExecutor = (context: IExecutorContext): IExecutorOutput => context.input
          const params = {
            graph,
            handler,
            traverser,
            executor,
          }
          const opts = Protopipe.parser(params)

          expect(opts).toEqual(params)
        })

        it('injects default values otherwise', () => {
          const opts = Protopipe.parser({})

          expect(opts).toEqual({
            graph: Protopipe.graph,
            handler: Protopipe.handler,
            traverser: Protopipe.traverser,
            executor: Protopipe.executor,
          })
        })

        it('supports parser impl override', () => {
          const opts = Protopipe.parser({
            parser() {
              return {
                graph: Protopipe.graph,
                handler: Protopipe.handler,
                traverser: Protopipe.traverser,
                executor: Protopipe.executor,
                foo: 'bar',
              }
            },
          })

          expect(opts).toEqual({
            graph: Protopipe.graph,
            handler: Protopipe.handler,
            traverser: Protopipe.traverser,
            executor: Protopipe.executor,
            foo: 'bar',
          })
        })
      })
    })
  })

  describe('lambda-function', () => {
    it('processes data', () => {
      const res = protopipe({
        handler,
        traverser,
        graph,
      })(input)

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
})
