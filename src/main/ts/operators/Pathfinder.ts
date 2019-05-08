import {
  IAny, IEdge,
  IGraph,
  IVertex,
} from '../interface'

type IGraphOperation = (...params: IAny[]) => IAny

type IGraphStaticOperation = (graph: IGraph, ...params: IAny[]) => IAny

interface IGraphOperator {
  graph: IGraph,
  [key: string]: IAny
}

interface IGraphStaticOperator {
  [key: string]: IGraphStaticOperation
}

export const pathfinder: IGraphStaticOperator = {
  getInDegree(graph: IGraph, vertex: IVertex): number { return pathfinder.getInEdgesOf(graph, vertex).length },
  getOutDegree(graph: IGraph, vertex: IVertex): number { return pathfinder.getOutEdgesOf(graph, vertex).length },
  getDegree(graph: IGraph, vertex: IVertex): number { return pathfinder.getEdgesOf(graph, vertex).length },

  getEdgesOf(graph: IGraph, vertex: IVertex) {
    return [...pathfinder.getInEdgesOf(graph, vertex), ...pathfinder.getOutEdgesOf(graph, vertex)]
  },

  getOutEdgesOf(graph: IGraph, vertex: IVertex): Array<IEdge> {
    const edges = graph.edges

    return edges.filter((edge: IEdge) => {
      const [head]: [IVertex, IVertex] = graph.incidentor.representation[edge]

      if (head === vertex) {
        return true
      }
    })
  },

  getInEdgesOf(graph: IGraph, vertex: IVertex) {
    return graph.edges.filter((edge: IEdge) => {
      const [, tail]: [IVertex, IVertex] = graph.incidentor.representation[edge]

      if (tail === vertex) {
        return true
      }
    })
  }
}

export class Pathfinder implements IGraphOperator {
  graph: IGraph
  [key: string]: IAny

  constructor(graph: IGraph) {
    this.graph = graph
  }

  getDegree: IGraphOperation = (vertex: IVertex) => Pathfinder.getDegree(this.graph, vertex)
  getInDegree: IGraphOperation = (vertex: IVertex) => Pathfinder.getInDegree(this.graph, vertex)
  getOutDegree: IGraphOperation = (vertex: IVertex) => Pathfinder.getOutDegree(this.graph, vertex)

  getEdgesOf: IGraphOperation = (vertex: IVertex) => Pathfinder.getEdgesOf(this.graph, vertex)
  getInEdgesOf: IGraphOperation = (vertex: IVertex) => Pathfinder.getInEdgesOf(this.graph, vertex)
  getOutEdgesOf: IGraphOperation = (vertex: IVertex) => Pathfinder.getOutEdgesOf(this.graph, vertex)

  static getDegree: IGraphStaticOperation = pathfinder.getDegree
  static getInDegree: IGraphStaticOperation = pathfinder.getInDegree
  static getOutDegree: IGraphStaticOperation = pathfinder.getOutDegree

  static getEdgesOf: IGraphStaticOperation = pathfinder.getEdgesOf
  static getInEdgesOf: IGraphStaticOperation = pathfinder.getInEdgesOf
  static getOutEdgesOf: IGraphStaticOperation = pathfinder.getOutEdgesOf
}
