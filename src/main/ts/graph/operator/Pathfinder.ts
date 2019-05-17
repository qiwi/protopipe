import {
  IAny,
  staticImplements,
} from '../../types'

import {
  IVertex,
  IEdge,
  IGraph,
  IGraphStaticOperator,
} from '../types'

/**
 * Pathfinder.
 * Class implements path resolving utils.
 */
@staticImplements<IGraphStaticOperator>()
export class Pathfinder {

  graph: IGraph
  [key: string]: IAny

  constructor(graph: IGraph) {
    this.graph = graph
  }

  getDegree(vertex: IVertex): number {
    return Pathfinder.getDegree(this.graph, vertex)
  }

  getInDegree(vertex: IVertex): number {
    return Pathfinder.getInDegree(this.graph, vertex)
  }

  getOutDegree(vertex: IVertex): number {
    return Pathfinder.getOutDegree(this.graph, vertex)
  }

  getEdgesOf(vertex: IVertex): Array<IEdge> {
    return Pathfinder.getEdgesOf(this.graph, vertex)
  }

  getInEdgesOf(vertex: IVertex): Array<IEdge> {
    return Pathfinder.getInEdgesOf(this.graph, vertex)
  }

  getOutEdgesOf(vertex: IVertex): Array<IEdge> {
    return Pathfinder.getOutEdgesOf(this.graph, vertex)
  }

  getInVertexes(vertex: IVertex): Array<IEdge> {
    return Pathfinder.getInVertexes(this.graph, vertex)
  }

  getOutVertexes(vertex: IVertex): Array<IEdge> {
    return Pathfinder.getOutVertexes(this.graph, vertex)
  }

  static getInDegree(graph: IGraph, vertex: IVertex): number {
    return this.getInEdgesOf(graph, vertex).length
  }
  static getOutDegree(graph: IGraph, vertex: IVertex): number {
    return this.getOutEdgesOf(graph, vertex).length
  }

  static getDegree(graph: IGraph, vertex: IVertex): number {
    return this.getEdgesOf(graph, vertex).length
  }

  static getEdgesOf(graph: IGraph, vertex: IVertex): Array<IEdge> {
    return [...this.getInEdgesOf(graph, vertex), ...this.getOutEdgesOf(graph, vertex)]
  }

  static getOutEdgesOf(graph: IGraph, vertex: IVertex): Array<IEdge> {
    const edges = graph.edges

    return edges.filter((edge: IEdge) => {
      const [head]: [IVertex, IVertex] = graph.incidentor.value[edge]

      return head === vertex
    })
  }

  static getInEdgesOf(graph: IGraph, vertex: IVertex): Array<IEdge> {
    return graph.edges.filter((edge: IEdge) => {
      const [, tail]: [IVertex, IVertex] = graph.incidentor.value[edge]

      return tail === vertex
    })
  }

  static getAdjunctiveVertexes(strategy: 'HEAD' | 'TAIL', graph: IGraph, vertex: IVertex): IVertex[] {
    return graph.edges.reduce((memo: IVertex[], edge: IEdge) => {
      const [head, tail]: [IVertex, IVertex] = graph.incidentor.value[edge]
      const adjVertex = strategy === 'HEAD'
        ? head === vertex ? tail : null
        : tail === vertex ? head : null

      if (adjVertex) {
        memo.push(adjVertex)
      }

      return memo
    }, [])

  }

  static getOutVertexes = Pathfinder.getAdjunctiveVertexes.bind(null, 'HEAD')
  static getInVertexes = Pathfinder.getAdjunctiveVertexes.bind(null, 'TAIL')

}
