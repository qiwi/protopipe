import Executor from '../../main/ts/executor'
import Graph from '../../main/ts/graph'
import {
  IArrow,
  IInput,
  IOutput,
  ITraverserInput,
  ITraverserOutput
} from '../../main/ts/interface'

describe('executor', () => {
  const input = {data: 'foo', meta: {sequence: []}, opts: {}}
  const graph = new Graph({
    vertexes: ['A', 'B', 'C'],
    arrows: [
      {head: 'A', tail: 'B'},
      {head: 'B', tail: 'C'},
    ]
  })
  const handler = ({data}: IInput): IOutput => ({data: {count: (data.count + 1 || 0)}})
  const traverser = ({meta, graph}: ITraverserInput): ITraverserOutput | null => {
    if (meta.sequence.length === 0) {
      return {meta: {sequence: ['A']}}
    }

    const prev = meta.sequence[meta.sequence.length - 1]
    const next: IArrow | null  = graph.arrows.find(({head}) => head === prev) || null

    if (next === null) {
      return null
    }

    return {meta: {sequence: [...meta.sequence, next.tail]}}
  }
  const executor = new Executor()

  describe('constructor', () => {
    it('returns proper instance', () => {
      expect(executor).toBeInstanceOf(Executor)
    })
  })

  describe('proto', () => {})

  describe('static', () => {
    describe('#process', () => {
      it('transits data from `source` to `target` vertex', () => {
        const res = Executor.process({graph, handler, traverser, ...input})

        expect(res).toEqual({
            opts: {},
            data: {
              count: 2
            },
            meta: {
              sequence: [
                'A',
                'B',
                'C'
              ]
            }
          }
        )
      })
    })
  })
})

