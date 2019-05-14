import {Graph, NetProcessor} from '../../../main/ts'

describe('NetProcessor', () => {

  const graph = new Graph({
    edges: ['AB', 'BC'],
    vertexes: ['A', 'B', 'C'],
    incidentor: {
      type: 'EDGE_LIST_INCDR',
      value: {
        'AB': ['A', 'B'],
        'BC': ['B', 'C'],
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
      it('processes data from A to C', () => {
        netProcessor.impact('A')

        console.log('space!!!=', JSON.stringify(netProcessor.space, null, 4))
      })

    })
  })
  // describe('static', () => {})
})

