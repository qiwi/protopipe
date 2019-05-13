import {Aqueduct} from '../../main/ts/aqueduct'
import Graph from '../../main/ts/graph'
/*import {
  IInput,
  IOutput,
} from '../../main/ts/interface'*/

describe('aqueduct', () => {
  const graph = new Graph({
    edges: ['AB', 'AC', 'BC', 'BD', 'CD', 'AD'],
    vertexes: ['A', 'B', 'C', 'D'],
    incidentor: {
      type: 'EDGE_LIST',
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

  describe('static', () => {
    describe('processor', () => {
      it('processes space through graph', () => {
        Aqueduct.processor({
          type: 'GRAPH',
          value: graph
        }, {
          type: 'STATE',
          value: []
        })
      })
    })
  })

  /*const input: IInput = {data: {count: 0}, meta: {sequence: {type: 'chain', data: ['A']}}, opts: {}}
  const graph = new Graph({
    edges: ['AB', 'BC'],
    vertexes: ['A', 'B', 'C', 'D'],
    incidentor: {
      type: 'EDGE_LIST',
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
  const handler = ({data}: IInput): IOutput => ({data: {count: (data.count++)}})
  */

  /*const aqueduct = new Aqueduct({
    graph,
    handler
  })*/

/*  describe('SYNC', () => {
    it('processes', () => {
      const res = aqueduct.process(input)

      console.log(JSON.stringify(res))
    })
  })*/
})
