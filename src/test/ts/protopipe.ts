import {
  IArrow,
  IInput,
  IOutput,
  ITraverserInput,
  ITraverserOutput
} from '../../main/ts/interface'

import Graph from '../../main/ts/graph'
import Protopipe from '../../main/ts/protopipe'
import executor from '../../main/ts/executor'

describe('protopipe', () => {
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
      return {meta: {...meta, sequence: ['A']}}
    }

    const prev = meta.sequence[meta.sequence.length - 1]
    const next: IArrow | null  = graph.arrows.find(({head}) => head === prev) || null

    if (next === null) {
      return null
    }

    return {meta: {...meta, sequence: [...meta.sequence, next.tail]}}
  }

  const protopipe = new Protopipe({
    graph,
    traverser,
    handler
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
          count: 2
        },
        meta: {
          sequence: [
            'A',
            'B',
            'C'
          ]
        }
      })
    })
  })

  describe('static', () => {})
})
