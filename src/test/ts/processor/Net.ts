import {Graph, IAny, /*IAny, ISpaceElement,*/ ISpace, NetProcessor} from '../../../main/ts'

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
        'AD': ['A', 'D'],
      },
    },
  })

  const handler = (space: ISpace) => {
    // console.log('args=', JSON.stringify(space, null, 2))
    return  NetProcessor.requireElt('ANCHOR', space).value.vertex
  }

  // describe('constructor', () => {})

  describe('proto', () => {
    describe('#impact', () => {
      it('synchronously processes data from A to D', () => {
        const netProcessor = new NetProcessor({graph, handler})
        const space = netProcessor.impact(true,'A') as ISpace
        const res = NetProcessor.getData(space, 'D')

        expect(res).toEqual({
          id: expect.any(String),
          type: 'DATA',
          value: 'D'
        })
      })

      it('asynchronously processes data from A to D', async() => {
        const netProcessor = new NetProcessor({graph, handler})
        const space = await netProcessor.impact(false,'A') as ISpace
        const res = NetProcessor.getData(space, 'D')

        expect(res).toEqual({
          id: expect.any(String),
          type: 'DATA',
          value: 'D'
        })
      })

      it('uses the most specific step handler', () => {
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
        const handler = {
          graph: (space: ISpace): IAny => (NetProcessor.getData(space) || {value: 0}).value * 2,
          vertexes: {
            'B': (space: ISpace): IAny => (NetProcessor.getData(space, 'A') || {value: 10}).value * 3,
          },
        }
        const protopipe = new NetProcessor({
          graph,
          handler,
        })
        const space = protopipe.impact(true, ['A', 1]) as ISpace

        expect(NetProcessor.getData(space, 'C')).toEqual({
          id: expect.any(String),
          type: 'DATA',
          value: 6
        })
      })

    })
  })

  // describe('static', () => {})
})
