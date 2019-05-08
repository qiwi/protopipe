/** @module protopipe */

import {
  IProcessor,
  IGraphSource,
  IState
} from './interface'

import {
  getGraph,
  getState
} from './util'

const _processor = (context) => {
  const { graph, walker, mode, handler, sources, state } = context

  switch (sources.length) {
    case 0:
      return null
    case 1:
      const source = sources[0]
      const metas = walker(source.value.meta)
      const sources = handler()

  }

  return state

}

/**
 * Aqueduct.
 * implements IGraphOperator, IProtopipe.
 * @class Aqueduct
 */

export class Aqueduct {
  static processor: IProcessor = (...sources) => {

    const graph: IGraphSource | undefined = getGraph(...sources)
    const state: IState | undefined = getState(...sources)

    console.log('state=', state, 'graph=', graph)

    return {
      type: 'STATE',
      value: []
    }
  }

  static handle = () => {

  }
}
