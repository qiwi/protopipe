/** @module protopipe */

import {
  IAnySource,
  IGraphSource,
  IState
} from './interface'

export const promisify = (result: any): Promise<any> => Promise.resolve(result)



export const findSourceByType = (type: string, ...sources: Array<IAnySource>): IAnySource | undefined => {
  return sources.find(source => source.type === type)
}

export const getGraph = (...sources: Array<IAnySource>): IGraphSource | undefined => findSourceByType('GRAPH', ...sources)
export const getState = (...sources: Array<IAnySource>): IState | undefined => findSourceByType('STATE', ...sources)

export const getSourcesTo = (state: IState): Array<IAnySource> => {
  return []
}
