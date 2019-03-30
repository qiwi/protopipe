import {
  IArrow, IExecutor, IExecutorContext, IExecutorOutput, IGraph, IHandler,
  IInput,
  IOutput, ITraverser,
  ITraverserInput,
  ITraverserOutput,
} from '../../main/ts/interface'

import Graph from '../../main/ts/graph'
import {Protopipe} from '../../main/ts/protopipe'
import executor from '../../main/ts/executor'

describe('Protopipe', () => {
  const input = {data: 'foo', meta: {sequence: []}, opts: {}}
  const graph = new Graph({
    vertexes: ['A', 'B', 'C'],
    arrows: [
      {head: 'A', tail: 'B'},
      {head: 'B', tail: 'C'},
    ],
  })
  const handler = ({data}: IInput): IOutput => ({data: {count: (data.count + 1 || 0)}})
  const traverser = ({meta, graph}: ITraverserInput): ITraverserOutput | null => {
    if (meta.sequence.length === 0) {
      return {meta: {...meta, sequence: ['A']}}
    }

    const prev = meta.sequence[meta.sequence.length - 1]
    const next: IArrow | null = graph.arrows.find(({head}) => head === prev) || null

    if (next === null) {
      return null
    }

    return {meta: {...meta, sequence: [...meta.sequence, next.tail]}}
  }

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
      const _input = {
        data: {},
        graph: {
          vertexes: ['A', 'B', 'C'],
          arrows: [
            {head: 'A', tail: 'B'},
            {head: 'B', tail: 'C'},
          ],
        },
        meta: {
          sequence: [],
        },
        opts: {},
      }

      it('resolves the first graph vertex as entry point (empty sequence)', () => {
        const input: ITraverserInput = {
          ..._input,
          meta: {
            sequence: [],
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
          ..._input,
          meta: {
            sequence: ['B'],
          },
        })).toEqual({
          meta: {
            sequence: ['B', 'C'],
          },
        })
      })

      it('returns null if path is not found', () => {
        expect(Protopipe.traverser({
          ..._input,
          meta: {
            sequence: ['D'],
          },
        })).toEqual(null)
      })
    })

    describe('#graph', () => {
      it('contains default empty graph', () => {
        expect(Protopipe.graph).toEqual({
          vertexes: [],
          arrows: [],
        })
      })
    })

    describe('#parseParams', () => {
      it('extracts protopipe opt from params', () => {
        const handler: IHandler = (input: IInput): IOutput => input
        const graph: IGraph = new Graph({
          vertexes: [],
          arrows: [],
        })
        const traverser: ITraverser = (input: ITraverserInput): ITraverserOutput => input
        const executor: IExecutor = (context: IExecutorContext): IExecutorOutput => context
        const params = {
          graph,
          handler,
          traverser,
          executor,
        }
        const opts = Protopipe.parseParams(params)

        expect(opts).toEqual(params)
      })

      it('injects default values otherwise', () => {
        const opts = Protopipe.parseParams({})

        expect(opts).toEqual({
          graph: Protopipe.graph,
          handler: Protopipe.handler,
          traverser: Protopipe.traverser,
          executor: Protopipe.executor,
        })
      })
    })
  })
})
