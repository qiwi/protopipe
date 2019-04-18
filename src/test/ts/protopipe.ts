import {
  IEdgeListIncidentor,
  IExecutor,
  IExecutorContext,
  IExecutorOutput,
  IGraph,
  IHandler,
  IInput,
  IOutput, ITraverser,
  ITraverserInput,
  ITraverserOutput, IVertex,
} from '../../main/ts/interface'

import Graph from '../../main/ts/graph'
import {Protopipe, protopipe} from '../../main/ts/protopipe'
import executor from '../../main/ts/executor'

describe('Protopipe', () => {
  const input = {data: 'foo', meta: {sequence: []}, opts: {}}
  const edges = ['AB', 'BC']
  const vertexes = ['A', 'B', 'C']
  const graph = new Graph({
    edges,
    vertexes,
    incidentor: {
      type: 'EDGE_LIST',
      representation: {
        'AB': ['A', 'B'],
        'BC': ['B', 'C'],
      },
    } as IEdgeListIncidentor,
  })
  const handler = ({data}: IInput): IOutput => ({data: {count: (data.count + 1 || 0)}})
  const traverser = ({input: {meta}, graph}: ITraverserInput): ITraverserOutput | null => {
    if (meta.sequence.length === 0) {
      return {meta: {...meta, sequence: ['A']}}
    }

    const arcs: Array<[IVertex, IVertex]> = Object.values(graph.incidentor.representation)
    const prev = meta.sequence[meta.sequence.length - 1]
    const next: IVertex | null = (arcs.find(([head]) => head === prev) || [])[1] || null

    if (next === null) {
      return null
    }

    return {meta: {...meta, sequence: [...meta.sequence, next]}}
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
            sequence: [
              'A',
              'B',
              'C',
            ],
          },
        })
      })
    })

    describe('static', () => {
      describe('#handler', () => {
        it('works as identity', () => {
          const input = {
            data: {},
            meta: {sequence: []},
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
            representation: {
              'AB': ['A', 'B'],
              'BC': ['B', 'C'],
            },
          },
        }
        const _input = {
          data: {},
          meta: {
            sequence: [],
          },
          opts: {},
        }

        it('resolves the first graph vertex as entry point (empty sequence)', () => {
          const input: ITraverserInput = {
            graph,
            input: {
              ..._input,
              meta: {
                sequence: [],
              },
            },

          }

          expect(Protopipe.traverser(input)).toEqual({
            meta: {
              sequence: ['A'],
            },
          })
        })

        it('resolves next vertex by prev meta.sequence and graph declaration', () => {
          expect(Protopipe.traverser({
            graph,
            input: {
              ..._input,
              meta: {
                sequence: ['B'],
              },
            },
          })).toEqual({
            meta: {
              sequence: ['B', 'C'],
            },
          })
        })

        it('returns null if path is not found', () => {
          expect(Protopipe.traverser({
            graph,
            input: {
              ..._input,
              meta: {
                sequence: ['D'],
              },
            },
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
              representation: {},
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
              representation: {},
            },
          })
          const traverser: ITraverser = (input: ITraverserInput): ITraverserOutput => input.input
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
          sequence: [
            'A',
            'B',
            'C',
          ],
        },
      })
    })
  })
})
