import {
  IArrow,
  IGraphParams,
  IGraph,
  IVertex
} from './interface'

export default class Graph implements IGraph {
  arrows: Array<IArrow>
  vertexes: Array<IVertex>

  constructor({vertexes, arrows}: IGraphParams) {
    this.vertexes = vertexes
    this.arrows = arrows
  }
}

export {
  Graph,
  IGraph,
  IGraphParams
}
