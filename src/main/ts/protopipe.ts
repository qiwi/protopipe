import {
  IGraph,
  IHandler,
  ITraverser,
  IInput,
  IExecutorOutput,
  IProtopipe,
  IProtopipeOpts,
  IExecutor,
} from './interface'

import _executor from './executor'

export default class Protopipe implements IProtopipe {

  graph: IGraph
  handler: IHandler
  traverser: ITraverser
  executor: IExecutor

  constructor(opts: IProtopipeOpts) {
    const {traverser, graph, handler, executor} = opts

    this.graph = graph
    this.handler = handler
    this.traverser = traverser
    this.executor = executor || _executor
  }

  process(input: IInput): IExecutorOutput {
    return this.executor({
      graph: this.graph,
      handler: this.handler,
      traverser: this.traverser,
      ...input,
    })
  }

}
