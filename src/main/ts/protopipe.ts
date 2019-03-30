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
} from './interface'

import _executor from './executor'

export class Protopipe implements IProtopipe {

  graph: IGraph
  handler: IHandler
  traverser: ITraverser
  executor: IExecutor

  constructor(...params: any[]) {
    const {traverser, graph, handler, executor} = Protopipe.parseParams(...params)

    this.graph = graph
    this.handler = handler
    this.traverser = traverser
    this.executor = executor
  }

  process(input: IInput): IExecutorOutput {
    return this.executor({
      graph: this.graph,
      handler: this.handler,
      traverser: this.traverser,
      ...input,
    })
  }

  static parseParams(...params: any[]): IProtopipeOptsNormalized {
    const opts: IProtopipeOpts = params[0]

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
  const opts = Protopipe.parseParams(...params)
  const context = {...opts, ...input}

  return opts.executor(context)
}

export default Protopipe
