import {
  IAny,
  IVertex,
  IEdge,
  IGraph,
} from '../interface'


function staticImplements<T>() {
  return <U extends T>(constructor: U) => {constructor};
}

interface Type<T> {
  new (...args: any[]): T;
}

export type IGraphOperation = (...params: IAny[]) => IAny

export type IGraphOperator = {
  [key: string]: IGraphOperation
} & {
  graph: IGraph,
}

export type IGraphStaticOperation = (graph: IGraph, ...params: IAny[]) => IAny

export interface IGraphStaticOperator extends Type<IGraphOperator> {
  [key: string]: IGraphStaticOperation
}

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

  static getInDegree(graph: IGraph, vertex: IVertex): number {
    return this.getInEdgesOf(graph, vertex).length
  }
  static getOutDegree(graph: IGraph, vertex: IVertex): number {
    return this.getOutEdgesOf(graph, vertex).length
  }

  static getDegree (graph: IGraph, vertex: IVertex): number {
    return this.getEdgesOf(graph, vertex).length
  }

  static getEdgesOf(graph: IGraph, vertex: IVertex): Array<IEdge> {
    return [...this.getInEdgesOf(graph, vertex), ...this.getOutEdgesOf(graph, vertex)]
  }

  static getOutEdgesOf(graph: IGraph, vertex: IVertex): Array<IEdge> {
    const edges = graph.edges

    return edges.filter((edge: IEdge) => {
      const [head]: [IVertex, IVertex] = graph.incidentor.representation[edge]

      if (head === vertex) {
        return true
      }
    })
  }

  static getInEdgesOf(graph: IGraph, vertex: IVertex): Array<IEdge> {
    return graph.edges.filter((edge: IEdge) => {
      const [, tail]: [IVertex, IVertex] = graph.incidentor.representation[edge]

      if (tail === vertex) {
        return true
      }
    })
  }
}
