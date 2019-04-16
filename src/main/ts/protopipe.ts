import {
  IGraph,
  IHandler,
  ITraverser,
  IInput,
  IExecutorOutput,
  IProtopipe,
  IProtopipeOpts,
  IProtopipeOptsNormalized,
  IExecutor,
  IArrow,
  IGraphOperator,
  IGraphOperationMap,
} from './interface'

import _executor from './executor'

export class Protopipe implements IProtopipe, IGraphOperator {

  graph: IGraph
  handler: IHandler
  traverser: ITraverser
  executor: IExecutor
  operations: IGraphOperationMap

  constructor(...params: any[]) {
    const {traverser, graph, handler, executor} = Protopipe.parser(...params)

    this.graph = graph
    this.handler = handler
    this.traverser = traverser
    this.executor = executor
    this.operations = {
      process: this.process
    }
  }

  process(input: IInput): IExecutorOutput {
    return this.executor({
      graph: this.graph,
      handler: this.handler,
      traverser: this.traverser,
      ...input,
    })
  }

  static parser(...params: any[]): IProtopipeOptsNormalized {
    const opts: IProtopipeOpts = params[0]

    if (opts && typeof opts.parser === 'function') {
      return opts.parser(...params)
    }

    return {
      executor: this.executor,
      handler: this.handler,
      traverser: this.traverser,
      graph: this.graph,
      ...opts,
    }
  }

  static executor: IExecutor = _executor

  static handler: IHandler = (input) => input

  static graph: IGraph = {
    vertexes: [],
    arrows: [],
  }

  static traverser: ITraverser = ({meta, graph}) => {
    const {sequence} = meta

    if (sequence.length === 0) {
      if (graph.vertexes.length !== 0) {
        return {
          meta: {...meta, sequence: [graph.vertexes[0]]},
        }
      }
    }

    const prev = sequence[sequence.length - 1]
    const next: IArrow | null = graph.arrows.find(({head}) => head === prev) || null

    if (next) {
      return {
        meta: {...meta, sequence: [...meta.sequence, next.tail]},
      }
    }

    return null
  }

}

export const protopipe = (...params: any[]) => (input: IInput): IExecutorOutput => {
  const opts = Protopipe.parser(...params)
  const context = {...opts, ...input}

  return opts.executor(context)
}

export default Protopipe
