import {Graph, ISpace, NetProcessor} from '../../../main/ts'

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
  const handler = (...args: any[]) => console.log('args=', JSON.stringify(args.map(v => v.value.pointer.value.vertex), null, 2))

  // describe('constructor', () => {})

  describe('proto', () => {
    describe('#impact', () => {
      it('synchronously processes data from A to D', () => {
        const netProcessor = new NetProcessor({graph, handler})
        const space = netProcessor.impact(true,'A') as ISpace
        const res = space.value[space.value.length - 1]

        expect(res.value.pointer.value.vertex).toBe('D')
      })

      it('asynchronously processes data from A to D', async() => {
        const netProcessor = new NetProcessor({graph, handler})
        const space = await netProcessor.impact(false,'A') as ISpace
        const res = space.value[space.value.length - 1]

        expect(res.value.pointer.value.vertex).toBe('D')
      })
    })
  })

  // describe('static', () => {})
})
