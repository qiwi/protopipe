/** @module protopipe */

import {
  IAnySource,
  IGraphSource,
  ISpace
} from './interface'

export const promisify = (result: any): Promise<any> => Promise.resolve(result)



export const findSourceByType = (type: string, ...sources: Array<IAnySource>): IAnySource | undefined => {
  return sources.find(source => source.type === type)
}

export const getGraph = (...sources: Array<IAnySource>): IGraphSource | undefined => findSourceByType('GRAPH', ...sources)
// export const getState = (...sources: Array<IAnySource>): ISpace | undefined => findSourceByType('SPACE', ...sources)
export const getState = findSourceByType.bind(null,'SPACE') as (...sources: Array<IAnySource>) => ISpace | undefined

/*
export const getSourcesTo = (space: ISpace): Array<IAnySource> => {
  return []
}
*/
