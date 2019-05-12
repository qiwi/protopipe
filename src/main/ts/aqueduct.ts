/** @module protopipe */

import {
  IProcessor,
  IGraphSource,
  ISpace
} from './interface'

import {
  getGraph,
  getState
} from './util'

const _processor = (context) => {
  const { graph, walker, mode, handler, sources, space } = context

  switch (sources.length) {
    case 0:
      return null
    case 1:
      const source = sources[0]
      const metas = walker(source.value.meta)
      const sources = handler()

  }

  return space

}

/**
 * Aqueduct.
 * implements IGraphOperator, IProtopipe.
 * @class Aqueduct
 */

export class Aqueduct {
  static processor: IProcessor = (...sources) => {

    const graph: IGraphSource | undefined = getGraph(...sources)
    const space: ISpace | undefined = getState(...sources)

    console.log('space=', space, 'graph=', graph)

    return {
      type: 'SPACE',
      value: []
    }
  }

  static handle = () => {

  }
}
