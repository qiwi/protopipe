import {
  IArrow,
  IGraphParams,
  IGraph,
  IVertex,
} from './interface'

export default class Graph implements IGraph {

  arrows: Array<IArrow>
  vertexes: Array<IVertex>

  constructor(params: IGraphParams) {
    const {vertexes, arrows} = params

    this.vertexes = vertexes
    this.arrows = arrows
  }

}

export {
  Graph,
  IGraph,
  IGraphParams,
}
