import {Graph, NetProcessor} from '../../../main/ts'

describe('NetProcessor', () => {

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

  const netProcessor = new NetProcessor({graph})

  describe('constructor', () => {

    /*it('returns proper instance', () => {
      expect(netProcessor.space).toEqual({
        type: 'SPACE',
        value: []
      })
    })*/
  })

  describe('proto', () => {
    describe('#impact', () => {
      it('processes data from A to D', () => {
        netProcessor.impact('A')

        console.log('space!!!=', JSON.stringify(netProcessor.space, null, 4))
      })

    })
  })
  // describe('static', () => {})
})


