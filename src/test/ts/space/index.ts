import {
  ISpace,
  findByType,
  findDataRefs,
  Graph,
  IDataRef,
  IPointer,
  IData
} from '../../../main/ts/'

describe('space', () => {
  describe('extractors', () => {
    const foo = {
      type: 'FOO',
      value: 'foo'
    }
    const space: ISpace = {
      type: 'SPACE',
      value: [foo]
    }
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
          'AD': ['A', 'D']
        },
      },
    })
    const pointer: IPointer = {
      type: 'POINTER',
      value: {
        graph,
        vertex: 'A'
      }
    }
    const data: IData = {
      type: 'DATA',
      value: {}
    }
    const dataRef: IDataRef = {
      type: 'DATA_REF',
      value: {
        pointer,
        value: data
      }
    }

    describe('#findByType', () => {
      it('gets the first value matching by type', () => {
        expect(findByType('FOO', space)).toBe(foo)
      })

      it('returns undefined if no match found', () => {
        expect(findByType('BAR', space)).toBeUndefined()
      })
    })

    describe('#findDataRefs', () => {
      it('gets the first value matching by type', () => {
        const space: ISpace= {
          type: 'SPACE',
          value: [dataRef]
        }
        expect(findDataRefs(space)).toBe(dataRef)
      })

      it('returns undefined if no match found', () => {
        const space: ISpace= {
          type: 'SPACE',
          value: []
        }
        expect(findDataRefs(space)).toBeUndefined()
      })
    })
  })
})
