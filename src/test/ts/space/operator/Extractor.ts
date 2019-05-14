import {
  Extractor,
  Graph,
  IData,
  IDataRef,
  IPointer,
  ISpace
} from '../../../../main/ts/'

describe('Extractor', () => {
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

  describe('constructor', () => {
    it('returns proper instance', () => {
      const extractor = new Extractor(space)

      expect(extractor).toBeInstanceOf(Extractor)
    })
  })

  // describe('proto', () => {})
  describe('static', () => {
    describe('#find', () => {
      it('gets the first value matching by type', () => {
        expect(Extractor.find(({type}) => type === 'FOO', space)).toBe(foo)
      })

      it('returns undefined if no match found', () => {
        expect(Extractor.find(({type}) => type === 'BAR', space)).toBeUndefined()
      })
    })

    describe('#findByType', () => {
      it('gets the first value matching by type', () => {
        expect(Extractor.findByType('FOO', space)).toBe(foo)
      })

      it('returns undefined if no match found', () => {
        expect(Extractor.findByType('BAR', space)).toBeUndefined()
      })
    })

    describe('#findDataRefs', () => {
      it('gets the first value matching by type', () => {
        const space: ISpace= {
          type: 'SPACE',
          value: [dataRef]
        }
        expect(Extractor.findDataRef(space)).toBe(dataRef)
      })

      it('returns undefined if no match found', () => {
        const space: ISpace= {
          type: 'SPACE',
          value: []
        }
        expect(Extractor.findDataRef(space)).toBeUndefined()
      })
    })
  })
})
