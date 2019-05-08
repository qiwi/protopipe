/** @module protopipe */

import {
  IAny,
  IGraph,
  IHandler,
  ITraverser,
  IInput,
  IExecutorOutput,
  IProtopipe,
  IProtopipeParams,
  IProtopipeParamsNormalized,
  IExecutor,
  IGraphOperator,
  IGraphOperationMap,
  IVertex,
  IEdgeListIncidentor,
} from './interface'

import _executor from './executor'

/**
 * Basic IGraphOperator, IProtopipe implementation for data processing.
 * @class Protopipe
 */
export class Protopipe implements IProtopipe, IGraphOperator {

  graph: IGraph
  handler: IHandler
  traverser: ITraverser
  executor: IExecutor
  operations: IGraphOperationMap
  [key: string]: IAny

  constructor(...params: any[]) {
    const {traverser, graph, handler, executor} = Protopipe.parser(...params)

    this.graph = graph
    this.handler = handler
    this.traverser = traverser
    this.executor = executor
    this.operations = {
      process: this.process,
    }
  }

  process(input: IInput): IExecutorOutput {
    return this.executor({
      graph: this.graph,
      handler: this.handler,
      traverser: this.traverser,
      executor: this.executor,
      input,
    })
  }

  static parser(...params: any[]): IProtopipeParamsNormalized {
    const opts: IProtopipeParams = params[0]

    if (opts && typeof opts.parser === 'function') {
      return opts.parser(...params)
    }

    return {
      ...opts,
      executor: opts.executor || this.executor,
      handler: opts.handler || this.handler,
      traverser: opts.traverser || this.traverser,
      graph: opts.graph || this.graph,
    }
  }

  static executor: IExecutor = _executor

  static handler: IHandler = (input: Array<IInput>) => input[0]

  static graph: IGraph = {
    vertexes: [],
    edges: [],
    incidentor: {
      type: 'EDGE_LIST',
      representation: {},
    } as IEdgeListIncidentor,
  }

  static traverser: ITraverser = ({sequence, graph, stack}) => {

    if (sequence.data.length === 0) {
      if (graph.vertexes.length !== 0) {
        return [{
          type: 'chain',
          data: [graph.vertexes[0]],
        }]
      }
    }

    const arcs: Array<[IVertex, IVertex]> = Object.values(graph.incidentor.representation)
    const prev = sequence.data[sequence.data.length - 1]
    const next: Array<IVertex> = arcs.reduce((memo: Array<IVertex>, [head, tail]: [IVertex, IVertex]) => {
      if (head === prev) {
        memo.push(tail)
      }

      return memo
    }, [])

    if (next.length === 0) {
      return null
    }

    // checks that all sources was processed
    // TODO use event stack
    if (stack) {
      const sources: Array<IVertex> = arcs.reduce((memo: Array<IVertex>, [head, tail]: [IVertex, IVertex]) => {
        if (tail === prev) {
          memo.push(head)
        }

        return memo
      }, [])

      const processed = stack.filter(({meta: {sequence}}) => sources.includes(sequence[sequence.length - 1]))

      if (sources.length !== processed.length) {
        return null
      }
    }

    return next.map(tail => ({
      type: 'chain',
      data: [...sequence.data, tail],
    }))

  }

}

export const protopipe = (...params: any[]) => (input: IInput): IExecutorOutput => {
  const opts = Protopipe.parser(...params)
  const context = {...opts, input}

  return opts.executor(context)
}

export default Protopipe
