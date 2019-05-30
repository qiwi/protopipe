import {Graph, /*IAny, ISpaceElement,*/ ISpace, NetProcessor} from '../../../main/ts'

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

  const handler = (...args: any[]) => console.log('args=', JSON.stringify(args, null, 2))

  // describe('constructor', () => {})

  describe('proto', () => {
    describe('#impact', () => {
      it('synchronously processes data from A to D', () => {
        const netProcessor = new NetProcessor({graph, handler})
        const space = netProcessor.impact(true,'A') as ISpace

        const res = NetProcessor.getData(space, 'D')


        //console.log('space=', JSON.stringify(space, null, 2))

        expect(res).toEqual({
          type: 'DATA',
          value: 1
        })
      })
/*
      it('asynchronously processes data from A to D', async() => {
        const netProcessor = new NetProcessor({graph, handler})
        const space = await netProcessor.impact(false,'A') as ISpace
        const res = space.value.last()

        // expect(res.value.pointer.value.vertex).toBe('D')
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
          graph: (prev: ISpaceElement): IAny => +prev.value * 2,
          vertexes: {
            'B': (prev: ISpaceElement): IAny => +prev.value * 100,
          },
        }
        const protopipe = new NetProcessor({
          graph,
          handler,
        })
        const space = protopipe.impact(true, ['A', 1]) as ISpace


        expect(space).toBeUndefined()
        // expect(space.value[6].value).toBe(200)
      })
      */
    })
  })

  // describe('static', () => {})
})
